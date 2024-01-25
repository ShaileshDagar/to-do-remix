import { ActionFunctionArgs, MetaFunction, defer } from "@remix-run/node"
import { Await, Form, useFetcher, useLoaderData, useNavigation } from "@remix-run/react"
import { Suspense, useEffect, useRef, useState } from "react"
import { ListViewResponse } from "~/interface"
import { client, createTask, deleteTask, getList, patchTask } from "~/pocketbase"
import "../styles/list.css"

export const meta: MetaFunction = () => {
    return [
      { title: "To-Do List" },
      { name: "description", content: "LIst of Pending Tasks" },
    ];
};

export function loader() {
    return defer({response: getList()})
}

export async function action({request}: ActionFunctionArgs) {
    const formData = await request.formData()
    const _action = formData.get("_action")
    if(_action === "create"){
        const task = formData.get("task")
        await createTask(task, client.authStore.model?.id)
    }
    else if(_action === "delete"){
        const taskId = formData.get("id")
        await deleteTask(taskId)
    }
    else if(_action === "patch"){
        const taskId = formData.get("id")
        const task = formData.get("new-task")
        await patchTask(taskId, task)
    }
    return null
}

export default function List() {
    const loaderDataPromise = useLoaderData<typeof loader>()
    const navigation = useNavigation()
    const isAdding = navigation.state === "submitting" && navigation.formData?.get("_action") === "create"
    const formRef = useRef<HTMLFormElement>()
    const taskRef = useRef<HTMLInputElement>()

    useEffect(() => {
        if(isAdding){
            formRef.current?.reset()
            taskRef.current?.focus()
        }
    }, [isAdding])

    function renderList(loadedList: ListViewResponse) {
        const listEls = loadedList.items.map((item) => {
            return <ListItem item={item} key={item.id} />
        })
        return listEls
    }
    
    return <div className="container">
        <h2>Pending Tasks:</h2>
        <ul className="todo-list">
            <Suspense fallback={<h1>Loading List...</h1>}>
                <Await resolve={loaderDataPromise.response}>
                    {renderList}
                </Await>
            </Suspense>
            {isAdding && <li className="todo-item">{navigation.formData?.get("task")}</li>}
            <li>
                <Form ref={formRef} method="POST" className="add-task">
                    <input 
                        type="text"
                        name="task"
                        placeholder="Add Task"
                        ref={taskRef}
                    />
                    <button disabled={isAdding} type="submit" name="_action" value="create">Add Task</button>
                </Form>
            </li>
        </ul>
    </div>
}

function ListItem({item}) {
    const fetcher = useFetcher()
    const isDeleting = fetcher.formData?.get("id") === item.id && fetcher.formData?.get("_action") === "delete"
    const isPatching = fetcher.formData?.get("id") === item.id && fetcher.formData?.get("_action") === "patch"
    let isEditing = fetcher.formData?.get("id") === item.id && fetcher.formData?.get("_action") === "edit"
    let [editing, setEditing] = useState(false)
    const editRef = useRef<HTMLInputElement>()
    useEffect(() => {
        if(isEditing){
            setEditing(true)
            editRef.current?.focus()
        }
        else if(isPatching)
            setEditing(false)
    }, [isEditing, isPatching])
    return (
        <li 
            hidden={isDeleting} 
            key={item.id}
            // style={{opacity: isPatching ? 0.25 : 1}}
            className="todo-item">
            {!editing && item.task}{" "}
            <fetcher.Form method="POST" style={{display: "inline"}}>
                <input type="hidden" name="id" value={item.id}/>
                <input type={editing ? "text": "hidden"} ref={editRef} name="new-task" defaultValue={item.task} />
                {editing && <button type="submit" aria-label="submit" name="_action" value="patch">Submit</button>}
                {!editing && <button type="submit" aria-label="edit" name="_action" value="edit">Edit</button>}
                <button type="submit" aria-label="delete" name="_action" value="delete">Delete</button>
            </fetcher.Form>
        </li>)
}
