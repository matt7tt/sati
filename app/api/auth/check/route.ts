import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  try {
    console.log("[SERVER] Auth check request received")

    // Log all headers properly
    const headerEntries = Array.from(request.headers.entries())
    console.log("[SERVER] All headers:", headerEntries)

    // Try both cases for authorization header
    const authHeader = request.headers.get("authorization") || request.headers.get("Authorization")
    console.log("[SERVER] Auth header:", authHeader)

    let token = null

    // Try to get token from Authorization header
    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1]
      console.log("[SERVER] Token extracted from auth header")
    }

    // If no token in Authorization header, try cookies
    if (!token) {
      const cookieToken = request.cookies.get("token")
      if (cookieToken) {
        token = cookieToken.value
        console.log("[SERVER] Token found in cookies")
      }
    }

    if (!token) {
      console.log("[SERVER] No token found in either header or cookies")
      return NextResponse.json(
        {
          isAuthenticated: false,
          error: "No token found",
        },
        { status: 401 },
      )
    }

    // Basic JWT format check
    const isValidToken = token.split(".").length === 3
    console.log("[SERVER] Token format valid:", isValidToken)

    if (!isValidToken) {
      return NextResponse.json(
        {
          isAuthenticated: false,
          error: "Invalid token format",
        },
        { status: 401 },
      )
    }

    return NextResponse.json({
      isAuthenticated: true,
      message: "Token validated successfully",
    })
  } catch (error) {
    console.error("[SERVER] Auth check error:", error)
    return NextResponse.json(
      {
        isAuthenticated: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 401 },
    )
  }
}

