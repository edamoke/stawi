"use server"

import { createClient } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function updateOrderStatus(orderId: string, status: string) {
  await requireAdmin()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("orders")
    .update({
      status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/orders")
  return { success: true, data }
}

export async function updatePaymentStatus(orderId: string, paymentStatus: string) {
  await requireAdmin()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("orders")
    .update({
      payment_status: paymentStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/orders")
  return { success: true, data }
}
