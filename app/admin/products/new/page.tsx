import { requireAdmin } from "@/lib/auth"
import { ProductForm } from "@/components/admin/product-form"
import { createClient } from "@/lib/supabase/server"

export default async function NewProductPage() {
  await requireAdmin()
  const supabase = await createClient()

  const { data: categories } = await supabase.from("categories").select("*").order("name")

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Add New Product</h1>
        <p className="text-muted-foreground">Create a new product in your inventory</p>
      </div>

      <ProductForm categories={categories || []} />
    </div>
  )
}
