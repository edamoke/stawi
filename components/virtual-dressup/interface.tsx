"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Upload, Loader2, Sparkles, Check, ArrowRight, ChevronLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Product {
  id: string
  name: string
  image_url: string | null
  categories: { name: string } | null
}

interface BodyType {
  id: string
  name: string
  description: string
  thumbnail_url: string
  prompt_modifier: string
}

interface Props {
  products: Product[]
  bodyTypes: BodyType[]
  userId?: string
}

export function VirtualDressUpInterface({ products, bodyTypes, userId }: Props) {
  const router = useRouter()
  const [selectedBodyType, setSelectedBodyType] = useState<string | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null)
  const [selectedAccessory, setSelectedAccessory] = useState<string>("")
  const [selectedTop, setSelectedTop] = useState<string>("")
  const [selectedBottom, setSelectedBottom] = useState<string>("")
  const [selectedDress, setSelectedDress] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [resultImage, setResultImage] = useState<string | null>(null)

  const bagProducts = products.filter(
    (p) => p.categories?.name.toLowerCase().includes("bag") || p.categories?.name.toLowerCase().includes("tote"),
  )
  const shoeProducts = products.filter(
    (p) => p.categories?.name.toLowerCase().includes("shoe") || p.categories?.name.toLowerCase().includes("footwear"),
  )
  const jewelleryProducts = products.filter(
    (p) =>
      p.categories?.name.toLowerCase().includes("jewel") ||
      p.categories?.name.toLowerCase().includes("earring") ||
      p.categories?.name.toLowerCase().includes("necklace"),
  )
  const topProducts = products.filter(
    (p) =>
      p.categories?.name.toLowerCase().includes("top") ||
      p.categories?.name.toLowerCase().includes("bralette") ||
      p.categories?.name.toLowerCase().includes("shirt") ||
      p.categories?.name.toLowerCase().includes("vest"),
  )
  const bottomProducts = products.filter(
    (p) =>
      p.categories?.name.toLowerCase().includes("bottom") ||
      p.categories?.name.toLowerCase().includes("trouser") ||
      p.categories?.name.toLowerCase().includes("pant") ||
      p.categories?.name.toLowerCase().includes("skirt"),
  )
  const dressProducts = products.filter(
    (p) => p.categories?.name.toLowerCase().includes("dress") || p.categories?.name.toLowerCase().includes("gown"),
  )

  const getProductsForCategory = (categoryId: string, subCategoryId?: string | null) => {
    if (categoryId === "accessories" && subCategoryId) {
      switch (subCategoryId) {
        case "bags":
          return bagProducts
        case "shoes":
          return shoeProducts
        case "jewellery":
          return jewelleryProducts
        default:
          return []
      }
    }
    switch (categoryId) {
      case "accessories":
        return [...bagProducts, ...shoeProducts, ...jewelleryProducts]
      case "tops":
        return topProducts
      case "bottoms":
        return bottomProducts
      case "dress":
        return dressProducts
      default:
        return []
    }
  }

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setSelectedSubCategory(null)
  }

  const handleSubCategoryClick = (subCategoryId: string) => {
    setSelectedSubCategory(subCategoryId)
  }

  const handleProductSelect = (productId: string) => {
    if (!selectedCategory) return
    switch (selectedCategory) {
      case "accessories":
        setSelectedAccessory(productId)
        break
      case "tops":
        setSelectedTop(productId)
        break
      case "bottoms":
        setSelectedBottom(productId)
        break
      case "dress":
        setSelectedDress(productId)
        break
    }
    setSelectedCategory(null)
    setSelectedSubCategory(null)
  }

  const handleGenerate = async () => {
    if (!uploadedImage || !selectedBodyType) {
      alert("Please upload a photo and select a body type")
      return
    }
    if (!selectedAccessory && !selectedTop && !selectedBottom && !selectedDress) {
      alert("Please select at least one clothing item")
      return
    }
    if (!userId) {
      router.push("/auth/login")
      return
    }
    setIsProcessing(true)
    try {
      const response = await fetch("/api/virtual-tryon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userImage: uploadedImage,
          bodyType: selectedBodyType,
          selectedItems: {
            accessory: selectedAccessory,
            top: selectedTop,
            bottom: selectedBottom,
            dress: selectedDress,
          },
        }),
      })
      const data = await response.json()
      if (data.success) setResultImage(data.resultImage)
      else alert(data.error || "Failed to generate try-on")
    } catch (error) {
      console.error("Virtual try-on error:", error)
      alert("An error occurred while generating your try-on")
    } finally {
      setIsProcessing(false)
    }
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => setUploadedImage(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const bodyTypeSilhouettes = [
    { id: "petite", name: "Petite" },
    { id: "athletic", name: "Athletic" },
    { id: "slim", name: "Slim" },
    { id: "hourglass", name: "Hourglass" },
    { id: "curvy", name: "Curvy" },
    { id: "plus", name: "Plus Size" },
  ]

  const categoryCards = [
    {
      id: "accessories",
      name: "Accessories",
      productName: "London Canvas Tote",
      image: "/red-canvas-tote-bag-fashion.jpg",
      hasSubcategories: true,
      subcategories: [
        { id: "bags", name: "Bags" },
        { id: "shoes", name: "Shoes" },
        { id: "jewellery", name: "Jewellery" },
      ],
    },
    {
      id: "tops",
      name: "Tops",
      productName: "Ayra Cotton Bralette",
      image: "/white-cotton-bralette-fashion-model.jpg",
      hasSubcategories: false,
    },
    {
      id: "bottoms",
      name: "Bottoms",
      productName: "Noore Parachute Trousers",
      image: "/white-parachute-trousers-beach-model.jpg",
      hasSubcategories: false,
    },
    {
      id: "dress",
      name: "Dress",
      productName: "Elegant Summer Dress",
      image: "/elegant-tiered-white-dress-terracotta-building-fas.jpg",
      hasSubcategories: false,
    },
  ]

  const selectedItems = [
    selectedTop && { type: "Top", id: selectedTop },
    selectedBottom && { type: "Bottom", id: selectedBottom },
    selectedDress && { type: "Dress", id: selectedDress },
    selectedAccessory && { type: "Accessory", id: selectedAccessory },
  ].filter(Boolean)

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-12">
        {/* Left Column - Upload & Body Type */}
        <div className="space-y-8">
          {/* Step 1: Upload */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E8E4DE]">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full bg-[#C9A86C] text-white flex items-center justify-center text-sm font-medium">
                1
              </div>
              <h2 className="text-xl font-serif text-[#2C2420]">Upload Your Photo</h2>
            </div>

            <div
              className={`border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 ${uploadedImage ? "border-[#C9A86C] bg-[#C9A86C]/5" : "border-[#E8E4DE] hover:border-[#C9A86C]/50"}`}
            >
              {uploadedImage ? (
                <div className="space-y-4">
                  <div className="relative w-32 h-32 mx-auto rounded-xl overflow-hidden">
                    <img
                      src={uploadedImage || "/placeholder.svg"}
                      alt="Uploaded"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Check className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <Label htmlFor="image-upload" className="cursor-pointer">
                    <span className="text-sm text-[#C9A86C] hover:underline">Change Photo</span>
                  </Label>
                </div>
              ) : (
                <Label htmlFor="image-upload" className="cursor-pointer block">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#FAF8F5] flex items-center justify-center">
                    <Upload className="w-7 h-7 text-[#C9A86C]" />
                  </div>
                  <p className="text-[#C9A86C] font-medium mb-1">Click to upload your photo</p>
                  <p className="text-xs text-[#6B6560]">PNG, JPG up to 10MB</p>
                </Label>
              )}
              <Input id="image-upload" type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </div>
          </div>

          {/* Step 2: Body Type */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E8E4DE]">
            <div className="flex items-center gap-3 mb-6">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${uploadedImage ? "bg-[#C9A86C] text-white" : "bg-[#E8E4DE] text-[#6B6560]"}`}
              >
                2
              </div>
              <h2 className="text-xl font-serif text-[#2C2420]">Select Body Type</h2>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {bodyTypeSilhouettes.map((body) => (
                <button
                  key={body.id}
                  onClick={() => setSelectedBodyType(body.id)}
                  className={`relative border-2 rounded-xl p-4 transition-all duration-300 ${
                    selectedBodyType === body.id
                      ? "border-[#C9A86C] bg-[#C9A86C]/5"
                      : "border-[#E8E4DE] hover:border-[#C9A86C]/50"
                  }`}
                >
                  {selectedBodyType === body.id && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#C9A86C] flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                  <div className="aspect-[3/4] flex items-center justify-center mb-2">
                    <svg viewBox="0 0 60 100" className="w-full h-full max-h-16">
                      {body.id === "petite" && (
                        <>
                          <circle cx="30" cy="12" r="8" fill="#C9A86C" />
                          <path
                            d="M30 20 L25 22 L22 45 L20 48 L22 50 L22 95 L28 95 L28 55 L32 55 L32 95 L38 95 L38 50 L40 48 L38 45 L35 22 Z"
                            fill="#C9A86C"
                          />
                        </>
                      )}
                      {body.id === "athletic" && (
                        <>
                          <circle cx="30" cy="12" r="8" fill="#C9A86C" />
                          <path
                            d="M30 20 L22 24 L18 45 L16 50 L20 52 L20 95 L28 95 L28 55 L32 55 L32 95 L40 95 L40 52 L44 50 L42 45 L38 24 Z"
                            fill="#C9A86C"
                          />
                        </>
                      )}
                      {body.id === "slim" && (
                        <>
                          <circle cx="30" cy="12" r="8" fill="#C9A86C" />
                          <path
                            d="M30 20 L24 23 L21 45 L19 50 L22 52 L21 95 L28 95 L28 54 L32 54 L32 95 L39 95 L38 52 L41 50 L39 45 L36 23 Z"
                            fill="#C9A86C"
                          />
                        </>
                      )}
                      {body.id === "hourglass" && (
                        <>
                          <circle cx="30" cy="12" r="8" fill="#C9A86C" />
                          <path
                            d="M30 20 L20 26 L17 40 L22 48 L17 55 L15 95 L27 95 L28 58 L32 58 L33 95 L45 95 L43 55 L38 48 L43 40 L40 26 Z"
                            fill="#C9A86C"
                          />
                        </>
                      )}
                      {body.id === "curvy" && (
                        <>
                          <circle cx="30" cy="12" r="9" fill="#C9A86C" />
                          <path
                            d="M30 21 L18 28 L14 42 L18 52 L12 60 L10 95 L26 95 L27 62 L33 62 L34 95 L50 95 L48 60 L42 52 L46 42 L42 28 Z"
                            fill="#C9A86C"
                          />
                        </>
                      )}
                      {body.id === "plus" && (
                        <>
                          <circle cx="30" cy="12" r="10" fill="#C9A86C" />
                          <path
                            d="M30 22 L15 30 L10 45 L14 55 L8 65 L5 95 L25 95 L26 68 L34 68 L35 95 L55 95 L52 65 L46 55 L50 45 L45 30 Z"
                            fill="#C9A86C"
                          />
                        </>
                      )}
                    </svg>
                  </div>
                  <p className="text-xs font-medium text-center text-[#2C2420]">{body.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Selected Items Summary */}
          {selectedItems.length > 0 && (
            <div className="bg-[#2C2420] rounded-2xl p-6 text-white">
              <h3 className="text-sm font-medium mb-4 tracking-wide">YOUR SELECTIONS</h3>
              <div className="space-y-2">
                {selectedItems.map((item: any, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-white/60">{item.type}</span>
                    <span className="text-[#C9A86C]">{products.find((p) => p.id === item.id)?.name || "Selected"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Clothing Selection */}
        <div className="space-y-8">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-[#E8E4DE]">
            <div className="flex items-center gap-3 mb-6">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${selectedBodyType ? "bg-[#C9A86C] text-white" : "bg-[#E8E4DE] text-[#6B6560]"}`}
              >
                3
              </div>
              <h2 className="text-xl font-serif text-[#2C2420]">Choose Clothing</h2>
            </div>

            {/* Category Grid */}
            <div className="grid grid-cols-2 gap-4">
              {categoryCards.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`text-left rounded-xl overflow-hidden border-2 transition-all duration-300 group ${
                    selectedCategory === category.id
                      ? "border-[#C9A86C]"
                      : "border-transparent hover:border-[#C9A86C]/50"
                  }`}
                >
                  <div className="aspect-square relative overflow-hidden">
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-xs text-[#C9A86C] font-medium tracking-wider">{category.name}</p>
                      <p className="text-sm font-medium text-white truncate">{category.productName}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Accessories Subcategories */}
            {selectedCategory === "accessories" && !selectedSubCategory && (
              <div className="mt-6 p-6 bg-[#FAF8F5] rounded-xl">
                <Label className="text-sm font-medium mb-4 block text-[#2C2420]">Select Accessory Type</Label>
                <div className="grid grid-cols-3 gap-3">
                  {categoryCards
                    .find((c) => c.id === "accessories")
                    ?.subcategories?.map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => handleSubCategoryClick(sub.id)}
                        className="px-4 py-4 bg-white border-2 border-[#E8E4DE] rounded-xl hover:border-[#C9A86C] hover:bg-[#C9A86C]/5 transition-all text-sm font-medium text-[#2C2420]"
                      >
                        {sub.name}
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Product Selection Dropdown */}
            {selectedCategory && (selectedCategory !== "accessories" || selectedSubCategory) && (
              <div className="mt-6 p-6 bg-[#FAF8F5] rounded-xl">
                <div className="flex items-center justify-between mb-4">
                  <Label className="text-sm font-medium text-[#2C2420]">
                    Select{" "}
                    {selectedSubCategory
                      ? selectedSubCategory.charAt(0).toUpperCase() + selectedSubCategory.slice(1)
                      : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
                  </Label>
                  {selectedSubCategory && (
                    <button
                      onClick={() => setSelectedSubCategory(null)}
                      className="text-xs text-[#C9A86C] flex items-center gap-1 hover:underline"
                    >
                      <ChevronLeft className="w-3 h-3" /> Back
                    </button>
                  )}
                </div>
                <Select onValueChange={handleProductSelect}>
                  <SelectTrigger className="bg-white border-[#E8E4DE]">
                    <SelectValue placeholder={`Choose ${selectedSubCategory || selectedCategory}...`} />
                  </SelectTrigger>
                  <SelectContent>
                    {getProductsForCategory(selectedCategory, selectedSubCategory).map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerate}
            disabled={isProcessing || !uploadedImage || !selectedBodyType}
            className="w-full py-7 bg-[#C9A86C] hover:bg-[#B8975B] text-white text-sm tracking-[0.15em] font-medium rounded-xl transition-all duration-300 disabled:opacity-50 group"
            size="lg"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                GENERATING YOUR LOOK...
              </>
            ) : (
              <>
                <Sparkles className="mr-3 h-5 w-5" />
                GENERATE VIRTUAL TRY-ON
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>

          {/* Result */}
          {resultImage && (
            <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-[#E8E4DE]">
              <img src={resultImage || "/placeholder.svg"} alt="Try-on result" className="w-full" />
              <div className="p-6 space-y-3">
                <Button className="w-full bg-[#2C2420] hover:bg-[#1a1614] text-white py-6">
                  Add Selected Items to Cart
                </Button>
                <Button
                  variant="outline"
                  className="w-full py-6 border-[#E8E4DE] bg-transparent"
                  onClick={() => setResultImage(null)}
                >
                  Try Different Items
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
