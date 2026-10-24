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
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { OrderDetailType } from "./orderList";

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
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle className="text-xl">
                        Order Details #{order.id}
                    </DialogTitle>
                    <DialogDescription>
                        Review the items included in this order. Total amount:{" "}
                        <span className="font-semibold text-foreground">
                            ${order.totalAmount.toFixed(2)}
                        </span>
                    </DialogDescription>
                </DialogHeader>

                <div className="my-4 max-h-[60vh] overflow-y-auto rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead className="text-center">
                                    Price
                                </TableHead>
                                <TableHead className="text-center">
                                    Quantity
                                </TableHead>
                                <TableHead className="text-right">
                                    Subtotal
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order.products && order.products.length > 0 ? (
                                order.products.map((product) => {
                                    // Fallback if pivot data is attached, else standard
                                    const qty =
                                        (product as any).pivot?.quantity || 1;
                                    const subtotal = product.price * qty;

                                    return (
                                        <TableRow key={product.id}>
                                            <TableCell className="font-medium">
                                                {product.title}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                ${product.price.toFixed(2)}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                <Badge variant="outline">
                                                    {qty}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right font-semibold">
                                                ${subtotal.toFixed(2)}
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={4}
                                        className="h-24 text-center text-muted-foreground"
                                    >
                                        No product details available.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                <DialogFooter>
                    <Button
                        variant="default"
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
