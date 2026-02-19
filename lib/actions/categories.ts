"use server"

import { createClient } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function createCategory(formData: FormData) {
  await requireAdmin()
  const supabase = await createClient()

  const categoryData = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    description: formData.get("description") as string,
    image_url: formData.get("image_url") as string,
    parent_id: formData.get("parent_id") as string | null,
  }

  const { data, error } = await supabase.from("categories").insert(categoryData).select().single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/categories")
  return { success: true, data }
}

export async function updateCategory(id: string, formData: FormData) {
  await requireAdmin()
  const supabase = await createClient()

  const categoryData = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    description: formData.get("description") as string,
    image_url: formData.get("image_url") as string,
    parent_id: formData.get("parent_id") as string | null,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase.from("categories").update(categoryData).eq("id", id).select().single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/categories")
  return { success: true, data }
}

export async function deleteCategory(id: string) {
  await requireAdmin()
  const supabase = await createClient()

  // Check if category has products
  const { data: products } = await supabase.from("products").select("id").eq("category_id", id).limit(1)

  if (products && products.length > 0) {
    return { error: "Cannot delete category with products. Please reassign or delete products first." }
  }

  const { error } = await supabase.from("categories").delete().eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/categories")
  return { success: true }
}
