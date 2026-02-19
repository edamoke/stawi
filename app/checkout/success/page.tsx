"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { MainNav } from "@/components/navigation/main-nav"
import { Footer } from "@/components/navigation/footer"
import { Button } from "@/components/ui/button"
import { CheckCircle, Package, Mail, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"

function SuccessContent() {
  const searchParams = useSearchParams()
  const orderId = searchParams.get("orderId")

  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    async function getUser() {
      const { createClient } = await import("@/lib/supabase/client")
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [])

  return (
    <div className="min-h-screen">
      <MainNav variant="solid" />

      <div className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="w-24 h-24 rounded-full bg-green-100 mx-auto flex items-center justify-center mb-8">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>

        <h1 className="text-3xl font-serif text-[#2C2420] mb-4">Thank You for Your Order!</h1>

        <p className="text-[#6B6560] mb-2">Your order has been received and is being processed.</p>

        {orderId && (
          <p className="text-sm text-[#8B8178] mb-8">
            Order ID: <span className="font-mono text-[#2C2420]">{orderId}</span>
          </p>
        )}

        <div className="bg-white rounded-xl p-8 mb-8 shadow-sm">
          <h2 className="font-serif text-lg text-[#2C2420] mb-6">What happens next?</h2>

          <div className="space-y-6 text-left">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-[#C9A86C]/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-[#C9A86C]" />
              </div>
              <div>
                <h3 className="font-medium text-[#2C2420]">Order Confirmation</h3>
                <p className="text-sm text-[#6B6560]">
                  You will receive an email confirmation with your order details shortly.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-[#C9A86C]/10 flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-[#C9A86C]" />
              </div>
              <div>
                <h3 className="font-medium text-[#2C2420]">Shipping</h3>
                <p className="text-sm text-[#6B6560]">
                  Your items will be carefully packaged and shipped within 2-3 business days.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {user ? (
            <Button asChild className="bg-[#C9A86C] hover:bg-[#B8975B] text-white">
              <Link href="/dashboard">
                View My Orders
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          ) : (
            <Button asChild className="bg-[#C9A86C] hover:bg-[#B8975B] text-white">
              <Link href="/our-collection">
                Browse More
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          )}
          <Button asChild variant="outline">
            <Link href="/our-collection">Continue Shopping</Link>
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8F5]" />}>
      <SuccessContent />
    </Suspense>
  )
}
