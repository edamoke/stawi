"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Shield, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"

export default function AdminSetupPage() {
  const [email, setEmail] = useState("edamoke@gmail.com")
  const [password, setPassword] = useState("HobbitKing@1980")
  const [fullName, setFullName] = useState("Admin")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setMessage("")

    try {
      const response = await fetch("/api/admin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setStatus("success")
        setMessage(data.message || "Admin user created successfully!")
      } else {
        setStatus("error")
        setMessage(data.error || "Failed to create admin user")
      }
    } catch (error) {
      setStatus("error")
      setMessage(error instanceof Error ? error.message : "An unexpected error occurred")
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
            <h1 className="text-2xl font-serif text-white tracking-wider mb-2">ADMIN SETUP</h1>
            <p className="text-sm text-[#A09A94]">Create or update admin account</p>
          </div>

          <form onSubmit={handleSetup} className="space-y-5">
            <div>
              <Label htmlFor="email" className="text-xs tracking-wider uppercase text-[#A09A94]">
                Admin Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1.5 bg-[#1a1a1a] border-[#3d3d3d] text-white placeholder:text-[#6B6560] focus:border-[#8B4513] focus:ring-[#8B4513] h-12"
                disabled={status === "loading" || status === "success"}
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-xs tracking-wider uppercase text-[#A09A94]">
                Password
              </Label>
              <Input
                id="password"
                type="text"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1.5 bg-[#1a1a1a] border-[#3d3d3d] text-white focus:border-[#8B4513] focus:ring-[#8B4513] h-12"
                disabled={status === "loading" || status === "success"}
              />
            </div>

            <div>
              <Label htmlFor="fullName" className="text-xs tracking-wider uppercase text-[#A09A94]">
                Full Name (Optional)
              </Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Admin Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="mt-1.5 bg-[#1a1a1a] border-[#3d3d3d] text-white placeholder:text-[#6B6560] focus:border-[#8B4513] focus:ring-[#8B4513] h-12"
                disabled={status === "loading" || status === "success"}
              />
            </div>

            {message && (
              <div
                className={`rounded-lg p-3 flex items-center gap-2 ${
                  status === "success"
                    ? "bg-green-500/10 border border-green-500/20"
                    : "bg-red-500/10 border border-red-500/20"
                }`}
              >
                {status === "success" ? (
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                )}
                <p className={`text-sm ${status === "success" ? "text-green-400" : "text-red-400"}`}>{message}</p>
              </div>
            )}

            <Button
              type="submit"
              className="w-full h-12 bg-[#8B4513] hover:bg-[#A0522D] text-white font-semibold transition-colors tracking-wider text-sm"
              disabled={status === "loading" || status === "success"}
            >
              {status === "loading" ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Setting up admin...
                </span>
              ) : status === "success" ? (
                <span className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Setup Complete
                </span>
              ) : (
                "Create Admin Account"
              )}
            </Button>
          </form>

          {status === "success" && (
            <div className="mt-6">
              <Link href="/admin/login">
                <Button
                  variant="outline"
                  className="w-full h-12 border-[#8B4513] text-[#8B4513] hover:bg-[#8B4513] hover:text-white bg-transparent"
                >
                  Go to Admin Login →
                </Button>
              </Link>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-[#3d3d3d]">
            <p className="text-xs text-center text-[#6B6560]">
              This page should be disabled after initial setup for security reasons.
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
