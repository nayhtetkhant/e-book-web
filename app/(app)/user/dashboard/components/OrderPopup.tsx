"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ShoppingBag } from "lucide-react";
import { OrderType, ProductType } from "./product";
import createOrder from "@/app/actions/shared/order";
import { useRouter } from "next/navigation";

interface PopupProps {
    isOpen: boolean;
    orders: OrderType[];
    products: ProductType[];
    onClose: () => void;
}

export default function OrderPopup({
    isOpen,
    orders,
    products,
    onClose,
}: PopupProps) {
    const router = useRouter();

    const grandTotal =
        orders?.reduce((sum, order) => {
            const product = products.find(
                (p: ProductType) => p.id === order.id,
            );
            return sum + (product ? product.price * order.quantity : 0);
        }, 0) || 0;

    const handleClose = async () => {
        const data =  await createOrder("user", { products: orders });
        const checkoutUrl = data.checkoutUrl;
        if (checkoutUrl) {
            window.location.href = checkoutUrl;
        }
        onClose();
        router.push("/user/dashboard/order");
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md flex flex-col p-6 space-y-4">
                {/* Success Icon Badge */}
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
                    <CheckCircle2 className="h-6 w-6" />
                </div>

                <DialogHeader className="space-y-1 text-center">
                    <DialogTitle className="text-xl font-bold">
                        Order Summary
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                        Here are the items you have selected for your order.
                    </DialogDescription>
                </DialogHeader>

                {/* Mapped Order Items Container */}
                <div className="max-h-60 overflow-y-auto divide-y divide-border rounded-md border bg-card text-card-foreground p-3 space-y-2">
                    {orders && orders.length > 0 ? (
                        <>
                            {orders.map((order, index) => {
                                const product = products.find(
                                    (p: ProductType) => p.id === order.id,
                                );
                                const itemTotal = product
                                    ? order.quantity * product.price
                                    : 0;

                                return (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between pt-2 first:pt-0 text-sm text-muted-foreground"
                                    >
                                        <div className="flex items-center gap-2.5 truncate pr-2">
                                            <ShoppingBag className="h-4 w-4 text-muted-foreground shrink-0" />
                                            <div className="truncate flex flex-col">
                                                <span className="font-medium truncate">
                                                    {product
                                                        ? product.title
                                                        : `Product ID: ${order.id}`}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    $
                                                    {product?.price.toFixed(
                                                        2,
                                                    ) || "0.00"}{" "}
                                                    × {order.quantity}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="text-right shrink-0">
                                            <span className="text-xs font-semibold bg-muted px-2 py-1 rounded-sm border">
                                                ${itemTotal.toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Grand Total Section */}
                            <div className="pt-3 mt-3 border-t flex items-center justify-between font-semibold text-base">
                                <span>Grand Total:</span>
                                <span className="text-primary">
                                    ${grandTotal.toFixed(2)}
                                </span>
                            </div>
                        </>
                    ) : (
                        <p className="text-center text-sm text-muted-foreground py-4">
                            No items in the order.
                        </p>
                    )}
                </div>

                <DialogFooter className="w-full sm:justify-center">
                    <Button
                        onClick={handleClose}
                        className="w-full sm:w-auto px-6"
                    >
                        Confirm & Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
