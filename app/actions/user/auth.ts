"use server";

import { LoginFormType } from "@/app/(app)/admin/(auth)/login/loginForm";
import api from "@/app/libs/api";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function userLogin(request: LoginFormType) {
    const serverApi = await api();
    const response = await serverApi.post("/user/v1/login", request);

    if (response.data.token) {
        const cookieStore = await cookies();

        cookieStore.set("auth-token", response.data.token, {
            path: "/",
            httpOnly: true,
        });
        cookieStore.set("auth-role", response.data.role, {
            path: "/",
            httpOnly: true,
        });

        redirect("/user/dashboard");
    }

    return response.data;
}
