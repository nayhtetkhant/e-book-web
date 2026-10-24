"use client";

import { getProducts } from "@/app/actions/shared/product";
import { useEffect, useState } from "react";
import Card from "./card";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Loader2 } from "lucide-react";
import OrderPopup from "./OrderPopup";

export interface ProductType {
    id: number;
    title: string;
    description: string;
    price: number;
}

export interface OrderType {
    id: number;
    quantity: number;
}

export default function Product() {
    const [products, setProducts] = useState<ProductType[]>([]);
    const [loading, setLoading] = useState(true);
    const [card, setCard] = useState<OrderType[] | null>(null);
    const [isOpenPopup, setIsOpenPopup] = useState<boolean>(false);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const data = await getProducts("admin");
                setProducts(data);
            } catch (error) {
                console.error("Failed to fetch products:", error);
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();
    }, []);

    function onAddToCart(order: OrderType) {
        if (card) {
            const newCard = [...card, order];
            setCard(newCard);
        } else {
            setCard([order]);
        }
    }

    function handleClose() {
        setIsOpenPopup(false);
        setCard(null);
    }

    if (loading) {
        return (
            <div className="flex h-[50vh] w-full items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Products Catalog
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Browse and manage available products.
                    </p>
                </div>

                <Button className="gap-2" onClick={() => setIsOpenPopup(true)}>
                    <ShoppingBag className="h-4 w-4" />
                    Order Now (
                    {card
                        ? card.reduce((acc, item) => acc + item.quantity, 0)
                        : 0}
                    )
                </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map((product: ProductType) => (
                    <Card
                        key={product.id}
                        product={product}
                        onAddToCart={onAddToCart}
                    />
                ))}
            </div>

            {card && (
                <OrderPopup
                    isOpen={isOpenPopup}
                    orders={card}
                    products={products}
                    onClose={handleClose}
                />
            )}
        </div>
    );
}
