import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { client, signup } from "~/pocketbase";

export async function action({request}: ActionFunctionArgs) {
    const formData = await request.formData()
    const username = formData.get("username")
    const email = formData.get("email")
    const password = formData.get("password")
    const passwordConfirm = formData.get("passwordConfirm")
    await signup(username, email, password, passwordConfirm)
    return redirect("/list")
}

export async function loader() {
    const isUserValid = client.authStore.isValid
    if(isUserValid)
        throw redirect("/list")
    return null
}

export default function Signup() {
    return <>
        <Form method="post">
            <input 
                type="text"
                placeholder="abc"
                name="username"/>
            <input 
                type="email"
                placeholder="abc@abc.com"
                name="email"/>
            <input
                type="password"
                placeholder="********"
                name="password"/>
            <input
                type="password"
                placeholder="********"
                name="passwordConfirm"/>
            <button type="submit">Sign Up</button>
        </Form>
    </>
}