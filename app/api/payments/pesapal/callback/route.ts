import { NextRequest, NextResponse } from "next/server";
import { getPesapalAuthToken, getPesapalTransactionStatus } from "@/lib/pesapal";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || "";
  const { searchParams } = new URL(req.url);
  const orderTrackingId = searchParams.get("OrderTrackingId");
  const merchantReference = searchParams.get("OrderMerchantReference");

  if (!orderTrackingId || !merchantReference) {
    return NextResponse.redirect(`${appUrl}/checkout?error=Missing tracking information`);
  }

  try {
    const token = await getPesapalAuthToken();
    const status = await getPesapalTransactionStatus(token, orderTrackingId);
    const supabase = await createClient();

    // Check both ways: prefix OR query db to find registration
    let isEvent = merchantReference.startsWith("EVT-");
    let actualId = isEvent ? merchantReference.replace("EVT-", "") : merchantReference;
    
    // Fallback check: if no prefix, see if it exists in event_registrations
    if (!isEvent) {
      const { data: reg } = await supabase.from("event_registrations").select("id").eq("id", merchantReference).single();
      if (reg) {
        isEvent = true;
      }
    }

    const table = isEvent ? "event_registrations" : "orders";

    if (status.status_code === 1) { // 1 is SUCCESS for Pesapal V3
      await supabase
        .from(table)
        .update({ 
            payment_status: "completed",
            ...(isEvent ? { status: "registered" } : { status: "processing" })
        })
        .eq("id", actualId);

      const successUrl = isEvent 
        ? `${appUrl}/checkout/success?type=event&registrationId=${actualId}`
        : `${appUrl}/checkout/success?orderId=${actualId}`;

      return NextResponse.redirect(successUrl);
    } else {
      // Payment failed or is pending
      let errorRedirect = `${appUrl}/checkout?error=Payment status: ${status.payment_status_description}`;
      
      if (isEvent) {
        // Try to get event ID for redirection
        const { data: regData } = await supabase.from("event_registrations").select("event_id").eq("id", actualId).single();
        if (regData) {
          errorRedirect = `${appUrl}/checkout/event?eventId=${regData.event_id}&error=Payment status: ${status.payment_status_description}`;
        }
      }

      return NextResponse.redirect(errorRedirect);
    }
  } catch (error: any) {
    console.error("Pesapal callback error:", error);
    return NextResponse.redirect(`${appUrl}/checkout?error=An error occurred during payment verification`);
  }
}
