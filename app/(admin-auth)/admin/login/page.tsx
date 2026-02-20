"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Eye, EyeOff, Shield, Lock, AlertTriangle } from "lucide-react"

function getRedirectUrl() {
  if (typeof window !== "undefined") {
    if (process.env.NEXT_PUBLIC_SITE_URL) {
      return `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/admin`
    }
    if (process.env.NEXT_PUBLIC_VERCEL_URL) {
      return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/auth/callback?next=/admin`
    }
    return `${window.location.origin}/auth/callback?next=/admin`
  }
  return "/auth/callback?next=/admin"
}

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: getRedirectUrl(),
        },
      })
      if (authError) throw authError

      await new Promise((resolve) => setTimeout(resolve, 2000))

      let profile = null
      let lastError = null

      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const { data, error: profileError } = await supabase
            .from("profiles")
            .select("is_admin")
            .eq("id", authData.user?.id)
            .single()

          if (!profileError) {
            profile = data
            break
          }
          lastError = profileError

          if (attempt < 2) {
            await new Promise((resolve) => setTimeout(resolve, 1000))
          }
        } catch (err) {
          lastError = err
          if (attempt < 2) {
            await new Promise((resolve) => setTimeout(resolve, 1000))
          }
        }
      }

      if (!profile) throw new Error("Unable to verify admin status after signup")

      if (!profile?.is_admin) {
        throw new Error("This email is not authorized for admin access")
      }

      router.push("/admin")
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (authError) throw authError

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", authData.user?.id)
        .single()

      if (profileError) throw new Error("Unable to verify admin status")

      if (!profile?.is_admin) {
        await supabase.auth.signOut()
        throw new Error("Access denied. Admin privileges required.")
      }

      router.push("/admin")
      router.refresh()
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: getRedirectUrl(),
        },
      })
      if (error) throw error
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-[#2C2420] rounded-2xl shadow-2xl p-8 border border-[#8B4513]/20">
          {/* Admin Badge */}
          <div className="flex justify-center mb-6">
            <div className="bg-[#8B4513]/10 p-4 rounded-full">
              <Shield className="w-10 h-10 text-[#8B4513]" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-serif text-white tracking-wider mb-2">
              {isSignUp ? "CREATE ADMIN ACCOUNT" : "ADMIN PORTAL"}
            </h1>
            <p className="text-sm text-[#A09A94]">Stawiafrika Management</p>
          </div>

          {/* Google OAuth Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 mb-6 bg-white hover:bg-gray-100 text-gray-800 border-0"
            onClick={handleGoogleLogin}
            disabled={isLoading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-[#3d3d3d]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#2C2420] px-2 text-[#6B6560]">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="space-y-5">
            <div>
              <Label htmlFor="email" className="text-xs tracking-wider uppercase text-[#A09A94]">
                Admin Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@Stawiafrika.co.ke"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 bg-[#1a1a1a] border-[#3d3d3d] text-white placeholder:text-[#6B6560] focus:border-[#8B4513] focus:ring-[#8B4513] h-12"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-xs tracking-wider uppercase text-[#A09A94]">
                Password
              </Label>
              <div className="relative mt-1.5">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-[#1a1a1a] border-[#3d3d3d] text-white focus:border-[#8B4513] focus:ring-[#8B4513] pr-10 h-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6560] hover:text-[#8B4513]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-[#8B4513] hover:bg-[#A0522D] text-white font-semibold transition-colors tracking-wider text-sm"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {isSignUp ? "Creating Account..." : "Authenticating..."}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  {isSignUp ? "CREATE ACCOUNT" : "ACCESS ADMIN"}
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp)
                setError(null)
              }}
              className="text-sm text-[#A09A94] hover:text-[#8B4513] transition-colors"
            >
              {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
            </button>
          </div>

          <div className="mt-8 pt-6 border-t border-[#3d3d3d]">
            <p className="text-xs text-center text-[#6B6560]">
              This is a restricted area. Unauthorized access attempts are logged.
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link href="/" className="text-xs text-[#A09A94] hover:text-[#8B4513] transition-colors">
              ← Return to Store
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
