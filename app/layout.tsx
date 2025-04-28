import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import type React from "react" // Import React
import { ThemeProvider } from "@/components/ThemeProvider"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

export const metadata: Metadata = {
  title: "KWILT - Personalized Healthspan Optimization",
  description: "AI-powered personalized health plans for busy adults. Improve metabolic health, balance hormones, protect your heart, boost brainpower, and fight inflammation.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable}`} suppressHydrationWarning>
      <body className="bg-background">
        <ThemeProvider defaultTheme="light">
          {children}
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  )
}

import './globals.css'