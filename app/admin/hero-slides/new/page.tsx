import { requireAdmin } from "@/lib/auth"
import { HeroSlideForm } from "@/components/admin/hero-slide-form"

export default async function NewHeroSlidePage() {
  await requireAdmin()

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add New Hero Slide</h1>
        <p className="text-muted-foreground">Create a new slide for the homepage hero section</p>
      </div>

      <HeroSlideForm />
    </div>
  )
}
