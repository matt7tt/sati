"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, User, Settings, LogOut, FileText, ShieldCheck, MessageSquare, Activity, Utensils, ChevronLeft, ChevronRight, Menu } from "lucide-react"
import type React from "react"
import { toast } from '@/components/ui/use-toast'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isLoading, setIsLoading] = useState(true)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Check if there's a saved sidebar state in localStorage
    const savedSidebarState = localStorage.getItem("sidebar-collapsed")
    if (savedSidebarState !== null) {
      setIsCollapsed(savedSidebarState === "true")
    }

    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("access_token")
        console.log("Dashboard Layout - Checking auth")
        console.log("Token exists:", !!token)

        if (!token) {
          console.log("No token found, redirecting to login...")
          window.location.replace("/login")
          return
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Auth check failed:", error)
        window.location.replace("/login")
      }
    }

    checkAuth()
  }, [])

  const toggleSidebar = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem("sidebar-collapsed", String(newState))
  }

  const handleLogout = () => {
    document.cookie = "access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    localStorage.removeItem("access_token")
    localStorage.removeItem("isAuthenticated")
    window.location.replace("/login")
  }

  // Helper function to check if a path is active (current path or subpath)
  const isActivePath = (path: string) => {
    if (path === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(path)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-xl font-bold text-primary glow-text">Loading...</div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50 relative">
      {/* Mobile Menu Toggle - Only visible on small screens */}
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 z-50 rounded-full shadow-md md:hidden"
        onClick={toggleSidebar}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Sidebar */}
      <aside 
        className={`bg-white shadow-sm border-r flex-shrink-0 transition-all duration-300 ease-in-out
                  ${isCollapsed ? 'w-0 md:w-12 overflow-hidden' : 'w-0 md:w-56'}
                  ${isCollapsed ? 'md:absolute md:hover:w-56 md:hover:shadow-xl md:z-20 md:bottom-0 md:top-0' : ''}
                  fixed md:relative left-0 top-0 h-screen md:h-auto
                  ${!isCollapsed && 'translate-x-0'} 
                  ${isCollapsed && '-translate-x-full md:translate-x-0'}`}
      >
        <div className="h-full flex flex-col relative">
          {/* Toggle Button - Only visible on medium screens and above */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute -right-3 top-6 rounded-full h-6 w-6 border shadow-sm bg-white text-gray-600 hidden md:flex items-center justify-center"
            onClick={toggleSidebar}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>

          <div className={`p-4 border-b flex items-center ${isCollapsed ? 'justify-center md:p-3' : 'justify-start'}`}>
            <Link href="/dashboard" className={`font-bold text-primary ${isCollapsed ? 'text-lg' : 'text-xl'}`}>
              {isCollapsed ? 'K.' : 'KWILT'}
            </Link>
          </div>
          <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
            <Link
              href="/dashboard"
              className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg ${
                isActivePath('/dashboard') 
                  ? 'bg-primary/5 text-primary font-medium' 
                  : 'text-gray-600 hover:bg-gray-100'
              } transition-colors ${isCollapsed ? 'justify-center md:px-2' : 'justify-start'}`}
              title="Dashboard"
            >
              <LayoutDashboard size={18} />
              <span className={isCollapsed ? 'hidden md:group-hover:block' : ''}>Dashboard</span>
            </Link>
            <Link
              href="/dashboard/chat"
              className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg ${
                isActivePath('/dashboard/chat') 
                  ? 'bg-primary/5 text-primary font-medium' 
                  : 'text-gray-600 hover:bg-gray-100'
              } transition-colors ${isCollapsed ? 'justify-center md:px-2' : 'justify-start'}`}
              title="Chat"
            >
              <MessageSquare size={18} />
              <span className={isCollapsed ? 'hidden md:group-hover:block' : ''}>Chat</span>
            </Link>
            <Link
              href="/dashboard/profile"
              className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg ${
                isActivePath('/dashboard/profile') 
                  ? 'bg-primary/5 text-primary font-medium' 
                  : 'text-gray-600 hover:bg-gray-100'
              } transition-colors ${isCollapsed ? 'justify-center md:px-2' : 'justify-start'}`}
              title="Profile"
            >
              <User size={18} />
              <span className={isCollapsed ? 'hidden md:group-hover:block' : ''}>Profile</span>
            </Link>
            <Link
              href="/dashboard/analyze-results"
              className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg ${
                isActivePath('/dashboard/analyze-results') 
                  ? 'bg-primary/5 text-primary font-medium' 
                  : 'text-gray-600 hover:bg-gray-100'
              } transition-colors ${isCollapsed ? 'justify-center md:px-2' : 'justify-start'}`}
              title="Analyze Results"
            >
              <FileText size={18} />
              <span className={isCollapsed ? 'hidden md:group-hover:block' : ''}>Analyze Results</span>
            </Link>
            <Link
              href="/dashboard/lab-results"
              className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg ${
                isActivePath('/dashboard/lab-results') 
                  ? 'bg-primary/5 text-primary font-medium' 
                  : 'text-gray-600 hover:bg-gray-100'
              } transition-colors ${isCollapsed ? 'justify-center md:px-2' : 'justify-start'}`}
              title="Lab Results"
            >
              <Activity size={18} />
              <span className={isCollapsed ? 'hidden md:group-hover:block' : ''}>Lab Results</span>
            </Link>
            <Link
              href="/dashboard/meals"
              className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg ${
                isActivePath('/dashboard/meals') 
                  ? 'bg-primary/5 text-primary font-medium' 
                  : 'text-gray-600 hover:bg-gray-100'
              } transition-colors ${isCollapsed ? 'justify-center md:px-2' : 'justify-start'}`}
              title="Meals"
            >
              <Utensils size={18} />
              <span className={isCollapsed ? 'hidden md:group-hover:block' : ''}>Meals</span>
            </Link>
            <Link
              href="/dashboard/settings"
              className={`flex items-center gap-2 px-3 py-2 text-sm rounded-lg ${
                isActivePath('/dashboard/settings') 
                  ? 'bg-primary/5 text-primary font-medium' 
                  : 'text-gray-600 hover:bg-gray-100'
              } transition-colors ${isCollapsed ? 'justify-center md:px-2' : 'justify-start'}`}
              title="Settings"
            >
              <Settings size={18} />
              <span className={isCollapsed ? 'hidden md:group-hover:block' : ''}>Settings</span>
            </Link>
          </nav>
          <div className={`p-3 border-t ${isCollapsed ? 'flex justify-center' : ''}`}>
            <Button
              onClick={handleLogout}
              variant="ghost"
              className={`${isCollapsed ? 'w-9 p-0 justify-center' : 'w-full justify-start'} gap-2 text-sm text-gray-600 hover:bg-gray-100 hover:text-gray-900`}
              title="Logout"
            >
              <LogOut size={18} className="text-gray-500" />
              <span className={isCollapsed ? 'hidden' : ''}>Logout</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
