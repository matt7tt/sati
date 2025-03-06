"use client"

import Link from "next/link"
import AuthCard from '@/components/auth/AuthCard'
import SignupForm from '@/components/auth/SignupForm'
import SocialLoginButtons from '@/components/auth/SocialLoginButtons'

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <AuthCard title="Create an account" subtitle="Sign up to start your health journey">
        <SignupForm />
        
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
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:text-blue-500 font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </AuthCard>
    </div>
  )
}

