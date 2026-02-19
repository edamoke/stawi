import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

const PROTECTED_ROUTES = ["/dashboard", "/orders", "/profile"]
const ADMIN_ROUTES = ["/admin"]
const AUTH_ROUTES = ["/auth/login", "/auth/sign-up", "/admin/login"]

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If Supabase is not configured, allow the request to proceed
  // This prevents errors during initial setup or when env vars are missing
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase environment variables not configured")
    return supabaseResponse
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
      },
    },
  })

  // Add security headers
  supabaseResponse.headers.set("X-Frame-Options", "DENY")
  supabaseResponse.headers.set("X-Content-Type-Options", "nosniff")
  supabaseResponse.headers.set("Referrer-Policy", "strict-origin-when-cross-origin")

  const pathname = request.nextUrl.pathname
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))
  const isAdminRoute = ADMIN_ROUTES.some((route) => pathname.startsWith(route))
  const isProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
  const isAdminLoginPage = pathname === "/admin/login"

  if (!isAuthRoute && !isAdminRoute && !isProtectedRoute) {
    return supabaseResponse
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Redirect authenticated users away from auth pages (except admin login for non-admins)
  if (user && isAuthRoute && !isAdminLoginPage) {
    const url = request.nextUrl.clone()
    url.pathname = "/dashboard"
    return NextResponse.redirect(url)
  }

  // Protect user routes
  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    url.searchParams.set("redirect", pathname)
    return NextResponse.redirect(url)
  }

  // Protect admin routes (except admin login page)
  if (isAdminRoute && !isAdminLoginPage && !user) {
    const url = request.nextUrl.clone()
    url.pathname = "/admin/login"
    return NextResponse.redirect(url)
  }

  // Check if user is admin for admin routes (except login)
  if (isAdminRoute && !isAdminLoginPage && user) {
    try {
      const { data: profile, error } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()

      if (error) {
        console.error("[v0] Admin verification error:", error)
        const url = request.nextUrl.clone()
        url.pathname = "/"
        return NextResponse.redirect(url)
      }

      if (!profile?.is_admin) {
        const url = request.nextUrl.clone()
        url.pathname = "/"
        return NextResponse.redirect(url)
      }
    } catch (err) {
      console.error("[v0] Admin check failed:", err)
      const url = request.nextUrl.clone()
      url.pathname = "/"
      return NextResponse.redirect(url)
    }
  }

  // Redirect admin users from admin login to admin dashboard
  if (isAdminLoginPage && user) {
    try {
      const { data: profile, error } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()

      if (error) {
        console.error("[v0] Admin redirect check error:", error)
        return supabaseResponse
      }

      if (profile?.is_admin) {
        const url = request.nextUrl.clone()
        url.pathname = "/admin"
        return NextResponse.redirect(url)
      }
    } catch (err) {
      console.error("[v0] Admin redirect check failed:", err)
    }
  }

  return supabaseResponse
}
