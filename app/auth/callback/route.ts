import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/"
  const error = searchParams.get("error")
  const errorDescription = searchParams.get("error_description")

  // Handle OAuth errors
  if (error) {
    const errorUrl = new URL("/auth/error", origin)
    errorUrl.searchParams.set("error", error)
    if (errorDescription) {
      errorUrl.searchParams.set("error_description", errorDescription)
    }
    return NextResponse.redirect(errorUrl)
  }

  if (code) {
    const supabase = await createClient()
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      const errorUrl = new URL("/auth/error", origin)
      errorUrl.searchParams.set("error", "invalid_request")
      errorUrl.searchParams.set("error_description", exchangeError.message)
      return NextResponse.redirect(errorUrl)
    }

    // Get user info for routing
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      // Ensure profile exists (for OAuth users)
      const { data: profile } = await supabase.from("profiles").select("id, is_admin").eq("id", user.id).single()

      // If no profile, create one (handles OAuth first-time login)
      if (!profile) {
        await supabase.from("profiles").insert({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || "",
          is_admin: false,
        })
      }

      // Redirect admin users to admin dashboard if trying to access admin
      if (profile?.is_admin && next.startsWith("/admin")) {
        return NextResponse.redirect(`${origin}/admin`)
      }
    }

    // Handle forwarded host for production
    const forwardedHost = request.headers.get("x-forwarded-host")
    const isLocalEnv = process.env.NODE_ENV === "development"

    if (isLocalEnv) {
      return NextResponse.redirect(`${origin}${next}`)
    } else if (forwardedHost) {
      return NextResponse.redirect(`https://${forwardedHost}${next}`)
    } else {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // No code provided
  const errorUrl = new URL("/auth/error", origin)
  errorUrl.searchParams.set("error", "invalid_request")
  return NextResponse.redirect(errorUrl)
}
