"use server"

import { createClient } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function updateStock(productId: string, stock: number) {
  await requireAdmin()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("products")
    .update({
      stock,
      updated_at: new Date().toISOString(),
    })
    .eq("id", productId)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/inventory")
  revalidatePath("/admin/products")
  return { success: true, data }
}

export async function bulkUpdateStock(updates: { id: string; stock: number }[]) {
  await requireAdmin()
  const supabase = await createClient()

  const promises = updates.map((update) =>
    supabase
      .from("products")
      .update({
        stock: update.stock,
        updated_at: new Date().toISOString(),
      })
      .eq("id", update.id),
  )

  const results = await Promise.all(promises)
  const errors = results.filter((r) => r.error)

  if (errors.length > 0) {
    return { error: `${errors.length} updates failed` }
  }

  revalidatePath("/admin/inventory")
  revalidatePath("/admin/products")
  return { success: true }
}
