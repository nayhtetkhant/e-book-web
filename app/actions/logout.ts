"use server";

import axios from "axios";
import api from "@/app/libs/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
    const cookieStore = await cookies();
    const role = cookieStore.get("auth-role")?.value === "admin" ? "admin" : "user";

    if (cookieStore.has("auth-token")) {
        try {
            const serverApi = await api({ redirectOnUnauthorized: false });
            await serverApi.post(`/${role}/v1/logout`);
        } catch (error) {
            if (!axios.isAxiosError(error) || error.response?.status !== 401) {
                return "Unable to log out. Please try again.";
            }
        }
    }

    cookieStore.delete("auth-token");
    cookieStore.delete("auth-role");
    redirect(`/${role}/login`);
}
