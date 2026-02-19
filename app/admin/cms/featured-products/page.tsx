import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { FeaturedProductsManager } from "@/components/admin/cms/featured-products-manager"

export default async function FeaturedProductsPage() {
  await requireAdmin()
  const supabase = await createClient()

  const [{ data: featured }, { data: allProducts }] = await Promise.all([
    supabase.from("featured_products").select("*, products(*)").order("position", { ascending: true }),
    supabase.from("products").select("id, name, price, image_url, published").eq("published", true).order("name"),
  ])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Featured Products</h1>
        <p className="text-muted-foreground mt-2">Select products to feature on your homepage bestsellers section</p>
      </div>

      <FeaturedProductsManager featuredProducts={featured || []} availableProducts={allProducts || []} />
    </div>
  )
}
