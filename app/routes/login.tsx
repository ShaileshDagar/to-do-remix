import { ActionFunctionArgs } from "@remix-run/node";
import { Form, redirect, useLoaderData, useNavigate } from "@remix-run/react";
import { useEffect } from "react";
import { client, login } from "~/pocketbase";

export async function action({request}: ActionFunctionArgs) {
    const formData = await request.formData()
    const email = formData.get("email")
    const password = formData.get("password")
    await login(email, password)
    return redirect("/list")
}

export async function loader() {
    return client.authStore.isValid
  }

export default function Login() {
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
                type="email"
                placeholder="abc@abc.com"
                name="email"/>
            <input
                type="password"
                placeholder="********"
                name="password"/>
            <button type="submit">Sign in</button>
        </Form>
    </>
}