"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Lock, ShoppingBag } from "lucide-react";
import { OrderType, ProductType } from "./product";
import createOrder from "@/app/actions/shared/order";
import { useRouter } from "next/navigation";
import BookCover from "./bookCover";

interface PopupProps {
    isOpen: boolean;
    orders: OrderType[];
    products: ProductType[];
    onClose: () => void;
    onDismiss: () => void;
}

export default function OrderPopup({
    isOpen,
    orders,
    products,
    onClose,
    onDismiss,
}: PopupProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const grandTotal =
        orders?.reduce((sum, order) => {
            const product = products.find(
                (p: ProductType) => p.id === order.id,
            );
            return sum + (product ? product.price * order.quantity : 0);
        }, 0) || 0;

    const handleClose = async () => {
        setIsSubmitting(true);
        const data = await createOrder("user", { products: orders });
        const checkoutUrl = data?.checkoutUrl;
        if (checkoutUrl) {
            window.location.href = checkoutUrl;
        }
        onClose();
        router.push("/user/dashboard/order");
    };

    return (
        <Dialog open={isOpen} onOpenChange={onDismiss}>
            <DialogContent className="flex flex-col gap-5 p-6 sm:max-w-md">
                <DialogHeader className="space-y-1">
                    <DialogTitle className="flex items-center gap-2 font-serif text-xl font-semibold">
                        <ShoppingBag className="size-5 text-primary" />
                        Your Cart
                    </DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                        Review your books before heading to secure checkout.
                    </DialogDescription>
                </DialogHeader>

                {orders && orders.length > 0 ? (
                    <div className="space-y-4">
                        <ul className="max-h-72 space-y-3 overflow-y-auto pr-1">
                            {orders.map((order, index) => {
                                const product = products.find(
                                    (p: ProductType) => p.id === order.id,
                                );
                                const itemTotal = product
                                    ? order.quantity * product.price
                                    : 0;

                                return (
                                    <li
                                        key={index}
                                        className="flex items-center gap-3"
                                    >
                                        <BookCover
                                            id={order.id}
                                            title={product?.title ?? ""}
                                            size="sm"
                                            className="h-14 w-10 shrink-0"
                                        />
                                        <div className="flex min-w-0 flex-1 flex-col">
                                            <span className="truncate text-sm font-medium">
                                                {product
                                                    ? product.title
                                                    : `Product ID: ${order.id}`}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                $
                                                {product?.price.toFixed(2) ||
                                                    "0.00"}{" "}
                                                × {order.quantity}
                                            </span>
                                        </div>
                                        <span className="shrink-0 text-sm font-semibold">
                                            ${itemTotal.toFixed(2)}
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>

                        {/* Grand Total Section */}
                        <div className="flex items-center justify-between rounded-xl bg-muted/60 px-4 py-3">
                            <span className="text-sm text-muted-foreground">
                                Total
                            </span>
                            <span className="text-xl font-semibold">
                                ${grandTotal.toFixed(2)}
                            </span>
                        </div>
                    </div>
                ) : (
                    <p className="py-4 text-center text-sm text-muted-foreground">
                        Your cart is empty.
                    </p>
                )}

                <DialogFooter className="flex-col gap-2 sm:flex-col">
                    <Button
                        size="lg"
                        onClick={handleClose}
                        disabled={isSubmitting || !orders?.length}
                        className="w-full gap-2"
                    >
                        {isSubmitting ? (
                            <Loader2 className="size-4 animate-spin" />
                        ) : (
                            <Lock className="size-4" />
                        )}
                        {isSubmitting ? "Redirecting..." : "Proceed to Checkout"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
