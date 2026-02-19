import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Plus, Edit, Trash2, ImageIcon } from "lucide-react"

export default async function HeroSlidesPage() {
  await requireAdmin()
  const supabase = await createClient()

  const { data: slides, error } = await supabase.from("hero_slides").select("*").order("position", { ascending: true })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Hero Slider</h1>
          <p className="text-muted-foreground">Manage homepage hero section images and captions</p>
        </div>
        <Button asChild>
          <Link href="/admin/hero-slides/new">
            <Plus className="w-4 h-4 mr-2" />
            Add New Slide
          </Link>
        </Button>
      </div>

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-800">Error loading slides: {error.message}</p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {slides && slides.length > 0 ? (
          slides.map((slide: any) => (
            <Card key={slide.id}>
              <CardContent className="p-6">
                <div className="flex items-center gap-6">
                  <div className="relative w-48 h-32 rounded-lg overflow-hidden bg-muted">
                    {slide.image_url ? (
                      <img
                        src={slide.image_url || "/placeholder.svg"}
                        alt={slide.alt}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">{slide.heading}</h3>
                      <Badge variant={slide.is_active ? "default" : "secondary"}>
                        {slide.is_active ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline">Order: {slide.position}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground italic mb-1">{slide.subheading}</p>
                    <p className="text-sm text-muted-foreground">{slide.description}</p>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/hero-slides/${slide.id}`}>
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Link>
                    </Button>
                    <form action={`/admin/hero-slides/${slide.id}/delete`} method="POST">
                      <Button variant="destructive" size="sm" type="submit">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </form>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <ImageIcon className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No hero slides yet</h3>
              <p className="text-sm text-muted-foreground mb-4">Create your first hero slide to get started</p>
              <Button asChild>
                <Link href="/admin/hero-slides/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Slide
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
