import { requireAdmin } from "@/lib/auth"
import { ContentSectionForm } from "@/components/admin/cms/content-section-form"

export default async function NewContentSectionPage() {
  await requireAdmin()

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Content Section</h1>
        <p className="text-muted-foreground mt-2">Add a new flexible content section to your homepage</p>
      </div>

      <ContentSectionForm />
    </div>
  )
}
