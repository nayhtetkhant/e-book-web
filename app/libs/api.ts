import axios, { AxiosInstance } from "axios";
import { cookies } from "next/headers";

const instance = axios.create({
  baseURL: "http://localhost:8000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    'Accept': "application/json",
  },
});

const api = async () : Promise<AxiosInstance> => {
    instance.interceptors.request.use(async (config) => {
        const cookieStore = await cookies();
        const token = cookieStore.get("auth-token")?.value;
        if(!token) {
            return config;
        }
        config.headers.Authorization = `Bearer ${token}`;
        return config;
    });

    return instance;
};

export default api;