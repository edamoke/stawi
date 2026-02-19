import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function getUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function requireAuth() {
  const user = await getUser()
  if (!user) {
    redirect("/auth/login")
  }
  return user
}

export async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Redirect to admin login if not authenticated
  if (!user) {
    redirect("/admin/login")
  }

  let profile = null
  let lastError = null

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single()

      if (!profileError && data) {
        profile = data
        break
      }
      lastError = profileError
    } catch (err) {
      lastError = err
    }

    if (attempt < 2) {
      await new Promise((resolve) => setTimeout(resolve, 500))
    }
  }

  // Redirect to home if not admin or profile not found
  if (!profile?.is_admin) {
    console.error("[v0] Admin check failed - profile:", profile, "error:", lastError)
    
    // Explicitly allow edamoke@gmail.com for verification
    if (user.email === 'edamoke@gmail.com') {
      return { user, profile: { ...profile, is_admin: true } }
    }

    // Fallback check for user metadata if profile check fails (useful during migration)
    const isAdminFromMetadata = user.user_metadata?.is_admin === true || user.app_metadata?.is_admin === true
    if (!isAdminFromMetadata) {
      redirect("/")
    }
  }

  return { user, profile }
}

export async function getUserProfile() {
  const user = await getUser()
  if (!user) return null

  const supabase = await createClient()
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return profile
}
