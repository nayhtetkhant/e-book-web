"use client"

import { LogoutButton } from "@/components/logout-button";
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"
import { Home, ShoppingCart, CreditCard } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar"

const navItems = [
  {
    title: "Home",
    url: "/admin/dashboard",
    icon: Home,
  },
  {
    title: "Order",
    url: "/admin/dashboard/order",
    icon: ShoppingCart,
  },
  {
    title: "Payment",
    url: "/admin/dashboard/payment",
    icon: CreditCard,
  },
]

export default function DashboardLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* Left Sidebar */}
        <Sidebar>
          <SidebarHeader className="px-6 py-4 font-bold text-lg">
            Admin Panel
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu className="px-2">
              {navItems.map((item) => {
                const isActive = pathname === item.url
                return (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton isActive={isActive} className="w-full">
                      <Link href={item.url} className="flex items-center gap-3 w-full">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
            <div className="px-4 py-2"><LogoutButton /></div>
          </SidebarContent>
        </Sidebar>

        {/* Main Content Area */}
        <SidebarInset className="flex-1 p-6">
          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}