"use client";

import { useState } from "react";
import { Download, Loader2 } from "lucide-react";
import { getAdminProductDownloadUrl } from "@/app/actions/shared/product";
import { Button } from "@/components/ui/button";

export function DownloadProductButton({ productId }: { productId: number }) {
    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function download() {
        if (pending) return;
        setPending(true);
        setError(null);

        try {
            const url = await getAdminProductDownloadUrl(productId);
            if (!url) throw new Error("Missing download URL");
            window.location.assign(url);
        } catch {
            setError("Unable to download this file. Please try again.");
        } finally {
            setPending(false);
        }
    }

    return (
        <div className="pt-1">
            <Button variant="outline" size="sm" onClick={download} disabled={pending}>
                {pending ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
                {pending ? "Preparing download…" : "Download file"}
            </Button>
            {error && <p role="alert" className="mt-2 text-sm text-destructive">{error}</p>}
        </div>
    );
}
