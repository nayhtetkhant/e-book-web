"use client";

import { useState } from "react";
import { OrderType, ProductType } from "./product";
import { Button } from "@/components/ui/button";
import { Check, Plus, Minus, ShoppingCart } from "lucide-react";
import BookCover from "./bookCover";

export default function ProductCard({
    product,
    onAddToCart,
}: {
    product: ProductType;
    onAddToCart: (order: OrderType) => void;
}) {
    const [quantity, setQuantity] = useState<number>(1);
    const [justAdded, setJustAdded] = useState(false);

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleAdd = () => {
        onAddToCart({
            id: product.id,
            quantity: quantity,
        });
        setQuantity(1);
        setJustAdded(true);
        setTimeout(() => setJustAdded(false), 1500);
    };

    return (
        <article className="group flex h-full flex-col">
            {/* Cover */}
            <div className="relative rounded-xl bg-muted/60 p-5 transition-colors group-hover:bg-muted">
                <BookCover
                    id={product.id}
                    title={product.title}
                    className="mx-auto aspect-[3/4] w-full max-w-44 transition-transform duration-300 group-hover:-translate-y-1 group-hover:rotate-[-1deg] group-hover:shadow-xl"
                />
            </div>

            {/* Details */}
            <div className="flex flex-1 flex-col pt-3">
                <h3 className="line-clamp-1 font-semibold">{product.title}</h3>
                <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground sm:text-sm">
                    {product.description}
                </p>

                <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                    <span className="text-lg font-semibold">
                        ${product.price.toFixed(2)}
                    </span>

                    <div className="flex items-center rounded-full border bg-background">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            onClick={handleDecrement}
                            disabled={quantity <= 1}
                            aria-label="Decrease quantity"
                        >
                            <Minus />
                        </Button>
                        <span className="w-5 text-center text-xs font-semibold">
                            {quantity}
                        </span>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => setQuantity(quantity + 1)}
                            aria-label="Increase quantity"
                        >
                            <Plus />
                        </Button>
                    </div>
                </div>

                <Button
                    className="mt-3 w-full gap-2"
                    variant={justAdded ? "secondary" : "default"}
                    onClick={handleAdd}
                >
                    {justAdded ? (
                        <>
                            <Check className="size-4" />
                            Added
                        </>
                    ) : (
                        <>
                            <ShoppingCart className="size-4" />
                            Add to Cart
                        </>
                    )}
                </Button>
            </div>
        </article>
    );
}
