"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, GripVertical } from "lucide-react"
import Image from "next/image"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

type Product = {
  id: string
  name: string
  price: number
  image_url: string | null
}

type FeaturedProduct = {
  id: string
  product_id: string
  position: number
  is_active: boolean
  products: Product
}

export function FeaturedProductsManager({
  featuredProducts,
  availableProducts,
}: {
  featuredProducts: FeaturedProduct[]
  availableProducts: Product[]
}) {
  const router = useRouter()
  const supabase = createBrowserClient()
  const [selectedProduct, setSelectedProduct] = useState("")
  const [adding, setAdding] = useState(false)

  const handleAdd = async () => {
    if (!selectedProduct) return

    setAdding(true)
    const { error } = await supabase.from("featured_products").insert({
      product_id: selectedProduct,
      position: featuredProducts.length,
      is_active: true,
    })

    if (error) {
      alert("Error adding product: " + error.message)
    } else {
      setSelectedProduct("")
      router.refresh()
    }
    setAdding(false)
  }

  const handleRemove = async (id: string) => {
    const { error } = await supabase.from("featured_products").delete().eq("id", id)

    if (error) {
      alert("Error removing product: " + error.message)
    } else {
      router.refresh()
    }
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase.from("featured_products").update({ is_active: !currentStatus }).eq("id", id)

    if (error) {
      alert("Error updating product: " + error.message)
    } else {
      router.refresh()
    }
  }

  const featuredProductIds = featuredProducts.map((fp) => fp.product_id)
  const availableToAdd = availableProducts.filter((p) => !featuredProductIds.includes(p.id))

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add Featured Product</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Select value={selectedProduct} onValueChange={setSelectedProduct}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Select a product" />
              </SelectTrigger>
              <SelectContent>
                {availableToAdd.map((product) => (
                  <SelectItem key={product.id} value={product.id}>
                    {product.name} - ${product.price}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleAdd} disabled={!selectedProduct || adding}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Featured Products ({featuredProducts.length})</h3>

        {featuredProducts.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <p className="text-muted-foreground">No featured products yet</p>
            </CardContent>
          </Card>
        ) : (
          featuredProducts.map((item) => (
            <Card key={item.id}>
              <CardContent className="flex items-center gap-4 p-4">
                <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
                {item.products.image_url && (
                  <Image
                    src={item.products.image_url || "/placeholder.svg"}
                    alt={item.products.name}
                    width={80}
                    height={80}
                    className="rounded object-cover"
                  />
                )}
                <div className="flex-1">
                  <h4 className="font-semibold">{item.products.name}</h4>
                  <p className="text-sm text-muted-foreground">${item.products.price}</p>
                </div>
                <Badge variant={item.is_active ? "default" : "secondary"}>
                  {item.is_active ? "Active" : "Inactive"}
                </Badge>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleToggleActive(item.id, item.is_active)}>
                    {item.is_active ? "Hide" : "Show"}
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleRemove(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
