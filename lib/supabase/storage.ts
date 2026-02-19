"use client"

import { createClient } from "@/lib/supabase/client"

const STORAGE_BUCKETS = {
  products: "products",
  hero: "hero-slides",
  content: "content",
  socialFeed: "social-feed",
  events: "events",
}

export async function uploadImage(
  bucket: "products" | "hero" | "content" | "socialFeed" | "events",
  file: File,
): Promise<string> {
  const supabase = createClient() // Remove await - createClient is not async
  const fileName = `${Date.now()}-${file.name}`

  const { data, error } = await supabase.storage.from(STORAGE_BUCKETS[bucket]).upload(fileName, file, {
    cacheControl: "3600",
    upsert: false,
  })

  if (error) {
    throw new Error(`Upload failed: ${error.message}`)
  }

  const { data: urlData } = supabase.storage.from(STORAGE_BUCKETS[bucket]).getPublicUrl(data.path)

  return urlData.publicUrl
}

export async function deleteImage(
  bucket: "products" | "hero" | "content" | "socialFeed" | "events",
  filePath: string,
): Promise<void> {
  const supabase = createClient() // Remove await - createClient is not async
  const fileName = filePath.split("/").pop()

  if (!fileName) {
    throw new Error("Invalid file path")
  }

  const { error } = await supabase.storage.from(STORAGE_BUCKETS[bucket]).remove([fileName])

  if (error) {
    throw new Error(`Delete failed: ${error.message}`)
  }
}
