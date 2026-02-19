"use server"

import { createClient } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function createProduct(formData: FormData) {
  await requireAdmin()
  const supabase = await createClient()

  const productData = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    description: formData.get("description") as string,
    price: Number.parseFloat(formData.get("price") as string),
    compare_at_price: formData.get("compare_at_price")
      ? Number.parseFloat(formData.get("compare_at_price") as string)
      : null,
    cost_per_item: formData.get("cost_per_item") ? Number.parseFloat(formData.get("cost_per_item") as string) : null,
    category_id: formData.get("category_id") as string,
    stock: Number.parseInt(formData.get("stock") as string),
    sku: formData.get("sku") as string,
    barcode: formData.get("barcode") as string,
    weight: formData.get("weight") ? Number.parseFloat(formData.get("weight") as string) : null,
    dimensions: formData.get("dimensions") as string,
    image_url: formData.get("image_url") as string,
    gallery_images: formData.get("gallery_images") ? JSON.parse(formData.get("gallery_images") as string) : [],
    is_active: formData.get("is_active") === "true",
    seo_title: formData.get("seo_title") as string,
    seo_description: formData.get("seo_description") as string,
  }

  const { data, error } = await supabase.from("products").insert(productData).select().single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/products")
  return { success: true, data }
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin()
  const supabase = await createClient()

  const productData = {
    name: formData.get("name") as string,
    slug: formData.get("slug") as string,
    description: formData.get("description") as string,
    price: Number.parseFloat(formData.get("price") as string),
    compare_at_price: formData.get("compare_at_price")
      ? Number.parseFloat(formData.get("compare_at_price") as string)
      : null,
    cost_per_item: formData.get("cost_per_item") ? Number.parseFloat(formData.get("cost_per_item") as string) : null,
    category_id: formData.get("category_id") as string,
    stock: Number.parseInt(formData.get("stock") as string),
    sku: formData.get("sku") as string,
    barcode: formData.get("barcode") as string,
    weight: formData.get("weight") ? Number.parseFloat(formData.get("weight") as string) : null,
    dimensions: formData.get("dimensions") as string,
    image_url: formData.get("image_url") as string,
    gallery_images: formData.get("gallery_images") ? JSON.parse(formData.get("gallery_images") as string) : [],
    is_active: formData.get("is_active") === "true",
    seo_title: formData.get("seo_title") as string,
    seo_description: formData.get("seo_description") as string,
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase.from("products").update(productData).eq("id", id).select().single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/products")
  revalidatePath(`/admin/products/${id}`)
  return { success: true, data }
}

export async function deleteProduct(id: string) {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase.from("products").delete().eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/products")
  return { success: true }
}
