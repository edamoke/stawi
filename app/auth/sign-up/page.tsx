"use client"

import type React from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { X, Eye, EyeOff } from "lucide-react"

function getRedirectUrl(path = "/auth/callback") {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return `${process.env.NEXT_PUBLIC_SITE_URL}${path}`
  }
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}${path}`
  }
  if (typeof window !== "undefined") {
    return `${window.location.origin}${path}`
  }
  return path
}

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: getRedirectUrl("/auth/callback"),
          data: {
            full_name: fullName,
          },
        },
      })
      if (error) throw error
      router.push("/auth/sign-up-success")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignUp = async () => {
    const supabase = createClient()
    setIsGoogleLoading(true)
    setError(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: getRedirectUrl("/auth/callback"),
        },
      })
      if (error) throw error
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
      setIsGoogleLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-[#FAF8F5] flex">
      {/* Left side - Image - Updated alt text */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <Image
          src="/placeholder.svg?height=1200&width=800"
          alt="Stawiafrika Leather Bags"
          fill
          className="object-cover"
          priority
          sizes="50vw"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="absolute bottom-12 left-12 text-white">
          <h2 className="text-4xl font-serif mb-2">Join Stawiafrika</h2>
          <p className="text-white/80 text-sm">Create an account to discover African leather craftsmanship</p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 overflow-y-auto">
        <div className="w-full max-w-md my-auto">
          <Link href="/" className="absolute top-6 right-6 text-[#6B6560] hover:text-[#2C2420] transition-colors">
            <X className="w-5 h-5" />
          </Link>

          <div className="text-center mb-8">
            <Link href="/">
              <h1 className="text-2xl font-serif tracking-[0.2em] mb-2">StawiAFRIKA</h1>
            </Link>
            <p className="text-sm text-[#6B6560]">Create your account</p>
          </div>


          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <Label htmlFor="full-name" className="text-xs tracking-wider uppercase text-[#6B6560]">
                Full Name
              </Label>
              <Input
                id="full-name"
                type="text"
                placeholder="Jane Doe"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1.5 border-[#E8E4DE] focus:border-[#8B4513] focus:ring-[#8B4513] h-12"
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-xs tracking-wider uppercase text-[#6B6560]">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 border-[#E8E4DE] focus:border-[#8B4513] focus:ring-[#8B4513] h-12"
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-xs tracking-wider uppercase text-[#6B6560]">
                Password
              </Label>
              <div className="relative mt-1.5">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-[#E8E4DE] focus:border-[#8B4513] focus:ring-[#8B4513] pr-10 h-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B6560] hover:text-[#2C2420]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <Label htmlFor="repeat-password" className="text-xs tracking-wider uppercase text-[#6B6560]">
                Confirm Password
              </Label>
              <Input
                id="repeat-password"
                type="password"
                required
                value={repeatPassword}
                onChange={(e) => setRepeatPassword(e.target.value)}
                className="mt-1.5 border-[#E8E4DE] focus:border-[#8B4513] focus:ring-[#8B4513] h-12"
              />
            </div>

            {error && <p className="text-sm text-red-500 text-center">{error}</p>}

            <Button
              type="submit"
              className="w-full h-12 bg-[#2C2420] hover:bg-[#8B4513] text-white transition-colors tracking-wider text-sm"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "CREATE ACCOUNT"}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-[#6B6560]">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-[#8B4513] hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
