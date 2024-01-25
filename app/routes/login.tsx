import { ActionFunctionArgs } from "@remix-run/node";
import { Form, redirect, useSearchParams } from "@remix-run/react";
import { client, login, oAuthLogin } from "~/pocketbase";

export async function action({request}: ActionFunctionArgs) {
    const formData = await request.formData()
    const _action = formData.get("_action")
    if(_action === "normal"){
        const email = formData.get("email")
        const password = formData.get("password")
        await login(email, password)
    }
    else
        await oAuthLogin()
    return redirect("/list")
}

export function loader() {
    const isUserValid = client.authStore.isValid
    if(isUserValid)
        throw redirect("/list")
    return null
  }

export default function Login() {
    const searchParams = useSearchParams()
    return <>
        {searchParams && <p>{searchParams[0].get("message")}</p>}
        <Form method="post">
            <input
                autoComplete="email"
                type="email"
                placeholder="abc@abc.com"
                name="email"/>
            <input
                type="password"
                placeholder="********"
                name="password"/>
            <button type="submit" name="_action" value="normal">Sign in</button>
            <button type="submit" name="_action" value="oauth">Sign in with Google</button>
        </Form>
    </>
}