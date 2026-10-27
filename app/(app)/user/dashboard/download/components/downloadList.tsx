'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { ProductType } from "../../components/product";
import { getOrderedProducts, getOrderDownloadUrl } from "@/app/actions/shared/product";

// Shadcn UI Imports
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Library, Loader2 } from "lucide-react";
import BookCover from "../../components/bookCover";

export default function DownloadList() {
    const [orderedProducts, setOrderedProducts] = useState<ProductType[]>([]);
    const [loading, setLoading] = useState(true);
    const [downloadingId, setDownloadingId] = useState<number | null>(null);

    useEffect(() => {
        async function fetchOrderedProduct() {
            try {
                const response = await getOrderedProducts();
                const data = response?.data ?? response;
                const flatData = Array.isArray(data) ? data.flat() : [];
                setOrderedProducts(flatData);
            } catch (error) {
                console.error("Failed to fetch ordered products:", error);
                setOrderedProducts([]);
            } finally {
                setLoading(false);
            }
        }
        fetchOrderedProduct();
    }, []);

    const handleDownload = async (productId: number, title: string) => {
        try {
            setDownloadingId(productId);
            const response = await getOrderDownloadUrl(productId);
            const downloadUrl = response?.download_url ?? response?.url ?? response;

            if (downloadUrl) {
                window.open(downloadUrl, '_blank');
            } else {
                console.error("Download URL not found in response");
            }
        } catch (error) {
            console.error(`Failed to download file for product ${title}:`, error);
        } finally {
            setDownloadingId(null);
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="font-serif text-3xl font-semibold tracking-tight">My Library</h1>
                <p className="text-sm text-muted-foreground">
                    {loading
                        ? "Your purchased books, ready to download."
                        : `${orderedProducts.length} ${orderedProducts.length === 1 ? "book" : "books"} in your collection.`}
                </p>
            </div>

            {/* Loading State with Skeletons */}
            {loading ? (
                <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="space-y-3">
                            <Skeleton className="aspect-[3/4] w-full rounded-md" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-8 w-full rounded-full" />
                        </div>
                    ))}
                </div>
            ) : orderedProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed bg-background py-16 text-center">
                    <span className="flex size-14 items-center justify-center rounded-full bg-muted">
                        <Library className="size-6 text-muted-foreground" />
                    </span>
                    <p className="font-medium">Your library is empty</p>
                    <p className="text-sm text-muted-foreground">
                        Books you purchase will appear here for download.
                    </p>
                    <Button className="mt-2" nativeButton={false}
                        render={<Link href="/user/dashboard" />}>
                        Browse books
                    </Button>
                </div>
            ) : (
                /* Bookshelf grid */
                <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
                    {orderedProducts.toReversed().map((product) => (
                        <article key={product.id} className="group flex flex-col">
                            <BookCover
                                id={product.id}
                                title={product.title}
                                className="aspect-[3/4] w-full transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-xl"
                            />
                            <h3 className="mt-3 line-clamp-1 text-sm font-semibold">{product.title}</h3>
                            <p className="line-clamp-1 text-xs text-muted-foreground">{product.description}</p>
                            <Button
                                size="sm"
                                variant="outline"
                                className="mt-3 w-full gap-2"
                                onClick={() => handleDownload(product.id, product.title)}
                                disabled={downloadingId === product.id}
                            >
                                {downloadingId === product.id ? (
                                    <Loader2 className="size-4 animate-spin" />
                                ) : (
                                    <Download className="size-4" />
                                )}
                                {downloadingId === product.id ? "Preparing..." : "Download"}
                            </Button>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
}
