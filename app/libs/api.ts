import axios, { AxiosInstance } from "axios";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const api = async ({ redirectOnUnauthorized = true } = {}): Promise<AxiosInstance> => {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth-token")?.value;
    const role = cookieStore.get("auth-role")?.value;

    const requireLogin = (url?: string): never => {
        const loginRole = role === "admin" || role === "user"
            ? role
            : url?.startsWith("/admin/") ? "admin" : "user";

        cookieStore.delete("auth-token");
        cookieStore.delete("auth-role");
        redirect(`/${loginRole}/login`);
    };

    const instance = axios.create({
        baseURL: `${process.env.API_BASE_URL?.replace(/\/$/, "")}/api`,
        timeout: 10000,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
    });

    if (redirectOnUnauthorized) {
        instance.interceptors.request.use((config) => {
            if (!token || (role !== "admin" && role !== "user")) {
                requireLogin(config.url);
            }
            return config;
        });
        instance.interceptors.response.use(
            (response) => response,
            (error: unknown) => {
                if (axios.isAxiosError(error) && error.response?.status === 401) {
                    requireLogin(error.config?.url);
                }
                return Promise.reject(error);
            },
        );
    }

    return instance;
};

export default api;
