"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

interface UserProfile {
  email: string
  username: string
  id: number
  created_at: string
  updated_at: string
}

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token =
          document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1") ||
          localStorage.getItem("authToken")
        if (!token) {
          console.log("No token found, redirecting to login...")
          router.push("/login")
          return
        }

        const response = await fetch(
          "https://e00e3da9-12ec-4202-be34-632cf709d66e-00-x1fhd1x5lbwo.worf.replit.dev/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        )
        if (response.ok) {
          const data: UserProfile = await response.json()
          setProfile(data)
          setUsername(data.username)
          setEmail(data.email)
        } else if (response.status === 401) {
          console.log("Unauthorized access, redirecting to login...")
          router.push("/login")
        } else {
          console.error("Failed to fetch profile")
          toast({
            title: "Error",
            description: "Failed to fetch profile. Please try again.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast({
          title: "Error",
          description: "An error occurred while fetching the profile.",
          variant: "destructive",
        })
      }
    }

    fetchProfile()
  }, [router, toast])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token =
        document.cookie.replace(/(?:(?:^|.*;\s*)token\s*=\s*([^;]*).*$)|^.*$/, "$1") ||
        localStorage.getItem("authToken")
      if (!token) {
        console.log("No token found, redirecting to login...")
        router.push("/login")
        return
      }

      const response = await fetch(
        "https://e00e3da9-12ec-4202-be34-632cf709d66e-00-x1fhd1x5lbwo.worf.replit.dev/api/auth/me",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ username, email, password: password || undefined }),
        },
      )

      if (response.ok) {
        const updatedProfile: UserProfile = await response.json()
        setProfile(updatedProfile)
        setUsername(updatedProfile.username)
        setEmail(updatedProfile.email)
        setPassword("")
        toast({
          title: "Success",
          description: "Profile updated successfully",
        })
      } else if (response.status === 422) {
        const errorData = await response.json()
        toast({
          title: "Validation Error",
          description: errorData.detail[0].msg || "Invalid input. Please check your data.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to update profile. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "An error occurred while updating the profile.",
        variant: "destructive",
      })
    }
  }

  if (!profile) {
    return <div>Loading profile...</div>
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <form onSubmit={handleUpdateProfile} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <Input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            New Password (leave blank to keep current password)
          </label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1"
          />
        </div>
        <Button type="submit">Update Profile</Button>
      </form>
      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">Account Information</h2>
        <p>User ID: {profile.id}</p>
        <p>Created at: {new Date(profile.created_at).toLocaleString()}</p>
        <p>Last updated: {new Date(profile.updated_at).toLocaleString()}</p>
      </div>
    </div>
  )
}

