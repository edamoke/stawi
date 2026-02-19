"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function getSiteSettings(key: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", key)
    .single()

  if (error) {
    console.error(`Error fetching setting ${key}:`, error)
    return null
  }

  return data.value
}

export async function updateSiteSettings(key: string, value: any) {
  const supabase = await createClient()
  const { error } = await supabase
    .from("site_settings")
    .update({ value, updated_at: new Date().toISOString() })
    .eq("key", key)

  if (error) {
    console.error(`Error updating setting ${key}:`, error)
    throw new Error(error.message)
  }

  revalidatePath("/admin/settings")
  return { success: true }
}
