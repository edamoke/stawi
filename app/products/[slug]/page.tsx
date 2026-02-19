"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { MainNav } from "@/components/navigation/main-nav"
import { Footer } from "@/components/navigation/footer"
import { useCart } from "@/context/cart-context"
import { AIChatCompanion } from "@/components/ai-chat-companion"
import {
  Star,
  Heart,
  Minus,
  Plus,
  Share2,
  ChevronLeft,
  ChevronRight,
  Check,
  Truck,
  RotateCcw,
  Shield,
} from "lucide-react"

const fallbackProducts = [
  {
    id: "1",
    name: "Brown Sling Bag",
    slug: "brown-sling-bag",
    price: 4500,
    description:
      "A beautifully crafted brown leather sling bag from our Ngozi Collection. Features premium African leather with traditional craftsmanship, adjustable strap, and secure zip closure. Perfect for daily essentials.",
    images: ["/brown-leather-sling-bag-african-style.jpg"],
    category_id: "sling-bags",
    categories: { name: "Sling Bags", slug: "sling-bags" },
    stock_quantity: 25,
  },
  {
    id: "2",
    name: "Black Sling Bag",
    slug: "black-sling-bag",
    price: 4500,
    description:
      "Sleek black leather sling bag from our Ngozi Collection. Handcrafted with premium quality leather, featuring a minimalist design with maximum functionality.",
    images: ["/black-leather-sling-bag-premium-quality.jpg"],
    category_id: "sling-bags",
    categories: { name: "Sling Bags", slug: "sling-bags" },
    stock_quantity: 30,
  },
  {
    id: "3",
    name: "Brown and White Sling Bag",
    slug: "brown-white-sling-bag",
    price: 5200,
    description:
      "Stunning two-tone sling bag combining rich brown and crisp white leather. A statement piece from our Ngozi Collection.",
    images: ["/brown-and-white-two-tone-leather-sling-bag.jpg"],
    category_id: "sling-bags",
    categories: { name: "Sling Bags", slug: "sling-bags" },
    stock_quantity: 15,
  },
  {
    id: "4",
    name: "Black and White Sling Bag",
    slug: "black-white-sling-bag",
    price: 5200,
    description:
      "Contemporary black and white leather sling bag from our Ngozi Collection. Bold contrast design that makes a fashion statement.",
    images: ["/black-and-white-two-tone-leather-sling-bag.jpg"],
    category_id: "sling-bags",
    categories: { name: "Sling Bags", slug: "sling-bags" },
    stock_quantity: 15,
  },
  {
    id: "5",
    name: "Maxi Black Side Bag",
    slug: "maxi-black-side-bag",
    price: 6800,
    description:
      "Large capacity black leather side bag from our Ngozi Collection. Perfect for those who need extra space without compromising on style.",
    images: ["/large-black-leather-side-bag-luxury.jpg"],
    category_id: "side-bags",
    categories: { name: "Side Bags", slug: "side-bags" },
    stock_quantity: 12,
  },
  {
    id: "6",
    name: "Maxi Brown Side Bag",
    slug: "maxi-brown-side-bag",
    price: 6800,
    description:
      "Spacious brown leather side bag from our Ngozi Collection. Elegant and practical with ample room for all your essentials.",
    images: ["/large-brown-leather-side-bag-elegant.jpg"],
    category_id: "side-bags",
    categories: { name: "Side Bags", slug: "side-bags" },
    stock_quantity: 10,
  },
  {
    id: "7",
    name: "Mini Black Side Bag",
    slug: "mini-black-side-bag",
    price: 3800,
    description:
      "Compact black leather side bag from our Ngozi Collection. Perfect for minimalists who want to carry just the essentials in style.",
    images: ["/small-black-leather-mini-side-bag.jpg"],
    category_id: "side-bags",
    categories: { name: "Side Bags", slug: "side-bags" },
    stock_quantity: 20,
  },
  {
    id: "8",
    name: "Mini Brown Side Bag",
    slug: "mini-brown-side-bag",
    price: 3800,
    description:
      "Petite brown leather side bag from our Ngozi Collection. Ideal for evenings out or when you need a chic, compact accessory.",
    images: ["/small-brown-leather-mini-side-bag.jpg"],
    category_id: "side-bags",
    categories: { name: "Side Bags", slug: "side-bags" },
    stock_quantity: 18,
  },
  {
    id: "9",
    name: "Black Cross Body Bag",
    slug: "black-cross-body-bag",
    price: 5500,
    description:
      "Classic black leather cross body bag from our Ngozi Collection. Designed for comfort and convenience with an adjustable strap.",
    images: ["/black-leather-crossbody-bag-elegant.jpg"],
    category_id: "cross-body-bags",
    categories: { name: "Cross Body Bags", slug: "cross-body-bags" },
    stock_quantity: 22,
  },
  {
    id: "10",
    name: "Brown Cross Body Bag",
    slug: "brown-cross-body-bag",
    price: 5500,
    description:
      "Timeless brown leather cross body bag from our Ngozi Collection. Versatile design that transitions seamlessly from day to night.",
    images: ["/brown-leather-crossbody-bag-classic.jpg"],
    category_id: "cross-body-bags",
    categories: { name: "Cross Body Bags", slug: "cross-body-bags" },
    stock_quantity: 20,
  },
]

// Mock reviews
const mockReviews = [
  {
    id: "r1",
    user_id: "u1",
    rating: 5,
    review: "Absolutely stunning bag! The quality of the leather is amazing and the craftsmanship is perfect.",
    created_at: "2024-12-01T10:00:00Z",
    profiles: { full_name: "Sarah M.", email: "sarah@example.com" },
  },
  {
    id: "r2",
    user_id: "u2",
    rating: 4,
    review: "Beautiful leather bag, exactly as pictured. Shipping was fast too!",
    created_at: "2024-11-28T14:30:00Z",
    profiles: { full_name: "Amina K.", email: "amina@example.com" },
  },
  {
    id: "r3",
    user_id: "u3",
    rating: 5,
    review: "The leather is so soft and the design is unique. Love supporting African craftsmanship!",
    created_at: "2024-11-25T09:15:00Z",
    profiles: { full_name: "Grace O.", email: "grace@example.com" },
  },
]

type Product = (typeof fallbackProducts)[number]
type Review = (typeof mockReviews)[number]

export default function ProductDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const { addItem, openCart } = useCart()

  const [product, setProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>(mockReviews)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [activeTab, setActiveTab] = useState<"description" | "reviews" | "shipping">("description")

  useEffect(() => {
    async function fetchProduct() {
      setIsLoading(true)
      const supabase = createClient()

      try {
        // Fetch from database
        const { data: dbProduct } = await supabase
          .from("products")
          .select(`*, categories (name, slug)`)
          .eq("slug", slug)
          .eq("is_active", true)
          .single()

        if (dbProduct) {
          setProduct(dbProduct as Product)

          // Fetch reviews
          const { data: dbReviews } = await supabase
            .from("product_ratings")
            .select(`*, profiles (full_name, email)`)
            .eq("product_id", dbProduct.id)
            .order("created_at", { ascending: false })
            .limit(10)

          if (dbReviews && dbReviews.length > 0) {
            setReviews(dbReviews as Review[])
          }

          // Fetch related products
          const { data: related } = await supabase
            .from("products")
            .select(`*, categories (name, slug)`)
            .eq("category_id", dbProduct.category_id)
            .neq("id", dbProduct.id)
            .eq("is_active", true)
            .limit(4)

          if (related) {
            setRelatedProducts(related as Product[])
          }
        }
      } catch (error) {
        console.log("[v0] Error fetching product:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (slug) {
      fetchProduct()
    }
  }, [slug])

  const handleAddToCart = () => {
    if (!product) return
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image_url: product.images?.[0] || "/placeholder.svg",
      slug: product.slug,
      category: product.categories?.name,
    })
    openCart()
  }

  const formatPrice = (price: number) => {
    return `KSh ${price.toLocaleString()}`
  }

  const averageRating = reviews.length > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : 0

  const images = product?.images && product.images.length > 0 ? product.images : ["/placeholder.svg"]

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <MainNav variant="solid" />
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="aspect-[3/4] bg-[#E8E4DE] animate-pulse rounded-lg" />
            <div className="space-y-4">
              <div className="h-4 bg-[#E8E4DE] animate-pulse rounded w-1/4" />
              <div className="h-8 bg-[#E8E4DE] animate-pulse rounded w-3/4" />
              <div className="h-6 bg-[#E8E4DE] animate-pulse rounded w-1/3" />
              <div className="h-24 bg-[#E8E4DE] animate-pulse rounded" />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#FAF8F5]">
        <MainNav variant="solid" />
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-serif mb-4">Product Not Found</h1>
          <p className="text-[#6B6560] mb-8">The product you're looking for doesn't exist or has been removed.</p>
          <Link
            href="/our-collection"
            className="inline-block bg-[#2C2420] text-white px-8 py-3 text-xs tracking-[0.2em] hover:bg-[#C9A86C] transition-colors rounded-sm"
          >
            BROWSE COLLECTION
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const stockQuantity = (product as any).stock !== undefined ? (product as any).stock : (product.stock_quantity || 0)

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <MainNav variant="solid" />

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="flex items-center gap-2 text-xs text-[#6B6560]">
          <Link href="/" className="hover:text-[#2C2420] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link href="/our-collection" className="hover:text-[#2C2420] transition-colors">
            Collection
          </Link>
          <span>/</span>
          {product.categories && (
            <>
              <Link
                href={`/our-collection?category=${product.categories.slug}`}
                className="hover:text-[#2C2420] transition-colors"
              >
                {product.categories.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-[#2C2420]">{product.name}</span>
        </nav>
      </div>

      {/* Product Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-[3/4] bg-[#F5F3F0] rounded-lg overflow-hidden group">
              <Image
                src={images[selectedImageIndex] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    title="Previous image"
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={nextImage}
                    title="Next image"
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative w-20 h-24 flex-shrink-0 rounded-md overflow-hidden transition-all cursor-pointer ${
                      selectedImageIndex === index
                        ? "ring-2 ring-[#C9A86C] ring-offset-2"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img || "/placeholder.svg"}
                      alt={`${product.name} view ${index + 1}`}
                      fill
                      className="object-cover pointer-events-none"
                      sizes="80px"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="lg:sticky lg:top-32 lg:self-start space-y-6">
            {/* Category */}
            {product.categories && (
              <p className="text-xs tracking-[0.2em] text-[#C9A86C]">{product.categories.name.toUpperCase()}</p>
            )}

            {/* Name */}
            <h1 className="text-3xl sm:text-4xl font-serif text-[#2C2420]">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${i < Math.round(averageRating) ? "fill-[#C9A86C] text-[#C9A86C]" : "text-[#E8E4DE]"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-[#6B6560]">
                {averageRating.toFixed(1)} ({reviews.length} reviews)
              </span>
            </div>

            {/* Price */}
            <p className="text-2xl font-medium text-[#2C2420]">{formatPrice(product.price)}</p>

            {/* Description (short) */}
            <p className="text-[#6B6560] leading-relaxed">{product.description}</p>

            {/* Stock Status - Use stockQuantity */}
            <div className="flex items-center gap-2">
              {stockQuantity > 0 ? (
                <>
                  <Check className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">In Stock ({stockQuantity} available)</span>
                </>
              ) : (
                <span className="text-sm text-red-600">Out of Stock</span>
              )}
            </div>

            {/* Quantity Selector - Use stockQuantity */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-[#6B6560]">Quantity:</span>
              <div className="flex items-center border border-[#E8E4DE] rounded-sm">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  title="Decrease quantity"
                  className="w-10 h-10 flex items-center justify-center hover:bg-[#F5F3F0] transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(stockQuantity > 0 ? stockQuantity : 10, quantity + 1))}
                  title="Increase quantity"
                  className="w-10 h-10 flex items-center justify-center hover:bg-[#F5F3F0] transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Add to Cart & Wishlist - Use stockQuantity */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={stockQuantity <= 0}
                className="flex-1 bg-[#2C2420] text-white py-4 text-xs tracking-[0.2em] hover:bg-[#C9A86C] transition-colors disabled:bg-[#E8E4DE] disabled:cursor-not-allowed rounded-sm"
              >
                ADD TO BAG
              </button>
              <button
                onClick={() => setIsWishlisted(!isWishlisted)}
                title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                className={`w-14 h-14 border flex items-center justify-center transition-colors rounded-sm ${
                  isWishlisted
                    ? "bg-[#C9A86C] border-[#C9A86C] text-white"
                    : "border-[#E8E4DE] hover:border-[#C9A86C] text-[#6B6560]"
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
              </button>
              <button
                title="Share product"
                className="w-14 h-14 border border-[#E8E4DE] flex items-center justify-center hover:border-[#C9A86C] transition-colors rounded-sm text-[#6B6560]"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#E8E4DE]">
              <div className="text-center">
                <Truck className="w-6 h-6 mx-auto mb-2 text-[#C9A86C]" />
                <p className="text-[10px] tracking-[0.1em] text-[#6B6560]">FREE SHIPPING</p>
                <p className="text-[10px] text-[#8B8178]">Over KSh 10,000</p>
              </div>
              <div className="text-center">
                <RotateCcw className="w-6 h-6 mx-auto mb-2 text-[#C9A86C]" />
                <p className="text-[10px] tracking-[0.1em] text-[#6B6560]">EASY RETURNS</p>
                <p className="text-[10px] text-[#8B8178]">30-day policy</p>
              </div>
              <div className="text-center">
                <Shield className="w-6 h-6 mx-auto mb-2 text-[#C9A86C]" />
                <p className="text-[10px] tracking-[0.1em] text-[#6B6560]">SECURE</p>
                <p className="text-[10px] text-[#8B8178]">Payment</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-[#E8E4DE]">
        {/* Tab Headers */}
        <div className="flex gap-8 border-b border-[#E8E4DE] mb-8">
          {[
            { key: "description", label: "Description" },
            { key: "reviews", label: `Reviews (${reviews.length})` },
            { key: "shipping", label: "Shipping & Returns" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`pb-4 text-sm tracking-[0.1em] transition-colors relative ${
                activeTab === tab.key ? "text-[#2C2420]" : "text-[#6B6560] hover:text-[#2C2420]"
              }`}
            >
              {tab.label}
              {activeTab === tab.key && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C9A86C]" />}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="max-w-3xl">
          {activeTab === "description" && (
            <div className="prose prose-sm text-[#6B6560]">
              <p className="leading-relaxed">{product.description}</p>
              <h4 className="text-[#2C2420] mt-6 mb-3 text-sm tracking-[0.1em]">FEATURES</h4>
              <ul className="space-y-2">
                <li>Premium African leather</li>
                <li>Handcrafted by skilled artisans</li>
                <li>Adjustable strap</li>
                <li>Secure zip closure</li>
                <li>Interior pockets for organization</li>
              </ul>
              <h4 className="text-[#2C2420] mt-6 mb-3 text-sm tracking-[0.1em]">CARE INSTRUCTIONS</h4>
              <ul className="space-y-2">
                <li>Clean with a soft, dry cloth</li>
                <li>Store in dust bag when not in use</li>
                <li>Keep away from direct sunlight</li>
                <li>Use leather conditioner periodically</li>
              </ul>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-[#E8E4DE] pb-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${i < review.rating ? "fill-[#C9A86C] text-[#C9A86C]" : "text-[#E8E4DE]"}`}
                        />
                      ))}
                    </div>
                    <span className="text-sm font-medium">{review.profiles?.full_name || "Anonymous"}</span>
                    <span className="text-xs text-[#6B6560]">{new Date(review.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-[#6B6560]">{review.review}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="prose prose-sm text-[#6B6560]">
              <h4 className="text-[#2C2420] mb-3 text-sm tracking-[0.1em]">SHIPPING</h4>
              <ul className="space-y-2 mb-6">
                <li>Free shipping on orders over KSh 10,000</li>
                <li>Standard shipping: 3-5 business days (KSh 500)</li>
                <li>Express shipping: 1-2 business days (KSh 1,000)</li>
                <li>International shipping available</li>
              </ul>
              <h4 className="text-[#2C2420] mb-3 text-sm tracking-[0.1em]">RETURNS</h4>
              <ul className="space-y-2">
                <li>30-day return policy</li>
                <li>Items must be unworn with tags attached</li>
                <li>Free returns for store credit</li>
                <li>Refunds processed within 5-7 business days</li>
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-[#E8E4DE]">
          <h2 className="text-2xl font-serif text-[#2C2420] mb-8">You May Also Like</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Link key={relatedProduct.id} href={`/products/${relatedProduct.slug}`} className="group">
                <div className="aspect-[3/4] mb-4 overflow-hidden bg-[#F5F3F0] rounded-lg relative">
                  <Image
                    src={relatedProduct.images?.[0] || "/placeholder.svg"}
                    alt={relatedProduct.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <h3 className="text-sm font-medium group-hover:text-[#C9A86C] transition-colors">
                  {relatedProduct.name}
                </h3>
                <p className="text-sm text-[#6B6560]">{formatPrice(relatedProduct.price)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Footer />
      <AIChatCompanion />
    </div>
  )
}
