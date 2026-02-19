import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { orderId } = await request.json()

    if (!orderId) {
      return NextResponse.json({ error: "Missing order ID" }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: order } = await supabase.from("orders").select("*").eq("id", orderId).single()

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
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

    // Create PayPal order
    const orderResponse = await fetch(`${baseUrl}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: orderId,
            amount: {
              currency_code: "USD",
              value: (order.total_amount / 100).toFixed(2), // Convert KSh to USD (rough conversion)
            },
          },
        ],
        application_context: {
          return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/success`,
          cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/cancel`,
        },
      }),
    })

    const orderData = await orderResponse.json()

    if (orderData.id) {
      // Update order with PayPal order ID
      await supabase
        .from("orders")
        .update({
          payment_reference: orderData.id,
          payment_status: "pending",
        })
        .eq("id", orderId)

      return NextResponse.json({
        success: true,
        orderId: orderData.id,
        approvalUrl: orderData.links.find((link: { rel: string }) => link.rel === "approve")?.href,
      })
    }

    return NextResponse.json({ error: "Failed to create PayPal order" }, { status: 400 })
  } catch (error) {
    console.error("[v0] PayPal create order error:", error)
    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 })
  }
}
