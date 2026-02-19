import { requireAdmin } from "@/lib/auth"
import { SocialFeedForm } from "@/components/admin/cms/social-feed-form"

export default async function NewSocialFeedPage() {
  await requireAdmin()

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add Social Post</h1>
        <p className="text-muted-foreground mt-2">Add a new post to your social feed</p>
      </div>

      <SocialFeedForm />
    </div>
  )
}
