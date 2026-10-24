"use client";

import { useEffect, useState } from "react";
import { getAllOrders } from "@/app/actions/shared/order";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { PackageOpen, ShoppingCart } from "lucide-react";
import OrderDetailsPopup from "./orderDetailsPopup";
import { ProductType } from "../../components/product";

export interface OrderDetailType {
    id: number;
    userId: number;
    totalAmount: number;
    status: string;
    products: ProductType[];
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
                setOrders(data);
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

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto p-6 space-y-4">
                <Skeleton className="h-8 w-48 mb-6" />
                {[1, 2, 3].map((i) => (
                    <Card key={i} className="p-6">
                        <div className="flex justify-between items-center">
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-32" />
                                <Skeleton className="h-6 w-24" />
                            </div>
                            <Skeleton className="h-10 w-32" />
                        </div>
                    </Card>
                ))}
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <Card className="max-w-md mx-auto mt-12 text-center p-8 border-dashed">
                <CardContent className="flex flex-col items-center justify-center space-y-3 pt-6">
                    <ShoppingCart className="w-12 h-12 text-muted-foreground stroke-1" />
                    <p className="text-lg font-medium">No orders found</p>
                    <p className="text-sm text-muted-foreground">
                        You haven't placed any orders yet.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">
                    Order History
                </h1>
                <p className="text-sm text-muted-foreground">
                    Manage and track your recent purchases.
                </p>
            </div>

            <div className="grid gap-4">
                {orders.toReversed().map((order) => {
                    const statusVariant =
                        order.status === "completed"
                            ? "default"
                            : order.status === "cancelled"
                              ? "destructive"
                              : "secondary";

                    return (
                        <Card
                            key={order.id}
                            className="transition-all hover:border-primary/50"
                        >
                            <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 gap-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-semibold text-muted-foreground">
                                            Order #{order.id}
                                        </span>
                                        <Badge
                                            variant={statusVariant}
                                            className="capitalize"
                                        >
                                            {order.status || "Pending"}
                                        </Badge>
                                    </div>
                                    <p className="text-2xl font-bold tracking-tight">
                                        ${order.totalAmount.toFixed(2)}
                                    </p>
                                </div>

                                <Button
                                    variant="outline"
                                    className="gap-2 w-full sm:w-auto"
                                    onClick={() => handleViewProducts(order)}
                                >
                                    <PackageOpen className="w-4 h-4" />
                                    View Products
                                </Button>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Shadcn Dialog Popup Component */}
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
