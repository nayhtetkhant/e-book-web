"use server";

import api from "@/app/libs/api";

export async function getProducts(role: "admin" | "user") {
    const serverApi = await api();
    const response = await serverApi.get("/" + role + "/v1/products");

    return response.data.data ?? response.data;
}
