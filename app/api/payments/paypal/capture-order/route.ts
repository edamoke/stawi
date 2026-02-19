import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { paypalOrderId } = await request.json()

    if (!paypalOrderId) {
      return NextResponse.json({ error: "Missing PayPal order ID" }, { status: 400 })
    }

    const clientId = process.env.PAYPAL_CLIENT_ID
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET
    const baseUrl = process.env.PAYPAL_BASE_URL || "https://api-m.sandbox.paypal.com"

    if (!clientId || !clientSecret) {
      return NextResponse.json({ error: "PayPal configuration is incomplete" }, { status: 500 })
    }

    // Get PayPal access token
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")
    const tokenResponse = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    })

    if (!tokenResponse.ok) {
      throw new Error("Failed to get PayPal access token")
    }

    const { access_token } = await tokenResponse.json()

    // Capture PayPal order
    const captureResponse = await fetch(`${baseUrl}/v2/checkout/orders/${paypalOrderId}/capture`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
    })

    const captureData = await captureResponse.json()

    if (captureData.status === "COMPLETED") {
      // Update order status
      const supabase = await createClient()
      await supabase
        .from("orders")
        .update({
          payment_status: "completed",
          status: "processing",
        })
        .eq("payment_reference", paypalOrderId)

      return NextResponse.json({
        success: true,
        message: "Payment captured successfully",
      })
    }

    return NextResponse.json({ error: "Failed to capture payment" }, { status: 400 })
  } catch (error) {
    console.error("[v0] PayPal capture error:", error)
    return NextResponse.json({ error: "Failed to capture payment" }, { status: 500 })
  }
}
