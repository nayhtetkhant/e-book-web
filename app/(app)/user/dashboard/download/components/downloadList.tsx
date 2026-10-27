'use client';

import { useEffect, useState } from "react";
import { ProductType } from "../../components/product";
import { getOrderedProducts, getOrderDownloadUrl } from "@/app/actions/shared/product";

// Shadcn UI Imports
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Download } from "lucide-react";

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
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">My Downloads</h1>
                <p className="text-sm text-muted-foreground">Access and download your purchased digital products.</p>
            </div>

            {/* Loading State with Skeletons */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-24 w-full rounded-xl" />
                    ))}
                </div>
            ) : orderedProducts.length === 0 ? (
                <Card className="p-6 text-center text-muted-foreground">
                    No purchased products available for download yet.
                </Card>
            ) : (
                /* Product Download Grid / Cards */
                <div className="grid gap-4">
                    {orderedProducts.toReversed().map((product) => (
                        <Card key={product.id} className="relative p-6 pr-32 space-y-2 flex flex-col justify-center">
                            {/* Upper-right Download Button */}
                            <Button 
                                size="sm"
                                className="absolute top-4 right-4 flex items-center gap-2"
                                onClick={() => handleDownload(product.id, product.title)}
                                disabled={downloadingId === product.id}
                            >
                                <Download className="w-4 h-4" />
                                {downloadingId === product.id ? "Preparing..." : "Download"}
                            </Button>

                            {/* Card Details */}
                            <h3 className="font-semibold text-lg">{product.title}</h3>
                            <p className="text-sm text-muted-foreground">{product.description}</p>
                            <span className="inline-block text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-md w-fit">
                                Purchased
                            </span>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}