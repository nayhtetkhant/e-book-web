"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { Home, ShoppingCart, CreditCard, Download } from "lucide-react";

import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarInset,
} from "@/components/ui/sidebar";

const navItems = [
    {
        title: "Home",
        url: "/user/dashboard",
        icon: Home,
    },
    {
        title: "Order",
        url: "/user/dashboard/order",
        icon: ShoppingCart,
    },
    {
        title: "Download",
        url: "/user/dashboard/download",
        icon: Download,
    },
];

export default function DashboardLayoutShell({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <SidebarProvider>
            <div className="flex min-h-screen w-full">
                {/* Left Sidebar */}
                <Sidebar>
                    <SidebarHeader className="px-6 py-4 font-bold text-lg">
                        User Panel
                    </SidebarHeader>
                    <SidebarContent>
                        <SidebarMenu className="px-2">
                            {navItems.map((item) => {
                                const isActive = pathname === item.url;
                                return (
                                    <SidebarMenuItem key={item.url}>
                                        <SidebarMenuButton
                                            isActive={isActive}
                                            className="w-full"
                                        >
                                            <Link
                                                href={item.url}
                                                className="flex items-center gap-3 w-full"
                                            >
                                                <item.icon className="h-4 w-4" />
                                                <span>{item.title}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarContent>
                </Sidebar>

                {/* Main Content Area */}
                <SidebarInset className="flex-1 p-6">{children}</SidebarInset>
            </div>
        </SidebarProvider>
    );
}
