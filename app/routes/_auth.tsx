import { Outlet } from "@remix-run/react";
import { redirect } from "react-router";
import { client } from "~/pocketbase";

export function loader() {
    const isValid = client.authStore.isValid
    if(!isValid){
        const message = "You must login first!"
        throw redirect(`/login?message=${message}`)
    }
    return null
}

export default function Auth() {
    return (
        <Outlet />
    )
}