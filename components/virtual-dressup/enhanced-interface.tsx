"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  Heart,
  ShoppingBag,
  Sparkles,
  Check,
  X,
  RotateCcw,
  Share2,
  Download,
  Loader2,
  Wand2,
  Camera,
  ChevronRight,
  Facebook,
  Twitter,
  Link2,
  Mail,
  MessageCircle,
  Upload,
  User,
  Shirt,
} from "lucide-react"
import { useCart } from "@/context/cart-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Badge } from "@/components/ui/badge"

interface Product {
  id: string
  name: string
  slug: string
  price: number
  image_url: string
  categories?: { name: string; slug: string }
  colors?: string[]
  occasions?: string[]
}

interface BodyType {
  id: string
  name: string
  slug?: string
  description?: string
  thumbnail_url?: string
  prompt_modifier?: string
  sort_order?: number
}

interface CuratedLook {
  id: string
  name: string
  occasion: string
  description: string
  image: string
  items: string[]
  totalPrice: number
}

interface EnhancedDressUpInterfaceProps {
  products: Product[]
  bodyTypes: BodyType[]
  userId?: string
  curatedLooks: CuratedLook[]
}

const occasions = ["All", "Beach", "Evening", "Casual", "Resort", "Wedding Guest", "Vacation"]

const categories = [
  { id: "all", name: "All Items", slug: "all" },
  { id: "dresses", name: "Dresses", slug: "dresses" },
  { id: "tops", name: "Tops", slug: "tops" },
  { id: "bottoms", name: "Bottoms", slug: "bottoms" },
  { id: "co-ords", name: "Co-ords", slug: "co-ords" },
  { id: "outerwear", name: "Outerwear", slug: "outerwear" },
  { id: "resort-wear", name: "Resort Wear", slug: "resort-wear" },
  { id: "bags", name: "Bags", slug: "bags" },
  { id: "jewellery", name: "Jewellery", slug: "jewellery" },
  { id: "shoes", name: "Shoes", slug: "shoes" },
]

const bodyTypeSilhouettes: Record<string, React.ReactNode> = {
  "1": ( // Petite
    <svg viewBox="0 0 60 100" className="w-full h-full">
      <circle cx="30" cy="12" r="8" fill="currentColor" />
      <path
        d="M30 20 L25 22 L22 45 L20 48 L22 50 L22 95 L28 95 L28 55 L32 55 L32 95 L38 95 L38 50 L40 48 L38 45 L35 22 Z"
        fill="currentColor"
      />
    </svg>
  ),
  "2": ( // Athletic
    <svg viewBox="0 0 60 100" className="w-full h-full">
      <circle cx="30" cy="12" r="8" fill="currentColor" />
      <path
        d="M30 20 L22 24 L18 45 L16 50 L20 52 L20 95 L28 95 L28 55 L32 55 L32 95 L40 95 L40 52 L44 50 L42 45 L38 24 Z"
        fill="currentColor"
      />
    </svg>
  ),
  "3": ( // Slim
    <svg viewBox="0 0 60 100" className="w-full h-full">
      <circle cx="30" cy="12" r="8" fill="currentColor" />
      <path
        d="M30 20 L24 23 L21 45 L19 50 L22 52 L21 95 L28 95 L28 54 L32 54 L32 95 L39 95 L38 52 L41 50 L39 45 L36 23 Z"
        fill="currentColor"
      />
    </svg>
  ),
  "4": ( // Hourglass
    <svg viewBox="0 0 60 100" className="w-full h-full">
      <circle cx="30" cy="12" r="8" fill="currentColor" />
      <path
        d="M30 20 L20 26 L17 40 L22 48 L17 55 L15 95 L27 95 L28 58 L32 58 L33 95 L45 95 L43 55 L38 48 L43 40 L40 26 Z"
        fill="currentColor"
      />
    </svg>
  ),
  "5": ( // Curvy
    <svg viewBox="0 0 60 100" className="w-full h-full">
      <circle cx="30" cy="12" r="9" fill="currentColor" />
      <path
        d="M30 21 L18 28 L14 42 L18 52 L12 60 L10 95 L26 95 L27 62 L33 62 L34 95 L50 95 L48 60 L42 52 L46 42 L42 28 Z"
        fill="currentColor"
      />
    </svg>
  ),
  "6": ( // Plus Size
    <svg viewBox="0 0 60 100" className="w-full h-full">
      <circle cx="30" cy="12" r="10" fill="currentColor" />
      <path
        d="M30 22 L15 30 L10 45 L14 55 L8 65 L5 95 L25 95 L26 68 L34 68 L35 95 L55 95 L52 65 L46 55 L50 45 L45 30 Z"
        fill="currentColor"
      />
    </svg>
  ),
}

export function EnhancedDressUpInterface({ products, bodyTypes, userId, curatedLooks }: EnhancedDressUpInterfaceProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const resultImageRef = useRef<HTMLImageElement>(null)
  const { addItem, openCart } = useCart()
  const { toast } = useToast()

  // State
  const [activeTab, setActiveTab] = useState("build")
  const [selectedBodyType, setSelectedBodyType] = useState<string | null>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedOccasion, setSelectedOccasion] = useState("All")
  const [isProcessing, setIsProcessing] = useState(false)
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [showAISuggestions, setShowAISuggestions] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([])
  const [isLoadingAI, setIsLoadingAI] = useState(false)
  const [savedLooks, setSavedLooks] = useState<string[]>([])
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  // Outfit builder state
  const [selectedOutfit, setSelectedOutfit] = useState<{
    dress?: Product
    top?: Product
    bottom?: Product
    outerwear?: Product
    accessory?: Product
    shoes?: Product
    jewellery?: Product
    bag?: Product
    "resort-wear"?: Product
    "co-ords"?: Product
  }>({})

  const formatPrice = (price: number) => `KSh ${price.toLocaleString()}`

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const getCategoryKey = (product: Product): keyof typeof selectedOutfit => {
    const categorySlug = product.categories?.slug || ""
    if (categorySlug === "dresses") return "dress"
    if (categorySlug === "tops") return "top"
    if (categorySlug === "bottoms") return "bottom"
    if (categorySlug === "outerwear") return "outerwear"
    if (categorySlug === "bags") return "bag"
    if (categorySlug === "jewellery") return "jewellery"
    if (categorySlug === "shoes") return "shoes"
    if (categorySlug === "resort-wear") return "resort-wear"
    if (categorySlug === "co-ords") return "co-ords"
    return "accessory"
  }

  const handleSelectProduct = (product: Product) => {
    const key = getCategoryKey(product)
    setSelectedOutfit((prev) => {
      if (prev[key]?.id === product.id) {
        const newOutfit = { ...prev }
        delete newOutfit[key]
        return newOutfit
      }
      return { ...prev, [key]: product }
    })
  }

  const isProductSelected = (product: Product) => {
    const key = getCategoryKey(product)
    return selectedOutfit[key]?.id === product.id
  }

  const getSelectedItemsCount = () => Object.keys(selectedOutfit).length

  const getTotalPrice = () => Object.values(selectedOutfit).reduce((sum, item) => sum + (item?.price || 0), 0)

  const filteredProducts = products.filter((product) => {
    const categoryMatch = selectedCategory === "all" || product.categories?.slug === selectedCategory
    const occasionMatch =
      selectedOccasion === "All" || product.occasions?.some((o) => o.toLowerCase() === selectedOccasion.toLowerCase())
    return categoryMatch && occasionMatch
  })

  const handleGetAISuggestions = async () => {
    setIsLoadingAI(true)
    setShowAISuggestions(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const suggestions = products
      .filter((p) => !Object.values(selectedOutfit).some((item) => item?.id === p.id))
      .slice(0, 4)
      .map((p) => p.id)
    setAiSuggestions(suggestions)
    setIsLoadingAI(false)
  }

  const handleGenerate = async () => {
    if (!uploadedImage || !selectedBodyType) {
      toast({
        title: "Missing Information",
        description: "Please upload a photo and select a body type",
        variant: "destructive",
      })
      return
    }
    if (getSelectedItemsCount() === 0) {
      toast({
        title: "No Items Selected",
        description: "Please select at least one clothing item",
        variant: "destructive",
      })
      return
    }
    setIsProcessing(true)
    setResultImage(null)

    try {
      console.log("[v0] Starting virtual try-on generation...")
      console.log("[v0] Body type:", selectedBodyType)
      console.log("[v0] Selected items:", Object.keys(selectedOutfit))

      const response = await fetch("/api/virtual-tryon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userImage: uploadedImage,
          bodyType: selectedBodyType,
          selectedItems: selectedOutfit,
        }),
      })

      const data = await response.json()
      console.log("[v0] API response:", data.success, data.error || "no error")

      if (data.success) {
        setResultImage(data.resultImage)
        toast({
          title: data.isFallback ? "Style Preview Ready" : "Try-On Generated!",
          description: data.isFallback
            ? "AI styling preview created. Full virtual try-on requires image generation."
            : "Your virtual try-on is ready. Save or share your look!",
        })
      } else {
        toast({
          title: "Generation Failed",
          description: data.error || "Failed to generate try-on",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Virtual try-on error:", error)
      toast({
        title: "Error",
        description: "An error occurred while generating your try-on",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSaveLook = (lookId: string) => {
    setSavedLooks((prev) => (prev.includes(lookId) ? prev.filter((id) => id !== lookId) : [...prev, lookId]))
    toast({
      title: savedLooks.includes(lookId) ? "Removed from Favorites" : "Added to Favorites",
      description: savedLooks.includes(lookId)
        ? "Look removed from your saved collection"
        : "Look saved to your collection",
    })
  }

  const handleApplyCuratedLook = (look: CuratedLook) => {
    const newOutfit: typeof selectedOutfit = {}
    look.items.forEach((itemId) => {
      const product = products.find((p) => p.id === itemId)
      if (product) {
        const key = getCategoryKey(product)
        newOutfit[key] = product
      }
    })
    setSelectedOutfit(newOutfit)
    setActiveTab("build") // Switch to build tab to show selected items
    toast({
      title: "Look Applied!",
      description: `"${look.name}" outfit has been selected. Go to Virtual Try-On to see how it looks on you!`,
    })
  }

  const handleAddAllToCart = () => {
    const items = Object.values(selectedOutfit).filter(Boolean) as Product[]
    if (items.length === 0) {
      toast({
        title: "No Items Selected",
        description: "Please select items to add to your bag",
        variant: "destructive",
      })
      return
    }

    items.forEach((item) => {
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: 1,
        image_url: item.image_url,
        slug: item.slug,
        category: item.categories?.name,
      })
    })

    toast({
      title: "Added to Bag",
      description: `${items.length} item${items.length > 1 ? "s" : ""} added to your bag`,
    })
    openCart()
  }

  const handleAddSingleToCart = (product: Product) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image_url: product.image_url,
      slug: product.slug,
      category: product.categories?.name,
    })
    toast({
      title: "Added to Bag",
      description: `${product.name} added to your bag`,
    })
  }

  const handleDownloadImage = async () => {
    if (!resultImage) return

    setIsDownloading(true)
    try {
      if (resultImage.startsWith("data:") || resultImage.startsWith("blob:")) {
        const link = document.createElement("a")
        link.href = resultImage
        link.download = `trevor-virtual-tryon-${Date.now()}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      } else {
        const response = await fetch(resultImage)
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `trevor-virtual-tryon-${Date.now()}.png`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
      }

      toast({
        title: "Image Downloaded",
        description: "Your virtual try-on image has been saved",
      })
    } catch (error) {
      console.error("Download error:", error)
      toast({
        title: "Download Failed",
        description: "Could not download the image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  const handleShare = (platform: string) => {
    const shareText = "Check out my virtual try-on from TREVOR Kenya! ✨"
    const shareUrlBase = typeof window !== "undefined" ? window.location.origin : ""
    const currentUrl = `${shareUrlBase}/dress-up`

    let shareLink = ""

    switch (platform) {
      case "facebook":
        shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}&quote=${encodeURIComponent(shareText)}`
        break
      case "twitter":
        shareLink = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`
        break
      case "whatsapp":
        shareLink = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${currentUrl}`)}`
        break
      case "email":
        shareLink = `mailto:?subject=${encodeURIComponent("My TREVOR Virtual Try-On")}&body=${encodeURIComponent(`${shareText}\n\n${currentUrl}`)}`
        break
      case "copy":
        navigator.clipboard.writeText(currentUrl)
        toast({
          title: "Link Copied",
          description: "Share link has been copied to your clipboard",
        })
        setShowShareDialog(false)
        return
    }

    if (shareLink) {
      window.open(shareLink, "_blank", "width=600,height=400")
      setShowShareDialog(false)
    }
  }

  const getLookItems = (look: CuratedLook) => {
    return look.items.map((id) => products.find((p) => p.id === id)).filter(Boolean) as Product[]
  }

  return (
    <div className="space-y-8">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-white rounded-xl p-1.5 h-auto shadow-sm">
          <TabsTrigger
            value="build"
            className="py-3.5 text-sm font-medium data-[state=active]:bg-[#C9A86C] data-[state=active]:text-white rounded-lg transition-all"
          >
            <Shirt className="w-4 h-4 mr-2" />
            Build Outfit
          </TabsTrigger>
          <TabsTrigger
            value="curated"
            className="py-3.5 text-sm font-medium data-[state=active]:bg-[#C9A86C] data-[state=active]:text-white rounded-lg transition-all"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Curated Looks
          </TabsTrigger>
          <TabsTrigger
            value="tryon"
            className="py-3.5 text-sm font-medium data-[state=active]:bg-[#C9A86C] data-[state=active]:text-white rounded-lg transition-all"
          >
            <Camera className="w-4 h-4 mr-2" />
            Virtual Try-On
          </TabsTrigger>
        </TabsList>

        {/* BUILD OUTFIT TAB */}
        <TabsContent value="build" className="mt-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Product Selection */}
            <div className="lg:col-span-2 space-y-6">
              {/* Occasion Filter */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {occasions.map((occasion) => (
                  <Button
                    key={occasion}
                    variant={selectedOccasion === occasion ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedOccasion(occasion)}
                    className={
                      selectedOccasion === occasion
                        ? "bg-[#C9A86C] hover:bg-[#B8975B] text-white whitespace-nowrap"
                        : "bg-white whitespace-nowrap border-[#E8E4DE]"
                    }
                  >
                    {occasion}
                  </Button>
                ))}
              </div>

              {/* Category Tabs */}
              <ScrollArea className="w-full">
                <div className="flex gap-2 pb-2">
                  {categories.map((cat) => (
                    <Button
                      key={cat.id}
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedCategory(cat.slug)}
                      className={`whitespace-nowrap ${
                        selectedCategory === cat.slug
                          ? "bg-[#2C2420] text-white hover:bg-[#2C2420]"
                          : "hover:bg-[#FAF8F5]"
                      }`}
                    >
                      {cat.name}
                    </Button>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>

              {/* Products Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className={`group cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                      isProductSelected(product)
                        ? "border-[#C9A86C] shadow-lg"
                        : "border-transparent hover:border-[#E8E4DE]"
                    }`}
                    onClick={() => handleSelectProduct(product)}
                  >
                    <div className="relative aspect-[3/4] bg-[#FAF8F5]">
                      <Image
                        src={product.image_url || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                      {isProductSelected(product) && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-[#C9A86C] rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleAddSingleToCart(product)
                        }}
                        className="absolute bottom-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-[#C9A86C] hover:text-white"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="p-3 bg-white">
                      <h4 className="text-sm font-medium text-[#2C2420] truncate">{product.name}</h4>
                      <p className="text-sm text-[#C9A86C]">{formatPrice(product.price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Outfit Summary Sidebar */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-serif text-lg text-[#2C2420]">Your Outfit</h3>
                  <Badge variant="secondary" className="bg-[#C9A86C]/10 text-[#C9A86C]">
                    {getSelectedItemsCount()} items
                  </Badge>
                </div>

                {getSelectedItemsCount() === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-[#FAF8F5] flex items-center justify-center mx-auto mb-4">
                      <Shirt className="w-8 h-8 text-[#C9A86C]" />
                    </div>
                    <p className="text-sm text-[#6B6560]">Select items to build your outfit</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {Object.entries(selectedOutfit).map(([key, item]) =>
                      item ? (
                        <div key={key} className="flex items-center gap-3 p-2 rounded-lg bg-[#FAF8F5]">
                          <div className="relative w-14 h-18 rounded-lg overflow-hidden bg-white flex-shrink-0">
                            <Image
                              src={item.image_url || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-[#8B8178] capitalize">{key.replace("-", " ")}</p>
                            <h4 className="text-sm text-[#2C2420] truncate">{item.name}</h4>
                            <p className="text-sm font-medium text-[#C9A86C]">{formatPrice(item.price)}</p>
                          </div>
                          <button
                            onClick={() => handleSelectProduct(item)}
                            className="p-1.5 hover:bg-white rounded-full transition-colors"
                          >
                            <X className="w-4 h-4 text-[#8B8178]" />
                          </button>
                        </div>
                      ) : null,
                    )}

                    <div className="border-t border-[#E8E4DE] pt-4 mt-4">
                      <div className="flex justify-between mb-4">
                        <span className="text-[#6B6560]">Total</span>
                        <span className="font-serif text-xl text-[#2C2420]">{formatPrice(getTotalPrice())}</span>
                      </div>

                      <Button
                        onClick={handleGetAISuggestions}
                        variant="outline"
                        className="w-full mb-3 bg-transparent border-[#C9A86C] text-[#C9A86C] hover:bg-[#C9A86C]/5"
                        disabled={isLoadingAI}
                      >
                        {isLoadingAI ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <Wand2 className="w-4 h-4 mr-2" />
                        )}
                        Complete This Look
                      </Button>

                      <Button
                        onClick={() => setActiveTab("tryon")}
                        variant="outline"
                        className="w-full mb-3 bg-transparent"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Try On This Outfit
                      </Button>

                      <Button
                        onClick={handleAddAllToCart}
                        className="w-full py-6 bg-[#C9A86C] hover:bg-[#B8975B] text-white"
                      >
                        <ShoppingBag className="w-4 h-4 mr-2" />
                        Add All to Bag
                      </Button>
                    </div>
                  </div>
                )}

                {/* AI Suggestions */}
                {showAISuggestions && aiSuggestions.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-[#E8E4DE]">
                    <h4 className="text-sm font-medium text-[#2C2420] mb-4 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#C9A86C]" />
                      Suggested Items
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {aiSuggestions.map((id) => {
                        const product = products.find((p) => p.id === id)
                        if (!product) return null
                        return (
                          <div
                            key={id}
                            className="cursor-pointer rounded-lg overflow-hidden border border-[#E8E4DE] hover:border-[#C9A86C] transition-colors"
                            onClick={() => handleSelectProduct(product)}
                          >
                            <div className="relative aspect-square bg-[#FAF8F5]">
                              <Image
                                src={product.image_url || "/placeholder.svg"}
                                alt={product.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="p-2 bg-white">
                              <p className="text-xs text-[#2C2420] truncate">{product.name}</p>
                              <p className="text-xs text-[#C9A86C]">{formatPrice(product.price)}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        {/* CURATED LOOKS TAB - Enhanced with better visuals and item preview */}
        <TabsContent value="curated" className="mt-8">
          <div className="mb-8 text-center">
            <h2 className="font-serif text-2xl text-[#2C2420] mb-2">Stylist-Curated Looks</h2>
            <p className="text-[#6B6560]">Complete outfits designed by our fashion experts for every occasion</p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {curatedLooks.map((look) => {
              const lookItems = getLookItems(look)
              return (
                <div
                  key={look.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow"
                >
                  <div className="relative aspect-[4/5]">
                    <Image src={look.image || "/placeholder.svg"} alt={look.name} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/90 text-[#2C2420] hover:bg-white">{look.occasion}</Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <button
                        onClick={() => handleSaveLook(look.id)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                          savedLooks.includes(look.id)
                            ? "bg-[#C9A86C] text-white"
                            : "bg-white/90 text-[#2C2420] hover:bg-white"
                        }`}
                      >
                        <Heart className={`w-5 h-5 ${savedLooks.includes(look.id) ? "fill-current" : ""}`} />
                      </button>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <h3 className="font-serif text-2xl mb-1">{look.name}</h3>
                      <p className="text-sm opacity-90">{look.description}</p>
                    </div>
                  </div>

                  {/* Items Preview */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex -space-x-3">
                        {lookItems.slice(0, 3).map((item, idx) => (
                          <div
                            key={item.id}
                            className="relative w-10 h-10 rounded-full border-2 border-white overflow-hidden"
                            style={{ zIndex: 3 - idx }}
                          >
                            <Image
                              src={item.image_url || "/placeholder.svg"}
                              alt={item.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                      <span className="text-sm text-[#6B6560]">{lookItems.length} items included</span>
                    </div>

                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <p className="text-xs text-[#8B8178]">Complete Look</p>
                        <p className="font-serif text-xl text-[#C9A86C]">{formatPrice(look.totalPrice)}</p>
                      </div>
                    </div>

                    <Button
                      onClick={() => handleApplyCuratedLook(look)}
                      className="w-full bg-[#2C2420] hover:bg-[#1A1614] text-white py-5"
                    >
                      Try This Look
                      <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </TabsContent>

        {/* VIRTUAL TRY-ON TAB - Enhanced with step-by-step flow and better visuals */}
        <TabsContent value="tryon" className="mt-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column - Steps */}
            <div className="space-y-6">
              {/* Step 1: Photo Upload */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${uploadedImage ? "bg-[#C9A86C] text-white" : "bg-[#E8E4DE] text-[#6B6560]"}`}
                  >
                    1
                  </div>
                  <h3 className="font-serif text-lg text-[#2C2420]">Upload Your Photo</h3>
                  {uploadedImage && <Check className="w-5 h-5 text-green-500 ml-auto" />}
                </div>

                <div
                  className={`relative aspect-[3/4] rounded-xl border-2 border-dashed transition-all cursor-pointer overflow-hidden ${
                    uploadedImage
                      ? "border-[#C9A86C] bg-[#C9A86C]/5"
                      : "border-[#E8E4DE] hover:border-[#C9A86C] bg-[#FAF8F5]"
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {uploadedImage ? (
                    <>
                      <Image
                        src={uploadedImage || "/placeholder.svg"}
                        alt="Your photo"
                        fill
                        className="object-cover rounded-xl"
                      />
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setUploadedImage(null)
                        }}
                        className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-50"
                      >
                        <X className="w-4 h-4 text-red-500" />
                      </button>
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 text-center">
                          <p className="text-xs text-[#6B6560]">Click to change photo</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                      <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center mb-4 shadow-sm">
                        <Upload className="w-10 h-10 text-[#C9A86C]" />
                      </div>
                      <h4 className="font-medium text-[#2C2420] mb-2">Upload a Full-Body Photo</h4>
                      <p className="text-sm text-[#6B6560] max-w-xs">
                        For best results, use a well-lit photo with a neutral background
                      </p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Step 2: Body Type Selection */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${selectedBodyType ? "bg-[#C9A86C] text-white" : "bg-[#E8E4DE] text-[#6B6560]"}`}
                  >
                    2
                  </div>
                  <h3 className="font-serif text-lg text-[#2C2420]">Select Body Type</h3>
                  {selectedBodyType && <Check className="w-5 h-5 text-green-500 ml-auto" />}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {bodyTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSelectedBodyType(type.id)}
                      className={`relative p-4 rounded-xl border-2 transition-all ${
                        selectedBodyType === type.id
                          ? "border-[#C9A86C] bg-[#C9A86C]/5"
                          : "border-[#E8E4DE] hover:border-[#C9A86C]/50 bg-white"
                      }`}
                    >
                      {selectedBodyType === type.id && (
                        <div className="absolute top-2 right-2 w-5 h-5 bg-[#C9A86C] rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                      <div
                        className={`h-16 mb-2 flex items-center justify-center ${selectedBodyType === type.id ? "text-[#C9A86C]" : "text-[#8B8178]"}`}
                      >
                        {bodyTypeSilhouettes[type.id] || <User className="w-12 h-12" />}
                      </div>
                      <p className="text-xs font-medium text-center text-[#2C2420]">{type.name}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step 3: Selected Items Summary */}
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getSelectedItemsCount() > 0 ? "bg-[#C9A86C] text-white" : "bg-[#E8E4DE] text-[#6B6560]"}`}
                  >
                    3
                  </div>
                  <h3 className="font-serif text-lg text-[#2C2420]">Selected Items</h3>
                  <Badge variant="secondary" className="ml-auto bg-[#C9A86C]/10 text-[#C9A86C]">
                    {getSelectedItemsCount()} items
                  </Badge>
                </div>

                {getSelectedItemsCount() === 0 ? (
                  <div className="text-center py-6 bg-[#FAF8F5] rounded-xl">
                    <Shirt className="w-10 h-10 text-[#C9A86C] mx-auto mb-3" />
                    <p className="text-sm text-[#6B6560] mb-3">No items selected yet</p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setActiveTab("build")}
                      className="bg-transparent"
                    >
                      Build Your Outfit
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {Object.values(selectedOutfit)
                        .filter(Boolean)
                        .map((item) => (
                          <div
                            key={item!.id}
                            className="relative w-16 h-20 rounded-lg overflow-hidden border border-[#E8E4DE]"
                          >
                            <Image
                              src={item!.image_url || "/placeholder.svg"}
                              alt={item!.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-[#E8E4DE]">
                      <span className="text-sm text-[#6B6560]">Total Value</span>
                      <span className="font-serif text-lg text-[#C9A86C]">{formatPrice(getTotalPrice())}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Result Preview */}
            <div className="bg-white rounded-2xl p-6 shadow-sm lg:sticky lg:top-24 lg:self-start">
              <h3 className="font-serif text-lg text-[#2C2420] mb-4">Your Virtual Look</h3>

              {resultImage ? (
                <div className="space-y-4">
                  <div className="aspect-[3/4] rounded-xl overflow-hidden relative bg-[#FAF8F5]">
                    <img
                      ref={resultImageRef}
                      src={resultImage || "/placeholder.svg"}
                      alt="Virtual try-on result"
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-3">
                    <Button variant="outline" className="bg-transparent" onClick={() => setResultImage(null)}>
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Retry
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="bg-transparent">
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="center" className="w-48">
                        <DropdownMenuItem onClick={() => handleShare("facebook")}>
                          <Facebook className="w-4 h-4 mr-2" />
                          Facebook
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShare("twitter")}>
                          <Twitter className="w-4 h-4 mr-2" />
                          Twitter
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShare("whatsapp")}>
                          <MessageCircle className="w-4 h-4 mr-2" />
                          WhatsApp
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShare("email")}>
                          <Mail className="w-4 h-4 mr-2" />
                          Email
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShare("copy")}>
                          <Link2 className="w-4 h-4 mr-2" />
                          Copy Link
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button
                      variant="outline"
                      className="bg-transparent"
                      onClick={handleDownloadImage}
                      disabled={isDownloading}
                    >
                      {isDownloading ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Download className="w-4 h-4 mr-2" />
                      )}
                      Save
                    </Button>
                  </div>

                  <Button
                    onClick={handleAddAllToCart}
                    className="w-full py-6 bg-[#C9A86C] hover:bg-[#B8975B] text-white"
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Add All to Bag - {formatPrice(getTotalPrice())}
                  </Button>
                </div>
              ) : (
                <div className="aspect-[3/4] rounded-xl bg-gradient-to-br from-[#FAF8F5] to-[#E8E4DE] flex flex-col items-center justify-center text-center p-8">
                  <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center mb-6 shadow-lg">
                    <Sparkles className="w-12 h-12 text-[#C9A86C]" />
                  </div>
                  <h3 className="font-serif text-xl text-[#2C2420] mb-3">Ready to See Your Look?</h3>
                  <p className="text-sm text-[#6B6560] mb-6 max-w-xs">
                    Complete all 3 steps above and click the button below to generate your virtual try-on
                  </p>

                  {/* Requirements Checklist */}
                  <div className="w-full bg-white rounded-xl p-4 mb-6 text-left">
                    <div className="flex items-center gap-3 mb-2">
                      {uploadedImage ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-[#E8E4DE]" />
                      )}
                      <span className={`text-sm ${uploadedImage ? "text-[#2C2420]" : "text-[#8B8178]"}`}>
                        Photo uploaded
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mb-2">
                      {selectedBodyType ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-[#E8E4DE]" />
                      )}
                      <span className={`text-sm ${selectedBodyType ? "text-[#2C2420]" : "text-[#8B8178]"}`}>
                        Body type selected
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      {getSelectedItemsCount() > 0 ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <div className="w-4 h-4 rounded-full border-2 border-[#E8E4DE]" />
                      )}
                      <span className={`text-sm ${getSelectedItemsCount() > 0 ? "text-[#2C2420]" : "text-[#8B8178]"}`}>
                        Items selected ({getSelectedItemsCount()})
                      </span>
                    </div>
                  </div>

                  <Button
                    onClick={handleGenerate}
                    disabled={isProcessing || !uploadedImage || !selectedBodyType || getSelectedItemsCount() === 0}
                    className="w-full bg-[#C9A86C] hover:bg-[#B8975B] text-white px-8 py-6 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Generating Your Look...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Generate Virtual Try-On
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Share Dialog */}
      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif">Share Your Look</DialogTitle>
            <DialogDescription>Share your virtual try-on with friends and family</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-3 py-4">
            <Button variant="outline" onClick={() => handleShare("facebook")} className="flex items-center gap-2">
              <Facebook className="w-5 h-5 text-blue-600" />
              Facebook
            </Button>
            <Button variant="outline" onClick={() => handleShare("twitter")} className="flex items-center gap-2">
              <Twitter className="w-5 h-5 text-sky-500" />
              Twitter
            </Button>
            <Button variant="outline" onClick={() => handleShare("whatsapp")} className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-green-500" />
              WhatsApp
            </Button>
            <Button variant="outline" onClick={() => handleShare("email")} className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-gray-600" />
              Email
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Input value={typeof window !== "undefined" ? window.location.href : ""} readOnly className="flex-1" />
            <Button variant="outline" onClick={() => handleShare("copy")}>
              <Link2 className="w-4 h-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
