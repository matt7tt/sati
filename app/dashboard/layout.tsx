"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, User, Settings, LogOut, FileText, ShieldCheck } from "lucide-react"
import type React from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("authToken")
        const isAuthenticated = localStorage.getItem("isAuthenticated")

        console.log("Dashboard Layout - Checking auth")
        console.log("Token exists:", !!token)
        console.log("Is authenticated:", isAuthenticated)

        if (!token || isAuthenticated !== "true") {
          console.log("No token or not authenticated, redirecting to login...")
          window.location.href = "/login"
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
        console.error("Auth check failed:", error)
        window.location.href = "/login"
      }
    }

    checkAuth()
  }, [])

  const handleLogout = () => {
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    localStorage.removeItem("authToken")
    localStorage.removeItem("isAuthenticated")
    window.location.href = "/login"
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-xl font-bold text-primary glow-text">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen relative">
      <div className="absolute inset-0 grid-background opacity-50" />
      <aside className="w-64 bg-card/50 backdrop-blur-sm border-r border-primary/10 relative">
        <div className="h-full flex flex-col">
          <div className="p-6">
            <Link href="/" className="text-xl font-bold text-primary glow-text">
              HealthTrack
            </Link>
          </div>
          <nav className="flex-1 px-4 space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-3 text-sm rounded-lg hover:bg-primary/10 transition-colors"
            >
              <LayoutDashboard size={18} className="text-primary" />
              Dashboard
            </Link>
            <Link
              href="/dashboard/profile"
              className="flex items-center gap-3 px-4 py-3 text-sm rounded-lg hover:bg-primary/10 transition-colors"
            >
              <User size={18} className="text-primary" />
              Profile
            </Link>
            <Link
              href="/dashboard/analyze-results"
              className="flex items-center gap-3 px-4 py-3 text-sm rounded-lg hover:bg-primary/10 transition-colors"
            >
              <FileText size={18} className="text-primary" />
              Analyze Results
            </Link>
            <Link
              href="/dashboard/settings"
              className="flex items-center gap-3 px-4 py-3 text-sm rounded-lg hover:bg-primary/10 transition-colors"
            >
              <Settings size={18} className="text-primary" />
              Settings
            </Link>
          </nav>
          <div className="p-4 space-y-2 border-t border-primary/10">
            <Link
              href="/admin"
              className="flex items-center gap-3 px-4 py-3 text-sm rounded-lg hover:bg-primary/10 transition-colors"
            >
              <ShieldCheck size={18} className="text-primary" />
              Admin Panel
            </Link>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start gap-3 text-sm hover:bg-primary/10 hover:text-foreground"
            >
              <LogOut size={18} className="text-primary" />
              Logout
            </Button>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="relative max-w-6xl mx-auto px-8 py-12">{children}</div>
      </main>
    </div>
  )
}

