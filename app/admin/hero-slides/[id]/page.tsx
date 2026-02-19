import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { HeroSlideForm } from "@/components/admin/hero-slide-form"
import { notFound } from "next/navigation"

export default async function EditHeroSlidePage({ params }: { params: { id: string } }) {
  await requireAdmin()
  const supabase = await createClient()

  const { data: slide, error } = await supabase.from("hero_slides").select("*").eq("id", params.id).single()

  if (error || !slide) {
    notFound()
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Hero Slide</h1>
        <p className="text-muted-foreground">Update hero slide content and images</p>
      </div>

      <HeroSlideForm slide={slide} />
    </div>
  )
}
