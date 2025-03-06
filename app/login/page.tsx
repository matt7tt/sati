"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import AuthCard from '@/components/auth/AuthCard'
import LoginForm from '@/components/auth/LoginForm'
import SocialLoginButtons from '@/components/auth/SocialLoginButtons'
import ForgotPasswordLink from '@/components/auth/ForgotPasswordLink'

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new URLSearchParams()
      formData.append("username", email)
      formData.append("password", password)
      formData.append("grant_type", "password")

      console.log("Attempting login...")
      const response = await fetch(
        "https://e00e3da9-12ec-4202-be34-632cf709d66e-00-x1fhd1x5lbwo.worf.replit.dev/api/auth/token",
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formData,
        },
      )

      if (response.ok) {
        const data = await response.json()
        const token = data.access_token

        // Set cookie first
        document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Strict`

        // Then localStorage
        localStorage.setItem("authToken", token)
        localStorage.setItem("isAuthenticated", "true")

        console.log("Login successful. Token set:", token)

        // Show success toast
        toast({
          title: "Success",
          description: "Login successful. Redirecting to dashboard...",
        })

        // Wait a moment for storage to be set
        await new Promise((resolve) => setTimeout(resolve, 100))

        // Use window.location for a hard redirect
        window.location.href = "/dashboard"
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error("Login failed:", response.status, errorData)
        if (response.status === 422) {
          toast({
            title: "Validation Error",
            description: errorData.detail?.[0]?.msg || "Invalid email or password",
            variant: "destructive",
          })
        } else {
          toast({
            title: "Login Error",
            description: errorData.detail || `An error occurred during login: ${response.statusText}`,
            variant: "destructive",
          })
        }
      }
    } catch (error) {
      console.error("Login error:", error)
      let errorMessage = "An unexpected error occurred during login"
      if (error instanceof Error) {
        errorMessage = error.message
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <AuthCard title="Sign in to your account" subtitle="Enter your credentials below">
        <LoginForm />
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>
          
          <SocialLoginButtons />
        </div>
        
        <div className="mt-6 flex items-center justify-between">
          <ForgotPasswordLink />
          <Link href="/register" className="text-sm font-medium text-blue-600 hover:text-blue-500">
            Don't have an account?
          </Link>
        </div>
      </AuthCard>
    </div>
  )
}

