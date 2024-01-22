import { cli } from '@remix-run/dev';
import { redirect } from '@remix-run/node';
import PocketBase from 'pocketbase';

const url = 'http://127.0.0.1:8090'
export const client = new PocketBase(url);
// export const isUserValid = client.authStore.isValid;

export async function login(username, password) {
    try {
        await client.collection("users").authWithPassword(username, password)
    } catch(err) {
        throw {
            message: "Error logging in"
        }
    }

}

export function logout() {
    client.authStore.clear()
}

export async function signup(username, email, password, passwordConfirm) {
    try {
        if(password !== passwordConfirm)
            throw new Error({message: "Password & Confirm Password fields do not match"})
    }catch(err) {
        throw redirect(`/signup?error=${err.message}`)
    }
    // const data = {
    //     "username": "test_rname",
    //     "email": "t@example.com",
    //     "emailVisibility": true,
    //     "password": "12345678",
    //     "passwordConfirm": "12345678",
    //     "name": "tes"
    // };
    const data = {
        "username": username,
        "email": email,
        "password": password,
        "passwordConfirm": passwordConfirm
    }
    await client.collection("users").create(data)
}

export async function getList() {
    return await client.collection("tasks").getList(1, 50, {sort: 'created'})
}

export async function createTask(task, user) {
    const data = {
        "task": task,
        "user": user
    }
    return await client.collection("tasks").create(data)
}

export async function deleteTask(taskId) {
    return await client.collection("tasks").delete(taskId)
}