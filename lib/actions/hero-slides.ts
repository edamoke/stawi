"use server"

import { createClient } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/auth"
import { revalidatePath } from "next/cache"

export async function createHeroSlide(formData: FormData) {
  await requireAdmin()
  const supabase = await createClient()

  const slideData = {
    title: formData.get("title") as string,
    subtitle: formData.get("subtitle") as string,
    image_url: formData.get("image_url") as string,
    cta_text: formData.get("cta_text") as string,
    cta_link: formData.get("cta_link") as string,
    display_order: Number.parseInt(formData.get("display_order") as string) || 0,
    is_active: formData.get("is_active") === "true",
  }

  const { data, error } = await supabase.from("hero_slides").insert(slideData).select().single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/hero-slides")
  revalidatePath("/")
  return { success: true, data }
}

export async function updateHeroSlide(id: string, formData: FormData) {
  await requireAdmin()
  const supabase = await createClient()

  const slideData = {
    title: formData.get("title") as string,
    subtitle: formData.get("subtitle") as string,
    image_url: formData.get("image_url") as string,
    cta_text: formData.get("cta_text") as string,
    cta_link: formData.get("cta_link") as string,
    display_order: Number.parseInt(formData.get("display_order") as string) || 0,
    is_active: formData.get("is_active") === "true",
    updated_at: new Date().toISOString(),
  }

  const { data, error } = await supabase.from("hero_slides").update(slideData).eq("id", id).select().single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/hero-slides")
  revalidatePath("/")
  return { success: true, data }
}

export async function deleteHeroSlide(id: string) {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase.from("hero_slides").delete().eq("id", id)

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/admin/hero-slides")
  revalidatePath("/")
  return { success: true }
}

export async function reorderHeroSlides(slides: { id: string; display_order: number }[]) {
  await requireAdmin()
  const supabase = await createClient()

  const updates = slides.map((slide) =>
    supabase.from("hero_slides").update({ display_order: slide.display_order }).eq("id", slide.id),
  )

  await Promise.all(updates)

  revalidatePath("/admin/hero-slides")
  revalidatePath("/")
  return { success: true }
}
