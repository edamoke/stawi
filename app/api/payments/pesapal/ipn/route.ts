import { NextRequest, NextResponse } from "next/server";
import { getPesapalAuthToken, getPesapalTransactionStatus } from "@/lib/pesapal";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const orderTrackingId = searchParams.get("OrderTrackingId");
  const merchantReference = searchParams.get("OrderMerchantReference");
  const notificationType = searchParams.get("OrderNotificationType");

  if (notificationType !== "IPNCHANGE") {
      return NextResponse.json({ success: true });
  }

  try {
    const token = await getPesapalAuthToken();
    const status = await getPesapalTransactionStatus(token, orderTrackingId!);
    const supabase = await createClient();

    // Check both ways: prefix OR query db to find registration
    let isEvent = merchantReference?.startsWith("EVT-") || false;
    let actualId = isEvent ? merchantReference!.replace("EVT-", "") : merchantReference!;
    
    // Fallback check: if no prefix, see if it exists in event_registrations
    if (!isEvent && merchantReference) {
      const { data: reg } = await supabase.from("event_registrations").select("id").eq("id", merchantReference).single();
      if (reg) {
        isEvent = true;
        actualId = merchantReference;
      }
    }

    const table = isEvent ? "event_registrations" : "orders";

    if (status.status_code === 1) {
      await supabase
        .from(table)
        .update({ 
            payment_status: "completed",
            ...(isEvent ? { status: "registered" } : { status: "processing" })
        })
        .eq("id", actualId);
    } else if (status.status_code === 0) {
        // Still pending
    } else {
        await supabase
        .from(table)
        .update({ 
            payment_status: "failed"
        })
        .eq("id", actualId);
    }

    return NextResponse.json({ 
        orderTrackingId, 
        merchantReference, 
        status: "received" 
    });
  } catch (error: any) {
    console.error("Pesapal IPN error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
