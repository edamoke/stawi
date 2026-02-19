"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { createBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Image from "next/image"

type SocialFeedItem = {
  id: string
  image_url: string
  caption: string | null
  link_url: string | null
  display_order: number
  is_active: boolean
}

export function SocialFeedList({ items }: { items: SocialFeedItem[] }) {
  const router = useRouter()
  const supabase = createBrowserClient()
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return

    setDeleting(id)
    const { error } = await supabase.from("social_feed").delete().eq("id", id)

    if (error) {
      alert("Error deleting post: " + error.message)
    } else {
      router.refresh()
    }
    setDeleting(null)
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from("social_feed").update({ is_active: !currentStatus }).eq("id", id)

    if (error) {
      alert("Error updating post: " + error.message)
    } else {
      router.refresh()
    }
  }

  if (items.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">No social posts yet</p>
          <Button asChild>
            <Link href="/admin/cms/social-feed/new">Add your first post</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Card key={item.id}>
          <CardContent className="p-4 space-y-3">
            <div className="relative aspect-square">
              <Image
                src={item.image_url || "/placeholder.svg"}
                alt={item.caption || "Social post"}
                fill
                className="object-cover rounded"
              />
              <div className="absolute top-2 right-2">
                <Badge variant={item.is_active ? "default" : "secondary"}>
                  {item.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
            {item.caption && <p className="text-sm line-clamp-2">{item.caption}</p>}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Order: {item.display_order}</span>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" onClick={() => handleToggleActive(item.id, item.is_active)}>
                  {item.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)} disabled={deleting === item.id}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
