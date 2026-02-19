"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams, useRouter } from "next/navigation"
import { MainNav } from "@/components/navigation/main-nav"
import { Footer } from "@/components/navigation/footer"
import { Filter, X, ChevronDown } from "lucide-react"
import { AIChatCompanion } from "@/components/ai-chat-companion"

const fallbackProducts = [
  {
    id: "1",
    name: "Brown Sling Bag",
    slug: "brown-sling-bag",
    price: 4500,
    images: ["/brown-leather-sling-bag-african-style.jpg"],
    category_id: "sling-bags",
    categories: { name: "Sling Bags", slug: "sling-bags" },
  },
  {
    id: "2",
    name: "Black Sling Bag",
    slug: "black-sling-bag",
    price: 4500,
    images: ["/black-leather-sling-bag-premium-quality.jpg"],
    category_id: "sling-bags",
    categories: { name: "Sling Bags", slug: "sling-bags" },
  },
  {
    id: "3",
    name: "Brown and White Sling Bag",
    slug: "brown-white-sling-bag",
    price: 5200,
    images: ["/brown-and-white-two-tone-leather-sling-bag.jpg"],
    category_id: "sling-bags",
    categories: { name: "Sling Bags", slug: "sling-bags" },
  },
  {
    id: "4",
    name: "Black and White Sling Bag",
    slug: "black-white-sling-bag",
    price: 5200,
    images: ["/black-and-white-two-tone-leather-sling-bag.jpg"],
    category_id: "sling-bags",
    categories: { name: "Sling Bags", slug: "sling-bags" },
  },
  {
    id: "5",
    name: "Maxi Black Side Bag",
    slug: "maxi-black-side-bag",
    price: 6800,
    images: ["/large-black-leather-side-bag-luxury.jpg"],
    category_id: "side-bags",
    categories: { name: "Side Bags", slug: "side-bags" },
  },
  {
    id: "6",
    name: "Maxi Brown Side Bag",
    slug: "maxi-brown-side-bag",
    price: 6800,
    images: ["/large-brown-leather-side-bag-elegant.jpg"],
    category_id: "side-bags",
    categories: { name: "Side Bags", slug: "side-bags" },
  },
  {
    id: "7",
    name: "Mini Black Side Bag",
    slug: "mini-black-side-bag",
    price: 3800,
    images: ["/small-black-leather-mini-side-bag.jpg"],
    category_id: "side-bags",
    categories: { name: "Side Bags", slug: "side-bags" },
  },
  {
    id: "8",
    name: "Mini Brown Side Bag",
    slug: "mini-brown-side-bag",
    price: 3800,
    images: ["/small-brown-leather-mini-side-bag.jpg"],
    category_id: "side-bags",
    categories: { name: "Side Bags", slug: "side-bags" },
  },
  {
    id: "9",
    name: "Black Cross Body Bag",
    slug: "black-cross-body-bag",
    price: 5500,
    images: ["/black-leather-crossbody-bag-elegant.jpg"],
    category_id: "cross-body-bags",
    categories: { name: "Cross Body Bags", slug: "cross-body-bags" },
  },
  {
    id: "10",
    name: "Brown Cross Body Bag",
    slug: "brown-cross-body-bag",
    price: 5500,
    images: ["/brown-leather-crossbody-bag-classic.jpg"],
    category_id: "cross-body-bags",
    categories: { name: "Cross Body Bags", slug: "cross-body-bags" },
  },
]

const fallbackCategories = [
  { id: "sling-bags", name: "Sling Bags", slug: "sling-bags" },
  { id: "side-bags", name: "Side Bags", slug: "side-bags" },
  { id: "cross-body-bags", name: "Cross Body Bags", slug: "cross-body-bags" },
]

type Product = (typeof fallbackProducts)[number]
type Category = (typeof fallbackCategories)[number]

export default function OurCollectionPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const categoryParam = searchParams.get("category")

  const [products, setProducts] = useState<Product[]>(fallbackProducts)
  const [categories, setCategories] = useState<Category[]>(fallbackCategories)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(categoryParam)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [sortBy, setSortBy] = useState<string>("newest")
  const [isLoading, setIsLoading] = useState(true)

  // Fetch products from Supabase
  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      const supabase = createClient()

      try {
        const { data: dbProducts } = await supabase
          .from("products")
          .select(`*, categories (name, slug)`)
          .eq("is_active", true)
          .order("created_at", { ascending: false })

        const { data: dbCategories } = await supabase.from("categories").select("*").order("name")

        if (dbProducts) {
          const productsData = dbProducts as Product[]
          setProducts(productsData)

          if (dbCategories) {
            setCategories(dbCategories as Category[])
          }
        } else if (dbCategories) {
          setCategories(dbCategories as Category[])
        }
      } catch (error) {
        console.log("[v0] Error fetching products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  // Update URL when category changes
  useEffect(() => {
    if (categoryParam !== selectedCategory) {
      setSelectedCategory(categoryParam)
    }
  }, [categoryParam])

  const handleCategoryChange = (categorySlug: string | null) => {
    setSelectedCategory(categorySlug)
    if (categorySlug) {
      router.push(`/our-collection?category=${categorySlug}`, { scroll: false })
    } else {
      router.push("/our-collection", { scroll: false })
    }
  }

  // Filter products by category
  const filteredProducts = selectedCategory
    ? products.filter((p) => p.categories?.slug === selectedCategory || p.category_id === selectedCategory)
    : products

  // Filter categories to show in the navigation bar
  // If on "scents" page, only show scent-related categories
  // Otherwise, show regular categories and hide scent-related ones
  const isScentsPage = selectedCategory === "scents" || selectedCategory?.startsWith("scent-")
  const scentSlugs = ["scent-1", "scent-2", "scent-3", "scent-4"]

  const visibleCategories = categories.filter((category) => {
    const isScentCategory = scentSlugs.includes(category.slug)
    if (isScentsPage) {
      return isScentCategory || category.slug === "scents"
    } else {
      // On regular page, hide scent sub-categories
      return !isScentCategory
    }
  })

  // Define header content based on category
  const getHeaderContent = () => {
    switch (selectedCategory) {
      case "scents":
        return {
          image: "/images/IMG_4756 (Custom).jpg",
          title: "The Scents",
          subtitle: "Collection",
          description:
            "Step into a fragrance defined by leathered notes and earthy depth, crafted to evoke warmth, memory, and the quiet power of natural materials.",
        }
      default:
        return {
          image: "/images/IMG_4410(2) (Custom).jpg",
          title: "Ngozi",
          subtitle: "Collection",
          description:
            "Experience leather in its most authentic form, where natural textures and earth-born colors come together to celebrate the beauty, depth, and integrity of nature itself.",
        }
    }
  }

  const headerContent = getHeaderContent()

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "name":
        return a.name.localeCompare(b.name)
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-white">
      <MainNav variant="solid" activeItem="/our-collection" />

      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <Image
          src={headerContent.image}
          alt={`Sulhaafrika ${headerContent.title} ${headerContent.subtitle}`}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div>
            <p className="text-white/80 text-xs tracking-[0.4em] mb-4">HANDCRAFTED IN AFRICA</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-white mb-4">
              {headerContent.title} <span className="italic font-light">{headerContent.subtitle}</span>
            </h1>
            <p className="text-white/80 text-sm sm:text-base max-w-md mx-auto">
              {headerContent.description}
            </p>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .category-nav-solid {
          background-color: white !important;
          background: white !important;
          opacity: 1 !important;
          visibility: visible !important;
        }
      `}</style>
      <section 
        className="border-b border-[#E8E4DE] bg-white !bg-white sticky top-[64px] sm:top-[73px] z-40 shadow-sm category-nav-solid"
        style={{ backgroundColor: "#ffffff", opacity: 1 }}
      >
        <div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-white !bg-white category-nav-solid"
          style={{ backgroundColor: "#ffffff", opacity: 1 }}
        >
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar pb-1 flex-1 min-w-0">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 text-[9px] sm:text-xs tracking-[0.1em] sm:tracking-[0.15em] border border-[#2C2420] hover:bg-[#2C2420] hover:text-white transition-colors whitespace-nowrap rounded-sm shrink-0"
              >
                <Filter className="w-3 h-3 sm:w-4 sm:h-4" />
                FILTER
              </button>
              <button
                onClick={() => handleCategoryChange(null)}
                className={`px-2 sm:px-4 py-2 text-[9px] sm:text-xs tracking-[0.1em] sm:tracking-[0.15em] whitespace-nowrap rounded-sm transition-colors shrink-0 ${
                  !selectedCategory ? "bg-[#2C2420] text-white" : "text-[#6B6560] hover:text-[#2C2420]"
                }`}
              >
                ALL
              </button>
              {visibleCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.slug)}
                  className={`px-2 sm:px-4 py-2 text-[9px] sm:text-xs tracking-[0.1em] sm:tracking-[0.15em] whitespace-nowrap rounded-sm transition-colors shrink-0 ${
                    selectedCategory === category.slug
                      ? "bg-[#2C2420] text-white"
                      : "text-[#6B6560] hover:text-[#2C2420]"
                  }`}
                >
                  {category.name.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Sort dropdown */}
            <div className="relative shrink-0">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                aria-label="Sort products"
                className="appearance-none bg-transparent border border-[#E8E4DE] px-2 sm:px-4 py-2 pr-6 sm:pr-8 text-[9px] sm:text-xs tracking-[0.1em] text-[#6B6560] cursor-pointer rounded-sm focus:outline-none focus:border-[#2C2420]"
              >
                <option value="newest">NEWEST</option>
                <option value="price-low">LOW - HIGH</option>
                <option value="price-high">HIGH - LOW</option>
                <option value="name">NAME</option>
              </select>
              <ChevronDown className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-[#6B6560] pointer-events-none" />
            </div>
          </div>

          {/* Active filter tag */}
          {selectedCategory && (
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#E8E4DE]">
              <span className="text-[10px] tracking-[0.15em] text-[#6B6560]">ACTIVE FILTER:</span>
              <button
                onClick={() => handleCategoryChange(null)}
                className="flex items-center gap-1 bg-[#2C2420] text-white px-3 py-1 text-[10px] tracking-[0.1em] rounded-full"
              >
                {categories.find((c) => c.slug === selectedCategory)?.name.toUpperCase()}
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Filter Sidebar */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setIsFilterOpen(false)}>
          <div
            className="absolute left-0 top-0 h-full w-80 bg-white shadow-xl p-6 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm tracking-[0.2em] font-medium">FILTERS</h3>
              <button onClick={() => setIsFilterOpen(false)}>
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Categories */}
            <div className="mb-8">
              <h4 className="text-xs tracking-[0.15em] text-[#6B6560] mb-4">CATEGORIES</h4>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    handleCategoryChange(null)
                    setIsFilterOpen(false)
                  }}
                  className={`block w-full text-left py-2 text-sm transition-colors ${
                    !selectedCategory ? "text-[#C9A86C] font-medium" : "text-[#2C2420] hover:text-[#C9A86C]"
                  }`}
                >
                  All Products
                </button>
                {visibleCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      handleCategoryChange(category.slug)
                      setIsFilterOpen(false)
                    }}
                    className={`block w-full text-left py-2 text-sm transition-colors ${
                      selectedCategory === category.slug
                        ? "text-[#C9A86C] font-medium"
                        : "text-[#2C2420] hover:text-[#C9A86C]"
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort (mobile) */}
            <div className="sm:hidden">
              <h4 className="text-xs tracking-[0.15em] text-[#6B6560] mb-4">SORT BY</h4>
              <div className="space-y-2">
                {[
                  { value: "newest", label: "Newest" },
                  { value: "price-low", label: "Price: Low to High" },
                  { value: "price-high", label: "Price: High to Low" },
                  { value: "name", label: "Name" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSortBy(option.value)
                      setIsFilterOpen(false)
                    }}
                    className={`block w-full text-left py-2 text-sm transition-colors ${
                      sortBy === option.value ? "text-[#C9A86C] font-medium" : "text-[#2C2420] hover:text-[#C9A86C]"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Products Grid */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results count */}
          <div className="mb-6 text-sm text-[#6B6560]">
            Showing {sortedProducts.length} {sortedProducts.length === 1 ? "product" : "products"}
            {selectedCategory && ` in ${categories.find((c) => c.slug === selectedCategory)?.name}`}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-[#E8E4DE] rounded-lg mb-4" />
                  <div className="h-3 bg-[#E8E4DE] rounded w-1/3 mb-2" />
                  <div className="h-4 bg-[#E8E4DE] rounded w-2/3 mb-2" />
                  <div className="h-3 bg-[#E8E4DE] rounded w-1/4" />
                </div>
              ))}
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[#6B6560] mb-4">No products found in this category.</p>
              <button
                onClick={() => handleCategoryChange(null)}
                className="text-[#C9A86C] text-sm underline hover:no-underline"
              >
                View all products
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {sortedProducts.map((product, index) => (
                <Link key={product.id} href={`/products/${product.slug}`} className="group">
                  <div className="card-hover" style={{ animationDelay: `${index * 50}ms` }}>
                    <div className="aspect-[3/4] mb-4 overflow-hidden bg-[#F5F3F0] image-zoom relative rounded-lg">
                      <Image
                        src={product.images?.[0] || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 50vw, (max-width: 1280px) 33vw, 25vw"
                      />
                      {/* Quick Shop Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
                        <button
                          className="bg-white text-[#2C2420] px-3 sm:px-4 py-2 text-[9px] sm:text-xs tracking-[0.15em] translate-y-4 group-hover:translate-y-0 transition-all duration-500 whitespace-nowrap rounded-sm"
                          aria-label={`Quick view ${product.name}`}
                        >
                          QUICK VIEW
                        </button>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {product.categories && (
                        <p className="text-[9px] sm:text-[10px] tracking-[0.2em] text-[#C9A86C]">
                          {product.categories.name.toUpperCase()}
                        </p>
                      )}
                      <h3 className="text-xs sm:text-sm font-medium group-hover:text-[#C9A86C] transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-[#6B6560]">KSh {product.price.toLocaleString()}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />

      <AIChatCompanion />
    </div>
  )
}
