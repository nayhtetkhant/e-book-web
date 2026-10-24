"use client";

import { useState } from "react";
import { OrderType, ProductType } from "./product";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { set } from "react-hook-form";

export default function ProductCard({
    product,
    onAddToCart,
}: {
    product: ProductType;
    onAddToCart: (order: OrderType) => void;
}) {
    const [quantity, setQuantity] = useState<number>(1);

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    return (
        <Card className="w-full h-full flex flex-col justify-between shadow-md hover:shadow-lg transition-shadow overflow-hidden">
            <div>
                <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="text-lg font-bold line-clamp-1">
                        {product.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2 min-h text-xs sm:text-sm">
                        {product.description}
                    </CardDescription>
                </CardHeader>

                <CardContent className="p-4 sm:p-6 pt-0 space-y-4">
                    {/* Price */}
                    <div className="text-xl sm:text-2xl font-semibold text-primary">
                        ${product.price.toFixed(2)}
                    </div>

                    {/* Compact Quantity Controls to prevent overflow */}
                    <div className="flex items-center justify-between bg-muted/40 px-2.5 py-1.5 rounded-lg border gap-2">
                        <span className="text-xs sm:text-sm font-medium text-muted-foreground">
                            Qty
                        </span>
                        <div className="flex items-center gap-1">
                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-6 w-6 shrink-0"
                                onClick={handleDecrement}
                                disabled={quantity <= 1}
                            >
                                <Minus className="h-3 w-3" />
                            </Button>

                            <span className="w-5 text-center text-xs sm:text-sm font-semibold">
                                {quantity}
                            </span>

                            <Button
                                type="button"
                                variant="outline"
                                size="icon"
                                className="h-6 w-6 shrink-0"
                                onClick={() => setQuantity(quantity + 1)}
                            >
                                <Plus className="h-3 w-3" />
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </div>

            <CardFooter className="p-4 sm:p-6 pt-0">
                <Button
                    className="w-full gap-2 text-xs sm:text-sm"
                    onClick={() => {
                        onAddToCart({
                            id: product.id,
                            quantity: quantity,
                        });
                        setQuantity(1);
                    }}
                >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                </Button>
            </CardFooter>
        </Card>
    );
}
