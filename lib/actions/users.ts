"use server"

import { createClient } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function updateUserRole(userId: string, isAdmin: boolean) {
  await requireAdmin()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("profiles")
    .update({
      is_admin: isAdmin,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/users")
  return { success: true, data }
}

export async function deleteUser(userId: string) {
  await requireAdmin()
  const supabase = await createClient()

  // Delete user's profile (cascading will handle related records)
  const { error } = await supabase.from("profiles").delete().eq("id", userId)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/users")
  return { success: true }
}

export async function toggleUserSuspension(userId: string, isSuspended: boolean) {
  await requireAdmin()
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("profiles")
    .update({
      is_suspended: isSuspended,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/users")
  return { success: true, data }
}
