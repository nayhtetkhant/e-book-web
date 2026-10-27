"use client";

import { getProducts } from "@/app/actions/shared/product";
import { useEffect, useState } from "react";
import Card from "./card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ShoppingBag, Sparkles, BookX } from "lucide-react";
import OrderPopup from "./OrderPopup";

export interface ProductType {
    id: number;
    title: string;
    description: string;
    price: number;
    filePath?: string;
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
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function fetchProducts() {
            try {
                const data = await getProducts("user");
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

    const cartCount = card
        ? card.reduce((acc, item) => acc + item.quantity, 0)
        : 0;

    const query = search.trim().toLowerCase();
    const filteredProducts = query
        ? products.filter(
              (product) =>
                  product.title.toLowerCase().includes(query) ||
                  product.description?.toLowerCase().includes(query),
          )
        : products;

    return (
        <div className="space-y-10">
            {/* Hero */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-teal-700 to-emerald-900 px-6 py-12 text-primary-foreground shadow-lg sm:px-12 sm:py-16">
                <div className="absolute -right-16 -top-16 size-64 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -bottom-24 right-24 size-72 rounded-full bg-emerald-300/20 blur-3xl" />

                <div className="relative max-w-xl space-y-5">
                    <h1 className="font-serif text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                        Find your next great read.
                    </h1>
                    <p className="text-sm text-primary-foreground/80 sm:text-base">
                        Hand-picked e-books, ready to download the moment you
                        check out.
                    </p>

                    <div className="relative max-w-md">
                        <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search by title or topic..."
                            aria-label="Search books"
                            className="h-11 rounded-full border-0 bg-background pl-10 text-foreground shadow-md"
                        />
                    </div>
                </div>
            </section>

            {/* Catalog */}
            <section className="space-y-6">
                <div className="flex items-end justify-between gap-4">
                    <div>
                        <h2 className="font-serif text-2xl font-semibold tracking-tight">
                            {query ? "Search results" : "Browse the collection"}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            {loading
                                ? "Loading books..."
                                : `${filteredProducts.length} ${filteredProducts.length === 1 ? "book" : "books"} available`}
                        </p>
                    </div>

                    <Button
                        variant="outline"
                        className="gap-2"
                        onClick={() => setIsOpenPopup(true)}
                        disabled={cartCount === 0}
                    >
                        <ShoppingBag className="size-4" />
                        Cart
                        <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                            {cartCount}
                        </span>
                    </Button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="space-y-3">
                                <Skeleton className="aspect-[3/4] w-full rounded-xl" />
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/3" />
                            </div>
                        ))}
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed bg-background py-16 text-center">
                        <BookX className="size-10 text-muted-foreground" />
                        <p className="font-medium">No books found</p>
                        <p className="text-sm text-muted-foreground">
                            Try a different search term.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-x-5 gap-y-8 md:grid-cols-3 lg:grid-cols-4">
                        {filteredProducts.map((product: ProductType) => (
                            <Card
                                key={product.id}
                                product={product}
                                onAddToCart={onAddToCart}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* Floating cart bar */}
            {cartCount > 0 && !isOpenPopup && (
                <div className="fixed inset-x-0 bottom-6 z-30 flex justify-center px-4 animate-in fade-in slide-in-from-bottom-4">
                    <button
                        type="button"
                        onClick={() => setIsOpenPopup(true)}
                        className="flex items-center gap-3 rounded-full bg-foreground py-2 pl-4 pr-2 text-sm text-background shadow-xl transition-transform hover:scale-[1.02]"
                    >
                        <ShoppingBag className="size-4" />
                        <span>
                            {cartCount} {cartCount === 1 ? "item" : "items"} in
                            your cart
                        </span>
                        <span className="rounded-full bg-primary px-3 py-1.5 font-medium text-primary-foreground">
                            Checkout
                        </span>
                    </button>
                </div>
            )}

            {card && (
                <OrderPopup
                    isOpen={isOpenPopup}
                    orders={card}
                    products={products}
                    onClose={handleClose}
                    onDismiss={() => setIsOpenPopup(false)}
                />
            )}
        </div>
    );
}
