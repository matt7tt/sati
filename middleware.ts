import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Get the pathname of the request (e.g. /, /dashboard)
  const path = request.nextUrl.pathname

  // Define public paths that don't require authentication
  const isPublicPath = path === '/' || 
                      path === '/login' || 
                      path === '/register' ||
                      path.startsWith('/about') ||
                      path.startsWith('/contact')

  // Get the token from the cookies
  const token = request.cookies.get('access_token')?.value || ''

  // Define protected paths that require authentication
  const isProtectedPath = path.startsWith('/dashboard') || 
                         path.startsWith('/profile') ||
                         path.startsWith('/settings')

  // If the path is public and user is logged in, redirect to dashboard
  if (isPublicPath && token && path !== '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // If the path is protected and user is not logged in, redirect to login
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

// Configure which paths should be processed by this middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

