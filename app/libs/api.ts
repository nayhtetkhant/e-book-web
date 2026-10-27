import axios, { AxiosInstance } from "axios";
import { cookies } from "next/headers";

const api = async (): Promise<AxiosInstance> => {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;

    return axios.create({
        baseURL: `${process.env.API_BASE_URL?.replace(/\/$/, "")}/api`,
        timeout: 10000,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });
};

export default api;
