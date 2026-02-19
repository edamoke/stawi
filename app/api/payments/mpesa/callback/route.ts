import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()

    console.log("[v0] M-Pesa callback received:", JSON.stringify(body, null, 2))

    const { Body } = body

    if (!Body?.stkCallback) {
      return NextResponse.json({ error: "Invalid callback data" }, { status: 400 })
    }

    const { CheckoutRequestID, ResultCode, ResultDesc } = Body.stkCallback

    const supabase = await createClient()

    if (ResultCode === 0) {
      // Payment successful
      await supabase
        .from("orders")
        .update({
          payment_status: "completed",
          status: "processing",
        })
        .eq("payment_reference", CheckoutRequestID)

      console.log("[v0] Payment successful for CheckoutRequestID:", CheckoutRequestID)
    } else {
      // Payment failed
      await supabase
        .from("orders")
        .update({
          payment_status: "failed",
        })
        .eq("payment_reference", CheckoutRequestID)

      console.log("[v0] Payment failed:", ResultDesc)
    }

    return NextResponse.json({ message: "Callback processed" })
  } catch (error) {
    console.error("[v0] M-Pesa callback error:", error)
    return NextResponse.json({ error: "Failed to process callback" }, { status: 500 })
  }
}
