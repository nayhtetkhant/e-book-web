"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getAllOrders } from "@/app/actions/shared/order";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight, Receipt } from "lucide-react";
import OrderDetailsPopup from "./orderDetailsPopup";
import { ProductType } from "../../components/product";
import BookCover from "../../components/bookCover";
import { cn } from "@/lib/utils";

export interface OrderDetailType {
    id: number;
    userId: number;
    totalAmount: number;
    status: string;
    products: ProductType[];
}

const statusStyles: Record<string, string> = {
    completed:
        "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-950 dark:text-emerald-300",
    paid: "bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-950 dark:text-emerald-300",
    cancelled:
        "bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-950 dark:text-rose-300",
    failed: "bg-rose-50 text-rose-700 ring-rose-600/20 dark:bg-rose-950 dark:text-rose-300",
};

const pendingStyle =
    "bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-950 dark:text-amber-300";

export function OrderStatus({ status }: { status?: string }) {
    const key = (status || "pending").toLowerCase();
    return (
        <span
            className={cn(
                "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ring-1 ring-inset",
                statusStyles[key] ?? pendingStyle,
            )}
        >
            <span className="size-1.5 rounded-full bg-current" />
            {key}
        </span>
    );
}

export default function OrderList() {
    const [orders, setOrders] = useState<OrderDetailType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<OrderDetailType | null>(
        null,
    );
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    useEffect(() => {
        async function fetchOrders() {
            try {
                const data = await getAllOrders("user");
                setOrders(data ?? []);
            } catch (error) {
                console.error("Failed to fetch orders:", error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchOrders();
    }, []);

    const handleViewProducts = (order: OrderDetailType) => {
        setSelectedOrder(order);
        setIsPopupOpen(true);
    };

    return (
        <div className="mx-auto max-w-3xl space-y-8">
            <div>
                <h1 className="font-serif text-3xl font-semibold tracking-tight">
                    My Orders
                </h1>
                <p className="text-sm text-muted-foreground">
                    Track your purchases and see what&apos;s inside each order.
                </p>
            </div>

            {isLoading ? (
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-24 w-full rounded-2xl" />
                    ))}
                </div>
            ) : orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed bg-background py-16 text-center">
                    <span className="flex size-14 items-center justify-center rounded-full bg-muted">
                        <Receipt className="size-6 text-muted-foreground" />
                    </span>
                    <p className="font-medium">No orders yet</p>
                    <p className="text-sm text-muted-foreground">
                        When you buy a book, it will show up here.
                    </p>
                    <Button
                        className="mt-2"
                        nativeButton={false}
                        render={<Link href="/user/dashboard" />}
                    >
                        Browse books
                    </Button>
                </div>
            ) : (
                <ul className="space-y-3">
                    {orders.toReversed().map((order) => {
                        const products = order.products ?? [];
                        return (
                            <li key={order.id}>
                                <button
                                    type="button"
                                    onClick={() => handleViewProducts(order)}
                                    className="group flex w-full items-center gap-4 rounded-2xl border bg-background p-4 text-left shadow-xs transition-all hover:border-primary/40 hover:shadow-md sm:p-5"
                                >
                                    {/* Stacked covers */}
                                    <div className="flex shrink-0 -space-x-5">
                                        {products.slice(0, 3).map((p, i) => (
                                            <BookCover
                                                key={p.id}
                                                id={p.id}
                                                title={p.title}
                                                size="sm"
                                                className="h-16 w-11"
                                                style={{ zIndex: 3 - i }}
                                            />
                                        ))}
                                        {products.length === 0 && (
                                            <div className="flex h-16 w-11 items-center justify-center rounded-md bg-muted">
                                                <Receipt className="size-4 text-muted-foreground" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="min-w-0 flex-1 space-y-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-sm font-semibold">
                                                Order #{order.id}
                                            </span>
                                            <OrderStatus status={order.status} />
                                        </div>
                                        <p className="truncate text-sm text-muted-foreground">
                                            {products.length > 0
                                                ? products
                                                      .map((p) => p.title)
                                                      .join(", ")
                                                : "No items"}
                                        </p>
                                    </div>

                                    <div className="flex shrink-0 items-center gap-2">
                                        <span className="text-lg font-semibold">
                                            ${order.totalAmount.toFixed(2)}
                                        </span>
                                        <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                                    </div>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            )}

            {selectedOrder && (
                <OrderDetailsPopup
                    isOpen={isPopupOpen}
                    onClose={() => setIsPopupOpen(false)}
                    order={selectedOrder}
                />
            )}
        </div>
    );
}
