"use client";

import { LogoutButton } from "@/components/logout-button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { BookOpen, Library, Receipt, Store } from "lucide-react";

import { cn } from "@/lib/utils";

const navItems = [
    {
        title: "Shop",
        url: "/user/dashboard",
        icon: Store,
    },
    {
        title: "My Orders",
        url: "/user/dashboard/order",
        icon: Receipt,
    },
    {
        title: "My Library",
        url: "/user/dashboard/download",
        icon: Library,
    },
];

export default function DashboardLayoutShell({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="flex min-h-screen w-full flex-col bg-gradient-to-b from-muted/60 to-background">
            {/* Top Navigation */}
            <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur-md">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
                    <Link
                        href="/user/dashboard"
                        className="flex items-center gap-2"
                    >
                        <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
                            <BookOpen className="size-5" />
                        </span>
                        <span className="font-serif text-xl font-semibold tracking-tight">
                            Bookshelf
                        </span>
                    </Link>

                    <nav className="flex items-center gap-1 rounded-full border bg-muted/50 p-1">
                        {navItems.map((item) => {
                            const isActive = pathname === item.url;
                            return (
                                <Link
                                    key={item.url}
                                    href={item.url}
                                    aria-current={isActive ? "page" : undefined}
                                    className={cn(
                                        "flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-background text-foreground shadow-sm"
                                            : "text-muted-foreground hover:text-foreground",
                                    )}
                                >
                                    <item.icon className="size-4" />
                                    <span className="hidden sm:inline">
                                        {item.title}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>
                    <LogoutButton />
                </div>
            </header>

            {/* Main Content Area */}
            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
                {children}
            </main>

            <footer className="border-t">
                <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:px-6">
                    <span className="flex items-center gap-1.5">
                        <BookOpen className="size-3.5" />
                        Bookshelf
                    </span>
                </div>
            </footer>
        </div>
    );
}
