import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// M-Pesa STK Push implementation
export async function POST(request: Request) {
  try {
    const { amount, phoneNumber, orderId } = await request.json()

    // Validate input
    if (!amount || !phoneNumber || !orderId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Get M-Pesa credentials from environment variables
    const consumerKey = process.env.MPESA_CONSUMER_KEY
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET
    const shortcode = process.env.MPESA_SHORTCODE
    const passkey = process.env.MPESA_PASSKEY
    const callbackUrl = process.env.MPESA_CALLBACK_URL

    if (!consumerKey || !consumerSecret || !shortcode || !passkey || !callbackUrl) {
      return NextResponse.json({ error: "M-Pesa configuration is incomplete" }, { status: 500 })
    }

    // Get OAuth token
    const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64")
    const tokenResponse = await fetch(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
        },
      },
    )

    if (!tokenResponse.ok) {
      throw new Error("Failed to get M-Pesa access token")
    }

    const { access_token } = await tokenResponse.json()

    // Generate timestamp
    const timestamp = new Date()
      .toISOString()
      .replace(/[^0-9]/g, "")
      .slice(0, -3)
    const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64")

    // Format phone number (remove leading 0 or +254, add 254)
    let formattedPhone = phoneNumber.replace(/^(\+254|254|0)/, "")
    formattedPhone = `254${formattedPhone}`

    // Initiate STK Push
    const stkPushResponse = await fetch("https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.round(amount),
        PartyA: formattedPhone,
        PartyB: shortcode,
        PhoneNumber: formattedPhone,
        CallBackURL: callbackUrl,
        AccountReference: orderId,
        TransactionDesc: `Payment for order ${orderId}`,
      }),
    })

    const stkPushData = await stkPushResponse.json()

    if (stkPushData.ResponseCode === "0") {
      // Update order with checkout request ID
      const supabase = await createClient()
      await supabase
        .from("orders")
        .update({
          payment_reference: stkPushData.CheckoutRequestID,
          payment_status: "pending",
        })
        .eq("id", orderId)

      return NextResponse.json({
        success: true,
        checkoutRequestId: stkPushData.CheckoutRequestID,
        message: "STK Push sent successfully",
      })
    }

    return NextResponse.json(
      {
        success: false,
        error: stkPushData.errorMessage || "Failed to initiate payment",
      },
      { status: 400 },
    )
  } catch (error) {
    console.error("[v0] M-Pesa STK Push error:", error)
    return NextResponse.json({ error: "Failed to process payment" }, { status: 500 })
  }
}
