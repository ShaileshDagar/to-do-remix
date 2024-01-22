import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect } from "react";
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
    return client.authStore.isValid
  }

export default function Signup() {
    //redirect to "/list" if logged in
    const navigate = useNavigate()
    const isUserValid = useLoaderData<typeof loader>()
    useEffect(() => {
        if(isUserValid)
        return navigate("/list")
    }, [isUserValid])
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