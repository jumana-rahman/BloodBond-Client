import { redirect } from "next/navigation";
import { getUserToken } from "./session";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export const authHeader = async () => {
    const token = await getUserToken();
    const header = token ? {
        authorization: `Bearer ${token}`
    } : {};
    return header;
}

export const serverFetch = async (path) => {
    const res = await fetch(`${baseURL}${path}`);
    return handleStatusCode(res);
}

export const protectedFetch = async (path) => {
    const res = await fetch(`${baseURL}${path}`, {
        headers: await authHeader()
    });
    return handleStatusCode(res);
}

export const serverMutation = async (path, data, method = 'POST') => {
    const res = await fetch(`${baseURL}${path}`, {
        method: method,
        headers: {
            'Content-Type': 'application/json',
            ...await authHeader()
        },
        body: JSON.stringify(data),
    });

    

    return handleStatusCode(res);
}

// handle 401, 404, 403
const handleStatusCode = res => {
    if (res.status === 401) {
        redirect('/unauthorized');
    }
    else if(res.status === 403){
        redirect('/forbidden');
    }
    return res.json();
}