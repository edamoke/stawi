import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { createClient } from "@/lib/supabase/server"

export const maxDuration = 30

const fallbackProducts = [
  {
    id: "ngozi-1",
    name: "Brown Sling Bag",
    slug: "brown-sling-bag",
    price: 8500,
    description: "Classic brown leather sling bag, perfect for everyday use",
    image_url: "/brown-leather-sling-bag.jpg",
    category: "Sling Bags",
  },
  {
    id: "ngozi-2",
    name: "Black Sling Bag",
    slug: "black-sling-bag",
    price: 8500,
    description: "Sleek black leather sling bag for a modern look",
    image_url: "/black-leather-sling-bag.jpg",
    category: "Sling Bags",
  },
  {
    id: "ngozi-3",
    name: "Brown and White Sling Bag",
    slug: "brown-white-sling-bag",
    price: 9500,
    description: "Two-tone brown and white leather sling bag",
    image_url: "/placeholder.svg?height=600&width=450",
    category: "Sling Bags",
  },
  {
    id: "ngozi-4",
    name: "Black and White Sling Bag",
    slug: "black-white-sling-bag",
    price: 9500,
    description: "Stylish black and white leather sling bag",
    image_url: "/placeholder.svg?height=600&width=450",
    category: "Sling Bags",
  },
  {
    id: "ngozi-5",
    name: "Maxi Black Side Bag",
    slug: "maxi-black-side-bag",
    price: 12500,
    description: "Large black leather side bag with ample storage",
    image_url: "/placeholder.svg?height=600&width=450",
    category: "Side Bags",
  },
  {
    id: "ngozi-6",
    name: "Maxi Brown Side Bag",
    slug: "maxi-brown-side-bag",
    price: 12500,
    description: "Large brown leather side bag for work and travel",
    image_url: "/placeholder.svg?height=600&width=450",
    category: "Side Bags",
  },
  {
    id: "ngozi-7",
    name: "Mini Black Side Bag",
    slug: "mini-black-side-bag",
    price: 7500,
    description: "Compact black leather side bag for essentials",
    image_url: "/placeholder.svg?height=600&width=450",
    category: "Side Bags",
  },
  {
    id: "ngozi-8",
    name: "Mini Brown Side Bag",
    slug: "mini-brown-side-bag",
    price: 7500,
    description: "Compact brown leather side bag for on-the-go",
    image_url: "/placeholder.svg?height=600&width=450",
    category: "Side Bags",
  },
  {
    id: "ngozi-9",
    name: "Black Cross Body Bag",
    slug: "black-cross-body-bag",
    price: 9800,
    description: "Elegant black leather crossbody bag",
    image_url: "/placeholder.svg?height=600&width=450",
    category: "Cross Body Bags",
  },
  {
    id: "ngozi-10",
    name: "Brown Cross Body Bag",
    slug: "brown-cross-body-bag",
    price: 9800,
    description: "Classic brown leather crossbody bag",
    image_url: "/placeholder.svg?height=600&width=450",
    category: "Cross Body Bags",
  },
]

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Get products from database
    let products = fallbackProducts
    try {
      const supabase = await createClient()
      const { data: dbProducts } = await supabase
        .from("products")
        .select(`*, categories (name, slug)`)
        .eq("is_active", true)
        .order("created_at", { ascending: false })

      if (dbProducts && dbProducts.length > 0) {
        products = dbProducts.map((p) => ({
          id: p.id,
          name: p.name,
          slug: p.slug,
          price: p.price,
          description: p.description || "",
          image_url: p.image_url,
          category: p.categories?.name || "Uncategorized",
        }))
      }
    } catch (error) {
      console.log("[v0] Using fallback products:", error)
    }

    // Create product catalog context
    const productCatalog = products
      .map((p) => `- ${p.name} (${p.category}): KSh ${p.price.toLocaleString()} - ${p.description} [slug: ${p.slug}]`)
      .join("\n")

    const currentOffers = `
CURRENT OFFERS:
- Free Nairobi delivery on orders over KSh 15,000
- 10% off first order with code SULHA10
- M-Pesa and PayPal accepted
- New Ngozi Collection arrivals get 15% discount for first week
`

    const systemPrompt = `You are Sulhaafrika's AI Style Assistant, a helpful and knowledgeable consultant for Sulhaafrika, a premium African leather bag brand specializing in the Ngozi Collection - handcrafted leather bags including sling bags, side bags, and crossbody bags.

PRODUCT CATALOG:
${productCatalog}

${currentOffers}

BRAND INFO:
- Sulhaafrika is a premium leather bag brand handcrafted in Africa
- Known for the Ngozi Collection featuring sling bags, side bags, and crossbody bags
- All pieces are made from high-quality leather with African craftsmanship
- We value sustainability, quality materials, and timeless design
- "Ngozi" means leather/skin in Swahili

LEATHER CARE TIPS:
- Store bags in dust bags when not in use
- Apply leather conditioner every 3-6 months
- Avoid direct sunlight and moisture
- Clean with a soft, dry cloth

YOUR RESPONSIBILITIES:
1. Help customers find the perfect leather bag for their needs
2. Provide styling advice and outfit recommendations
3. Answer questions about products, leather quality, and care
4. Inform about current offers and promotions
5. Be warm, helpful, and embody the elegant African craftsmanship of the brand

RESPONSE FORMAT:
- Keep responses concise but helpful (2-4 sentences max for simple queries)
- When recommending products, mention specific items from the catalog
- Be enthusiastic about the brand but not pushy
- Use a warm, sophisticated tone

When you recommend products, include them in your response naturally. The system will automatically show product cards for items you mention.

If the user asks about products, always try to suggest relevant items from the catalog. Include the product slug in brackets like [product-slug] when mentioning products so the system can display them.`

    const lastUserMessage = messages[messages.length - 1]?.content || ""

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      system: systemPrompt,
      prompt: lastUserMessage,
      maxOutputTokens: 500,
      temperature: 0.7,
    })

    // Extract mentioned product slugs from the response
    const mentionedSlugs = text.match(/\[([a-z0-9-]+)\]/g)?.map((s) => s.slice(1, -1)) || []

    // Find products that match either by slug or by name mention
    const matchedProducts = products.filter((p) => {
      const slugMatch = mentionedSlugs.includes(p.slug)
      const nameMatch = text.toLowerCase().includes(p.name.toLowerCase())
      return slugMatch || nameMatch
    })

    // Clean up the response text (remove slug brackets)
    const cleanedText = text.replace(/\[([a-z0-9-]+)\]/g, "")

    return Response.json({
      content: cleanedText,
      products: matchedProducts.slice(0, 4).map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        image_url: p.image_url,
        slug: p.slug,
      })),
    })
  } catch (error) {
    console.error("[v0] Chat API error:", error)
    return Response.json({ error: "Failed to process chat message" }, { status: 500 })
  }
}
