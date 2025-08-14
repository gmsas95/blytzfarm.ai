"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { LayoutDashboard, Settings, Zap, Bell, FileText } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { usePathname } from "next/navigation"

interface DashboardUser {
  email: string
  role: string
  name: string
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<DashboardUser | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      window.location.href = "/"
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    window.location.href = "/"
  }

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard", active: pathname === "/dashboard" },
    { icon: Zap, label: "Device Control", href: "/devices", active: pathname === "/devices" },
    { icon: Settings, label: "AI Settings", href: "/ai-settings", active: pathname === "/ai-settings" },
    { icon: Bell, label: "Alerts", href: "/alerts", active: pathname === "/alerts" },
    { icon: FileText, label: "Logs & Reports", href: "/reports", active: pathname === "/reports" },
    { icon: Settings, label: "Settings", href: "/settings", active: pathname === "/settings" },
  ]

  if (!user) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900">
        <Sidebar className="border-r border-slate-200 dark:border-slate-700">
          <SidebarHeader className="border-b border-slate-200 dark:border-slate-700 p-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-700 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="font-black text-sm font-sans">Farm AI</h2>
                <p className="text-xs text-muted-foreground font-sans">Control Center</p>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild isActive={item.active} className="font-sans">
                    <a href={item.href} className="flex items-center gap-3">
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex flex-col">
          <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <SidebarTrigger />
                <div>
                  <h1 className="text-xl font-black text-slate-800 dark:text-white font-sans">
                    {pathname === "/dashboard" && "Real-Time Performance Metrics"}
                    {pathname === "/devices" && "Device Control Interface"}
                    {pathname === "/ai-settings" && "AI Automation Settings"}
                    {pathname === "/alerts" && "Alerts & Notifications"}
                    {pathname === "/reports" && "Logs & Reports"}
                    {pathname === "/settings" && "System Settings"}
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-300 font-sans">
                    {pathname === "/dashboard" && "Monitor and optimize your farm's environment"}
                    {pathname === "/devices" && "Manual control of farm equipment and systems"}
                    {pathname === "/ai-settings" && "Configure AI automation parameters"}
                    {pathname === "/alerts" && "Manage notifications and alert settings"}
                    {pathname === "/reports" && "View historical data and generate reports"}
                    {pathname === "/settings" && "Configure API keys, themes, and AI automation"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <ThemeToggle />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 font-sans">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-green-700 text-white text-sm">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <div className="text-sm font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.role}</div>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem className="font-sans">Profile</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="font-sans">
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </header>

          <main className="flex-1 p-6">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
