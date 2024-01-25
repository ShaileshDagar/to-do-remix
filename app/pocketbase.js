import PocketBase from 'pocketbase';

const url = 'http://127.0.0.1:8090'
export const client = new PocketBase(url);
// export const isUserValid = client.authStore.isValid;

export async function login(email, password) {
    try {
        await client.collection("users").authWithPassword(email, password)
    } catch(err) {
        throw {
            message: "Error logging in"
        }
    }

}

export async function oAuthLogin() {
    const authData = await client.collection("users").authWithOAuth2({provider: "google"})
}

export function logout() {
    client.authStore.clear()
}

export async function signup(email, password) {
    // const data = {
    //     "username": "test_rname",
    //     "email": "t@example.com",
    //     "emailVisibility": true,
    //     "password": "12345678",
    //     "passwordConfirm": "12345678",
    //     "name": "tes"
    // };
    const data = {
        "email": email,
        "password": password,
        "passwordConfirm": password
    }
    await client.collection("users").create(data) 
    await login(email, password)
}

export async function getList() {
    return await client.collection("tasks").getList(1, 50, {sort: 'created'})
}

export async function createTask(task, user) {
    await new Promise((resolve) => setTimeout(resolve, 3000))
    const data = {
        "task": task,
        "user": user
    }
    return await client.collection("tasks").create(data)
}

export async function deleteTask(taskId) {
    await new Promise((resolve) => setTimeout(resolve, 3000))
    return await client.collection("tasks").delete(taskId)
}

export async function patchTask(taskId, task) {
    await new Promise((resolve) => setTimeout(resolve, 3000))
    const data = {
        "task": task,
        "user": client.authStore.model?.id
    }
    return await client.collection("tasks").update(taskId, data)
}

