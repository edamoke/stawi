"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { uploadImage } from "@/lib/supabase/storage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AlertCircle, Loader2 } from "lucide-react"
import { ImageUpload } from "./image-upload"

interface HeroSlide {
  id?: string
  image_url: string
  alt: string
  heading: string
  subheading: string
  description: string | null
  position: number
  active: boolean
}

interface HeroSlideFormProps {
  slide?: HeroSlide
}

export function HeroSlideForm({ slide }: HeroSlideFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    image_url: slide?.image_url || "",
    alt: slide?.alt || "",
    heading: slide?.heading || "",
    subheading: slide?.subheading || "",
    description: slide?.description || "",
    position: slide?.position || 1,
    active: slide?.active ?? true,
  })

  const handleImageUpload = async (file: File): Promise<string> => {
    const url = await uploadImage("hero", file)
    setFormData({ ...formData, image_url: url })
    return url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    try {
      if (slide?.id) {
        const { error } = await supabase.from("hero_slides").update(formData).eq("id", slide.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("hero_slides").insert([formData])
        if (error) throw error
      }

      router.push("/admin/hero-slides")
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Slide Image</CardTitle>
          <CardDescription>Upload an image for the hero slider (recommended: 1920x1080px)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ImageUpload onUpload={handleImageUpload} currentImage={formData.image_url} label="Upload Slider Image" />

          <div className="space-y-2">
            <Label htmlFor="alt">Image Alt Text *</Label>
            <Input
              id="alt"
              required
              placeholder="e.g., Black and White Sling Bag"
              value={formData.alt}
              onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Slide Content</CardTitle>
          <CardDescription>Add text captions that will appear over the image</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="heading">Main Heading *</Label>
              <Input
                id="heading"
                required
                placeholder="e.g., Black & White"
                value={formData.heading}
                onChange={(e) => setFormData({ ...formData, heading: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subheading">Subheading *</Label>
              <Input
                id="subheading"
                required
                placeholder="e.g., Sling Bag"
                value={formData.subheading}
                onChange={(e) => setFormData({ ...formData, subheading: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              rows={3}
              placeholder="e.g., Elegant two-tone design perfect for everyday elegance"
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Slide Settings</CardTitle>
          <CardDescription>Configure display order and visibility</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="position">Display Order</Label>
            <Input
              id="position"
              type="number"
              min="1"
              value={formData.position}
              onChange={(e) => setFormData({ ...formData, position: Number.parseInt(e.target.value) || 1 })}
            />
            <p className="text-xs text-muted-foreground">Lower numbers appear first in the slider</p>
          </div>

          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="active">Slide Status</Label>
              <p className="text-sm text-muted-foreground">
                {formData.active ? "Slide is visible in hero section" : "Slide is hidden"}
              </p>
            </div>
            <Switch
              id="active"
              checked={formData.active}
              onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
            />
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="flex items-center justify-between pt-6 border-t">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : slide ? (
            "Update Slide"
          ) : (
            "Create Slide"
          )}
        </Button>
      </div>
    </form>
  )
}
