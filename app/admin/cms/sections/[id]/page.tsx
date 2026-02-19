import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { ContentSectionForm } from "@/components/admin/cms/content-section-form"
import { notFound, redirect } from "next/navigation"

function isValidUUID(str: string) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(str)
}

export default async function EditContentSectionPage({
  params,
}: {
  params: { id: string }
}) {
  await requireAdmin()

  if (params.id === "new" || !isValidUUID(params.id)) {
    redirect("/admin/cms/sections/new")
  }

  const supabase = await createClient()

  const { data: section } = await supabase
    .from("content_sections")
    .select("*, content_blocks(*)")
    .eq("id", params.id)
    .single()

  if (!section) {
    notFound()
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Content Section</h1>
        <p className="text-muted-foreground mt-2">Update section details and content blocks</p>
      </div>

      <ContentSectionForm section={section} />
    </div>
  )
}
