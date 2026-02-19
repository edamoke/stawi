import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { SocialFeedList } from "@/components/admin/cms/social-feed-list"

export default async function SocialFeedPage() {
  await requireAdmin()
  const supabase = await createClient()

  const { data: feedItems } = await supabase.from("social_feed").select("*").order("display_order", { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Social Feed</h1>
          <p className="text-muted-foreground mt-2">Manage social media posts displayed on your homepage</p>
        </div>
        <Button asChild>
          <Link href="/admin/cms/social-feed/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Post
          </Link>
        </Button>
      </div>

      <SocialFeedList items={feedItems || []} />
    </div>
  )
}
