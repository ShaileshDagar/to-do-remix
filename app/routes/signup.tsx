import { ActionFunctionArgs, MetaFunction, redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { client, signup } from "~/pocketbase";
import "../styles/auth-form.css"

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
    return <div className="signup-box">
        <h1>Sign Up</h1>
        <Form method="post" className="signup-form">
            <input 
                type="email"
                placeholder="Email"
                name="email"/>
            <input
                type="password"
                placeholder="Password"
                name="password"/>
            <button type="submit">Sign Up</button>
        </Form>
    </div>
}