"use server";

import api from "@/app/libs/api";

export async function getProducts(role: "admin" | "user") {
    const serverApi = await api();
    const response = await serverApi.get("/" + role + "/v1/products");

    return response.data.data ?? response.data;
}

export async function createProduct(role: "admin" | "user", data: any) {
    const serverApi = await api();
    const response = await serverApi.post("/" + role + "/v1/products", data);

    return response.data.data ?? response.data;
}

export async function updateProduct(
    id: number,
    role: "admin" | "user",
    data: any,
) {
    const serverApi = await api();
    const response = await serverApi.put(
        "/" + role + "/v1/products/" + id,
        data,
    );

    return response.data.data ?? response.data;
}


export async function getOrderedProducts() {
    const serverApi = await api();
    const response = await serverApi.get("/user/v1/ordered");

    return response.data.data ?? response.data;
}

export async function getOrderDownloadUrl(id: number) {
    const serverApi = await api();
    const response = await serverApi.get("/user/v1/products/" + id + "/download");

    return response.data.data ?? response.data;
}