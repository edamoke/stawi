import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { LayoutGrid, Star, Instagram, Sliders, MapPin } from "lucide-react"

export default async function CMSPage() {
  await requireAdmin()
  const supabase = await createClient()

  // Get counts for each section
  const [sectionsResult, blocksResult, productsResult, socialResult, heroResult, citiesResult] = await Promise.all([
    supabase.from("content_sections").select("*", { count: "exact", head: true }),
    supabase.from("content_blocks").select("*", { count: "exact", head: true }),
    supabase.from("featured_products").select("*", { count: "exact", head: true }),
    supabase.from("social_feed").select("*", { count: "exact", head: true }),
    supabase.from("hero_slides").select("*", { count: "exact", head: true }),
    supabase.from("cities").select("*", { count: "exact", head: true }),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Content Management System</h1>
        <p className="text-muted-foreground mt-2">
          Manage all homepage content including hero slider, sections, featured products, and social feed
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Hero Slider */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hero Slider</CardTitle>
            <Sliders className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{heroResult.count || 0}</div>
            <p className="text-xs text-muted-foreground mb-4">Active slides</p>
            <Button asChild className="w-full">
              <Link href="/admin/hero-slides">Manage Hero Slides</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Content Sections */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Sections</CardTitle>
            <LayoutGrid className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sectionsResult.count || 0}</div>
            <p className="text-xs text-muted-foreground mb-4">
              Flexible grid sections with {blocksResult.count || 0} blocks
            </p>
            <Button asChild className="w-full">
              <Link href="/admin/cms/sections">Manage Sections</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Featured Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Featured Products</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productsResult.count || 0}</div>
            <p className="text-xs text-muted-foreground mb-4">Featured on homepage</p>
            <Button asChild className="w-full">
              <Link href="/admin/cms/featured-products">Manage Featured</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Social Feed */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Social Feed</CardTitle>
            <Instagram className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{socialResult.count || 0}</div>
            <p className="text-xs text-muted-foreground mb-4">Social media posts</p>
            <Button asChild className="w-full">
              <Link href="/admin/cms/social-feed">Manage Social Feed</Link>
            </Button>
          </CardContent>
        </Card>

        {/* City Sensations */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">City Sensations</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{citiesResult.count || 0}</div>
            <p className="text-xs text-muted-foreground mb-4">Cultural city experiences</p>
            <Button asChild className="w-full">
              <Link href="/admin/cms/cities">Manage Cities</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Tips</CardTitle>
          <CardDescription>Get the most out of your CMS</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm">
            <strong>Hero Slider:</strong> Manage your homepage banner images and call-to-action buttons
          </p>
          <p className="text-sm">
            <strong>Content Sections:</strong> Create flexible grid layouts with 1-4 columns per row
          </p>
          <p className="text-sm">
            <strong>Featured Products:</strong> Highlight your best-selling products on the homepage
          </p>
          <p className="text-sm">
            <strong>Social Feed:</strong> Display Instagram-style social media content
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
