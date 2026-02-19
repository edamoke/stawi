"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Eye, EyeOff, GripVertical } from "lucide-react"
import Link from "next/link"
import { createBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

type ContentSection = {
  id: string
  section_key: string
  section_type: string
  title: string | null
  subtitle: string | null
  display_order: number
  is_active: boolean
  content_blocks?: any[]
}

export function ContentSectionsList({ sections }: { sections: ContentSection[] }) {
  const router = useRouter()
  const supabase = createBrowserClient()
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this section?")) return

    setDeleting(id)
    const { error } = await supabase.from("content_sections").delete().eq("id", id)

    if (error) {
      alert("Error deleting section: " + error.message)
    } else {
      router.refresh()
    }
    setDeleting(null)
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from("content_sections").update({ is_active: !currentStatus }).eq("id", id)

    if (error) {
      alert("Error updating section: " + error.message)
    } else {
      router.refresh()
    }
  }

  if (sections.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <p className="text-muted-foreground mb-4">No content sections yet</p>
          <Button asChild>
            <Link href="/admin/cms/sections/new">Create your first section</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {sections.map((section) => (
        <Card key={section.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-3">
              <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
              <div>
                <CardTitle className="text-lg">{section.title || "Untitled Section"}</CardTitle>
                {section.subtitle && <p className="text-sm text-muted-foreground mt-1">{section.subtitle}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={section.is_active ? "default" : "secondary"}>
                {section.is_active ? "Active" : "Inactive"}
              </Badge>
              <Badge variant="outline">{section.section_type}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {section.content_blocks?.length || 0} content blocks • Order: {section.display_order}
              </p>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => handleToggleActive(section.id, section.is_active)}>
                  {section.is_active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/admin/cms/sections/${section.id}`}>
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(section.id)}
                  disabled={deleting === section.id}
                >
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
