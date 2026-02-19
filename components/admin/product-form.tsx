"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { uploadImage } from "@/lib/supabase/storage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { X, ImageIcon, Package, DollarSign, Layers, AlertCircle } from "lucide-react"
import { ImageUpload } from "./image-upload"

interface Category {
  id: string
  name: string
  slug: string
}

interface Product {
  id?: string
  name: string
  slug: string
  description: string | null
  price: number
  category_id: string | null
  image_url: string | null
  images: string[] | null
  stock: number
  is_active: boolean
}

interface ProductFormProps {
  product?: Product
  categories: Category[]
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("basic")

  const [formData, setFormData] = useState({
    name: product?.name || "",
    slug: product?.slug || "",
    description: product?.description || "",
    price: product?.price || 0,
    category_id: product?.category_id || "",
    image_url: product?.image_url || "",
    images: product?.images || [],
    stock: product?.stock || 0,
    is_active: product?.is_active ?? true,
  })

  const [additionalImages, setAdditionalImages] = useState<string[]>(product?.images || [])

  const handleMainImageUpload = async (file: File): Promise<string> => {
    const url = await uploadImage("products", file)
    setFormData({ ...formData, image_url: url })
    return url
  }

  const handleGalleryImageUpload = async (file: File): Promise<string> => {
    const url = await uploadImage("products", file)
    setAdditionalImages([...additionalImages, url])
    return url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const supabase = createClient()

    const dataToSave = {
      ...formData,
      images: additionalImages,
      category_id: formData.category_id || null,
    }

    try {
      if (product?.id) {
        const { error } = await supabase.from("products").update(dataToSave).eq("id", product.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from("products").insert([dataToSave])
        if (error) throw error
      }

      router.push("/admin/products")
      router.refresh()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const removeImage = (index: number) => {
    setAdditionalImages(additionalImages.filter((_, i) => i !== index))
  }

  const getStockStatus = () => {
    if (formData.stock === 0) return { label: "Out of Stock", color: "destructive" }
    if (formData.stock <= 10) return { label: "Low Stock", color: "warning" }
    return { label: "In Stock", color: "default" }
  }

  const stockStatus = getStockStatus()

  return (
    <form onSubmit={handleSubmit}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Basic Info
          </TabsTrigger>
          <TabsTrigger value="media" className="flex items-center gap-2">
            <ImageIcon className="h-4 w-4" />
            Media
          </TabsTrigger>
          <TabsTrigger value="pricing" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Pricing
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Inventory
          </TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter the basic details about your product</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    required
                    placeholder="e.g., Ankara Print Dress"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData({ ...formData, name: e.target.value, slug: generateSlug(e.target.value) })
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug *</Label>
                  <Input
                    id="slug"
                    required
                    placeholder="ankara-print-dress"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">URL: /products/{formData.slug || "product-slug"}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={5}
                  placeholder="Describe your product in detail..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="is_active">Product Status</Label>
                  <p className="text-sm text-muted-foreground">
                    {formData.is_active ? "Product is visible to customers" : "Product is hidden from customers"}
                  </p>
                </div>
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Media Tab */}
        <TabsContent value="media">
          <Card>
            <CardHeader>
              <CardTitle>Product Images</CardTitle>
              <CardDescription>Upload images to showcase your product</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Main Product Image</Label>
                <ImageUpload
                  onUpload={handleMainImageUpload}
                  currentImage={formData.image_url}
                  label="Upload Main Image"
                />
              </div>

              <div className="space-y-2">
                <Label>Additional Images (Gallery)</Label>
                <ImageUpload onUpload={handleGalleryImageUpload} label="Add to Gallery" />

                {additionalImages.length > 0 && (
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    {additionalImages.map((url, index) => (
                      <div key={index} className="relative aspect-square border rounded-lg overflow-hidden">
                        <img
                          src={url || "/placeholder.svg"}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing Tab */}
        <TabsContent value="pricing">
          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
              <CardDescription>Set the price for your product</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="price">Price (KSh) *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">KSh</span>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      className="pl-12"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Price Preview</Label>
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold">KSh {formData.price.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">~${(formData.price / 130).toFixed(2)} USD</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Management</CardTitle>
              <CardDescription>Track and manage your product stock</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Quantity *</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number.parseInt(e.target.value) || 0 })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Stock Status</Label>
                  <div className="p-4 border rounded-lg">
                    <Badge variant={stockStatus.color as "default" | "destructive" | "secondary"}>
                      {stockStatus.label}
                    </Badge>
                    <p className="mt-2 text-sm text-muted-foreground">{formData.stock} units available</p>
                  </div>
                </div>
              </div>

              {formData.stock <= 10 && formData.stock > 0 && (
                <div className="flex items-center gap-2 p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800">
                  <AlertCircle className="h-5 w-5" />
                  <p className="text-sm">Low stock warning: Consider restocking this product soon.</p>
                </div>
              )}

              {formData.stock === 0 && (
                <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                  <AlertCircle className="h-5 w-5" />
                  <p className="text-sm">This product is out of stock and will not be available for purchase.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-4 mt-6 bg-red-50 border border-red-200 rounded-lg text-red-800">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex items-center justify-between mt-6 pt-6 border-t">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <div className="flex gap-2">
          {product && (
            <Button type="button" variant="outline" onClick={() => router.push(`/products/${formData.slug}`)}>
              View Product
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : product ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </div>
    </form>
  )
}
