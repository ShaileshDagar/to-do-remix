import { redirect } from "react-router"
import { client } from "~/pocketbase"

export function loader() {
    const isUserValid = client.authStore.isValid
    if(!isUserValid){
        const message = "You must login first!"
        throw redirect(`/login?message=${message}`)
    }
    // await client.collection("tasks")
    return null
}
export default function List() {
    //
    
    return <h1>List goes here</h1>
}