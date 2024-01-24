import { ActionFunctionArgs, LoaderFunctionArgs, defer } from "@remix-run/node"
import { Await, Form, useFetcher, useLoaderData, useNavigation } from "@remix-run/react"
import { Suspense, useEffect, useRef } from "react"
import { redirect } from "react-router"
import { Item, ListViewResponse } from "~/interface"
import { client, createTask, deleteTask, getList } from "~/pocketbase"

export async function loader({request}: LoaderFunctionArgs) {
    const isUserValid = client.authStore.isValid
    if(!isUserValid){
        const message = "You must login first!"
        throw redirect(`/login?message=${message}`)
    }
    return defer({response: getList()})
    
}

export async function action({request}: ActionFunctionArgs) {
    const formData = await request.formData()
    const _action = formData.get("_action")
    if(_action === "create"){
        const task = formData.get("task")
        await createTask(task, client.authStore.model?.id)
    }
    if(_action === "delete"){
        const taskId = formData.get("id")
        await deleteTask(taskId)
    }
    return null
}

export default function List() {
    const loaderDataPromise = useLoaderData<typeof loader>()
    const navigation = useNavigation()
    const isAdding = navigation.state === "submitting" && navigation.formData?.get("_action") === "create"
    const formRef = useRef<HTMLFormElement>()

    useEffect(() => {
        if(isAdding)
            formRef.current?.reset()
    }, [isAdding])

    function renderList(loadedList: ListViewResponse) {
        const listEls = loadedList.items.map((item) => {
            return <ListItem item={item} key={item.id} />
        })
        return listEls
    }
    
    return <div>
        <h2>Pending Tasks:</h2>
        <ul>
            <Suspense fallback={<h1>Loading List...</h1>}>
                <Await resolve={loaderDataPromise.response}>
                    {renderList}
                </Await>
            </Suspense>
            {isAdding && <li>{navigation.formData?.get("task")}</li>}
            <li>
                <Form ref={formRef} method="POST">
                    <input 
                        type="text"
                        name="task"
                        placeholder="Add Task"
                    />
                    <button disabled={isAdding} type="submit" name="_action" value="create">Add Task</button>
                </Form>
            </li>
        </ul>
    </div>
}

function ListItem({item}) {
    const fetcher = useFetcher()
    const isDeleting = fetcher.formData?.get("id") === item.id
    return (
        <li hidden={isDeleting} key={item.id}>
            {item.task}{" "}
            <fetcher.Form method="DELETE" style={{display: "inline"}}>
                <input type="hidden" name="id" value={item.id}/>
                <button type="submit" aria-label="delete" name="_action" value="delete">Delete</button>
            </fetcher.Form>
        </li>)
}