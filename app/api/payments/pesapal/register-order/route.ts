import { NextRequest, NextResponse } from "next/server";
import { getPesapalAuthToken, submitPesapalOrder, registerPesapalIPN } from "@/lib/pesapal";
import { getSiteSettings, updateSiteSettings } from "@/lib/actions/settings";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  console.log("Pesapal register-order started v10");
  try {
    const supabase = await createClient();
    
    // Use service role or bypass auth for order check to ensure it works in production
    const { amount, orderId, billingDetails, type = "product" } = await req.json();
    console.log("Request body:", { amount, orderId, billingDetails, type });

    if (!orderId) {
        return NextResponse.json({ success: false, error: "Order ID is required" }, { status: 400 });
    }

    let totalAmount = amount;
    let description = `Payment for Order ${orderId}`;

    if (type === "event") {
      // Verify event registration exists
      const { data: registration, error: regError } = await supabase
        .from("event_registrations")
        .select("*, events(title)")
        .eq("id", orderId)
        .single();

      if (regError || !registration) {
        console.error("Registration fetch error:", regError);
        return NextResponse.json({ success: false, error: "Event registration not found" }, { status: 404 });
      }
      totalAmount = totalAmount || registration.payment_amount;
      description = `Ticket for ${registration.events?.title || 'Event'}`;
      console.log("Found registration, amount:", totalAmount);
    } else {
      // Verify order exists
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("id", orderId)
        .single();

      if (orderError || !order) {
        console.error("Order fetch error:", orderError);
        return NextResponse.json({ success: false, error: "Order not found" }, { status: 404 });
      }
      totalAmount = totalAmount || order.total_amount;
      console.log("Found order, amount:", totalAmount);
    }

    // Get Pesapal Auth Token
    let token;
    try {
        token = await getPesapalAuthToken();
        console.log("Got Pesapal Token (first 10 chars):", token.substring(0, 10));
    } catch (authErr: any) {
        console.error("Pesapal Auth Error:", authErr.message);
        return NextResponse.json({ success: false, error: `Auth Error: ${authErr.message}` }, { status: 500 });
    }

    // Get IPN ID
    const settings = await getSiteSettings("pesapal_settings");
    let ipnId = settings?.ipn_id || "2bcc3954-3acc-4715-bf4d-dab92684d0f5";
    console.log("Using IPN ID:", ipnId);

    const appUrl = "https://www.sulhaafrika.com";
    const callbackUrl = `${appUrl}/api/payments/pesapal/callback`;

    // Phone formatting
    let phone = billingDetails?.phone || "";
    phone = phone.replace(/\D/g, "");
    if (phone.startsWith("0")) {
      phone = "254" + phone.substring(1);
    } else if (phone.length === 9) {
      phone = "254" + phone;
    }
    if (!phone) phone = "254700000000";

    const orderData = {
      id: orderId,
      currency: "KES",
      amount: totalAmount,
      description: description,
      callback_url: callbackUrl,
      notification_id: ipnId,
      billing_address: {
        email_address: billingDetails?.email || "guest@sulhaafrika.com",
        phone_number: phone,
        country_code: "KE",
        first_name: (billingDetails?.firstName || "Guest").substring(0, 30),
        last_name: (billingDetails?.lastName || "User").substring(0, 30),
        line_1: (billingDetails?.address || "N/A").substring(0, 50),
        city: (billingDetails?.city || "Nairobi").substring(0, 30),
      },
    };

    console.log("Submitting order payload:", JSON.stringify(orderData, null, 2));

    try {
        const pesapalResponse = await submitPesapalOrder(token, orderData);
        console.log("Pesapal raw response:", JSON.stringify(pesapalResponse, null, 2));

        if (pesapalResponse && pesapalResponse.redirect_url) {
            // Update appropriate table based on type
            if (type === "event") {
              await supabase
                .from("event_registrations")
                .update({ 
                    pesapal_tracking_id: pesapalResponse.order_tracking_id 
                })
                .eq("id", orderId);
            } else {
              await supabase
                .from("orders")
                .update({ 
                    pesapal_tracking_id: pesapalResponse.order_tracking_id,
                    payment_method: "pesapal" 
                })
                .eq("id", orderId);
            }

            return NextResponse.json({ 
                success: true, 
                redirectUrl: pesapalResponse.redirect_url,
                orderTrackingId: pesapalResponse.order_tracking_id 
            });
        } else {
            console.error("Pesapal returned no redirect URL:", pesapalResponse);
            return NextResponse.json({ 
                success: false, 
                error: "Pesapal did not return a payment link. " + JSON.stringify(pesapalResponse)
            }, { status: 500 });
        }
    } catch (submitErr: any) {
        console.error("Order submission execution error:", submitErr);
        return NextResponse.json({ success: false, error: `Submission Error: ${submitErr.message}` }, { status: 500 });
    }
  } catch (error: any) {
    console.error("Top level API error:", error);
    return NextResponse.json({ success: false, error: `Server Error: ${error.message}` }, { status: 500 });
  }
}
