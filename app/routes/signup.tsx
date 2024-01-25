import { ActionFunctionArgs, MetaFunction, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { client, signup } from "~/pocketbase";

export const meta: MetaFunction = () => {
    return [
      { title: "Sign Up" },
      { name: "description", content: "Sign up as new User" },
    ];
  };
  
export async function action({request}: ActionFunctionArgs) {
    const formData = await request.formData()
    const email = formData.get("email")
    const password = formData.get("password")
    await signup(email, password)
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
                type="email"
                placeholder="abc@abc.com"
                name="email"/>
            <input
                type="password"
                placeholder="********"
                name="password"/>
            <button type="submit">Sign Up</button>
        </Form>
    </>
}