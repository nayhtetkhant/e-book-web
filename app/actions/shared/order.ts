"use server";

import { OrderType } from "@/app/(app)/user/dashboard/components/product";
import api from "@/app/libs/api";

export default async function createOrder(
    role: "admin" | "user",
    order: { products: OrderType[] },
) {
    try {
        const serverApi = await api();
        const response = await serverApi.post("/" + role + "/v1/orders", order);

        console.log(response.data);

        return response.data.data ?? response.data;
    } catch (error) {
        console.log(error);
    }
}

export async function getAllOrders(role: "admin" | "user") {
    try {
        const serverApi = await api();
        const response = await serverApi.get("/" + role + "/v1/orders");

        console.log(response.data);

        return response.data.data ?? response.data;
    } catch (error) {
        console.log(error);
    }
}
