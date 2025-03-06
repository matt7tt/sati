"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { FileText, Settings, BookOpen } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = localStorage.getItem("authToken")

        if (!token) {
          console.log("No token in localStorage, redirecting to login...")
          router.push("/login")
          return
        }

        // Verify with backend
        const response = await fetch(
          "https://e00e3da9-12ec-4202-be34-632cf709d66e-00-x1fhd1x5lbwo.worf.replit.dev/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )

        if (!response.ok) {
          throw new Error("Backend verification failed")
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Auth verification failed:", error)
        router.push("/login")
      }
    }

    verifyAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-xl font-bold text-primary glow-text">Loading...</div>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen relative">
        <div className="absolute inset-0 grid-background opacity-50" />
        <Sidebar className="glass-container">
          <SidebarHeader>
            <Link href="/admin" className="text-xl font-bold text-primary glow-text px-6">
              Admin Panel
            </Link>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link
                  href="/admin/prompts"
                  className={`flex items-center gap-2 px-4 py-2 w-full rounded-md hover:bg-accent ${
                    pathname === "/admin/prompts" ? "bg-accent" : ""
                  }`}
                >
                  <FileText className="h-4 w-4" />
                  <span>Prompts</span>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link
                  href="/admin/references"
                  className={`flex items-center gap-2 px-4 py-2 w-full rounded-md hover:bg-accent ${
                    pathname === "/admin/references" ? "bg-accent" : ""
                  }`}
                >
                  <BookOpen className="h-4 w-4" />
                  <span>References</span>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link
                  href="/admin/settings"
                  className={`flex items-center gap-2 px-4 py-2 w-full rounded-md hover:bg-accent ${
                    pathname === "/admin/settings" ? "bg-accent" : ""
                  }`}
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 overflow-y-auto relative">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          <div className="relative h-full">
            <div className="p-6 space-y-6">{children}</div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  )
}

