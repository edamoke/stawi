"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { ImageUpload } from "@/components/admin/image-upload"
import { uploadImage } from "@/lib/supabase/storage"

type SocialFeedItem = {
  id?: string
  image_url: string
  caption: string
  link_url: string
  display_order: number
  is_active: boolean
}

export function SocialFeedForm({ item }: { item?: SocialFeedItem }) {
  const router = useRouter()
  const supabase = createBrowserClient()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<SocialFeedItem>({
    image_url: item?.image_url || "",
    caption: item?.caption || "",
    link_url: item?.link_url || "",
    display_order: item?.display_order || 0,
    is_active: item?.is_active ?? true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (item?.id) {
        const { error } = await supabase.from("social_feed").update(formData).eq("id", item.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("social_feed").insert(formData)

        if (error) throw error
      }

      router.push("/admin/cms/social-feed")
      router.refresh()
    } catch (error: any) {
      alert("Error saving post: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Post Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image_url">Image *</Label>
            <ImageUpload
              currentImage={formData.image_url}
              onUpload={async (file) => {
                const url = await uploadImage("socialFeed", file)
                setFormData({ ...formData, image_url: url })
                return url
              }}
              label="Social Feed Image"
            />
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="/images/post.jpg or https://..."
              required
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground">Upload an image or enter URL directly above</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="caption">Caption</Label>
            <Textarea
              id="caption"
              value={formData.caption}
              onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
              placeholder="Post caption or description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="link_url">Link URL</Label>
            <Input
              id="link_url"
              value={formData.link_url}
              onChange={(e) => setFormData({ ...formData, link_url: e.target.value })}
              placeholder="https://instagram.com/..."
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="display_order">Display Order</Label>
              <Input
                id="display_order"
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: Number.parseInt(e.target.value) })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : item ? "Update Post" : "Create Post"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  )
}
