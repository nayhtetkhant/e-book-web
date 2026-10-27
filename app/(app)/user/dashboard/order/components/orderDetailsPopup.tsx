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
import { OrderDetailType, OrderStatus } from "./orderList";
import BookCover from "../../components/bookCover";

interface OrderDetailsPopupProps {
    isOpen: boolean;
    onClose: () => void;
    order: OrderDetailType;
}

export default function OrderDetailsPopup({
    isOpen,
    onClose,
    order,
}: OrderDetailsPopupProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="flex flex-col gap-5 p-6 sm:max-w-lg">
                <DialogHeader className="space-y-1">
                    <div className="flex items-center gap-2">
                        <DialogTitle className="font-serif text-xl font-semibold">
                            Order #{order.id}
                        </DialogTitle>
                        <OrderStatus status={order.status} />
                    </div>
                    <DialogDescription>
                        The books included in this order.
                    </DialogDescription>
                </DialogHeader>

                {order.products && order.products.length > 0 ? (
                    <ul className="max-h-[50vh] space-y-3 overflow-y-auto pr-1">
                        {order.products.map((product) => {
                            // Fallback if pivot data is attached, else standard
                            const qty =
                                (product as { pivot?: { quantity?: number } }).pivot
                                    ?.quantity || 1;
                            const subtotal = product.price * qty;

                            return (
                                <li
                                    key={product.id}
                                    className="flex items-center gap-3"
                                >
                                    <BookCover
                                        id={product.id}
                                        title={product.title}
                                        size="sm"
                                        className="h-14 w-10 shrink-0"
                                    />
                                    <div className="flex min-w-0 flex-1 flex-col">
                                        <span className="truncate text-sm font-medium">
                                            {product.title}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            ${product.price.toFixed(2)} × {qty}
                                        </span>
                                    </div>
                                    <span className="shrink-0 text-sm font-semibold">
                                        ${subtotal.toFixed(2)}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    <p className="py-6 text-center text-sm text-muted-foreground">
                        No product details available.
                    </p>
                )}

                <div className="flex items-center justify-between rounded-xl bg-muted/60 px-4 py-3">
                    <span className="text-sm text-muted-foreground">Total</span>
                    <span className="text-xl font-semibold">
                        ${order.totalAmount.toFixed(2)}
                    </span>
                </div>

                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="w-full sm:w-auto"
                    >
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
