import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node"
import { Form, useLoaderData } from "@remix-run/react"
import { redirect } from "react-router"
import { client, createTask, deleteTask, getList } from "~/pocketbase"

export async function loader({request}: LoaderFunctionArgs) {
    const isUserValid = client.authStore.isValid
    if(!isUserValid){
        const message = "You must login first!"
        throw redirect(`/login?message=${message}`)
    }
    // console.log(
    return getList()
    
}

export async function action({request}: ActionFunctionArgs) {
    const formData = await request.formData()
    const _action = formData.get("_action")
    console.log(formData)
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
    //
    const list = useLoaderData<typeof loader>()
    const listEls = list.items.map((item) => {
        return (
            <li key={item.id}>{item.task}{" "}
                <Form method="DELETE" style={{display: "inline"}}>
                    <input type="hidden" name="id" value={item.id}/>
                    <button type="submit" aria-label="delete" name="_action" value="delete">Delete</button>
                </Form>
            </li>)
    })
    return <div>
        <h2>Pending Tasks:</h2>
        <ul>
            {listEls}
            <li>
                <Form method="POST">
                    <input 
                        type="text"
                        name="task"
                        placeholder="Add Task"
                    />
                    <button type="submit" name="_action" value="create">Add Task</button>
                </Form>
            </li>
        </ul>
    </div>
}