import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { ContentSectionsList } from "@/components/admin/cms/content-sections-list"

export default async function ContentSectionsPage() {
  await requireAdmin()
  const supabase = await createClient()

  const { data: sections } = await supabase
    .from("content_sections")
    .select("*, content_blocks(*)")
    .order("display_order", { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Content Sections</h1>
          <p className="text-muted-foreground mt-2">Create and manage flexible grid sections for your homepage</p>
        </div>
        <Button asChild>
          <Link href="/admin/cms/sections/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Section
          </Link>
        </Button>
      </div>

      <ContentSectionsList sections={sections || []} />
    </div>
  )
}
