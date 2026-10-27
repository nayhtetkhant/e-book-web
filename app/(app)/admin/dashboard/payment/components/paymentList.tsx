"use client";

import getAllPayments from "@/app/actions/admin/payment";
import { useEffect, useState } from "react";

// Shadcn UI Imports
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

type PaymentType = {
    id: number | string;
    status: string;
    totalAmount?: number;
};

export default function PaymentList() {
    const [payments, setPayments] = useState<PaymentType[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPayments() {
            try {
                const data = await getAllPayments();
                setPayments(data);
            } catch (error) {
                console.error("Failed to fetch payments:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchPayments();
    }, []);

    // Helper function to color-code status badges
    const getStatusBadgeVariant = (status: string) => {
        if (!status) {
            return "outline";
        }
        switch (status.toLowerCase()) {
            case "completed":
            case "success":
                return "default";
            case "pending":
                return "secondary";
            case "failed":
            case "cancelled":
                return "destructive";
            default:
                return "outline";
        }
    };

    if(loading) {
        return <div>Loading...</div>
    }

    return (
        <div className="p-6 max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Payment List</h1>
                <p className="text-sm text-muted-foreground">Monitor and review all transaction records.</p>
            </div>

            {/* Loading State with Skeletons */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-20 w-full rounded-xl" />
                    ))}
                </div>
            ) : payments?.length === 0 ? (
                <Card className="p-6 text-center text-muted-foreground">
                    No payment records found.
                </Card>
            ) : (
                /* Payment Cards Grid */
                <div className="grid gap-4">
                    {payments?.toReversed().map((payment) => (
                        <Card key={payment.id} className="flex justify-between items-center p-4">
                            <div className="space-y-1">
                                <div className="flex items-center gap-3">
                                    <span className="font-semibold text-base">Payment #{payment.id}</span>
                                    <Badge variant={getStatusBadgeVariant(payment.status)}>
                                        {payment.status}
                                    </Badge>
                                </div>
                                {payment.totalAmount !== undefined && (
                                    <p className="text-sm text-muted-foreground">
                                        total amount: <span className="font-medium text-foreground">{payment.totalAmount}</span>
                                    </p>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}