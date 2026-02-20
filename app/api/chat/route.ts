import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { createClient } from "@/lib/supabase/server"

export const maxDuration = 30

const fallbackProducts = [
  {
    id: "stawi-1",
    name: "Radiance Facial Oil",
    slug: "radiance-facial-oil",
    price: 3500,
    description: "Pure botanical facial oil for a natural glow",
    image_url: "/products/facial-oil.jpg",
    category: "Skincare",
  },
  {
    id: "stawi-2",
    name: "Shea Body Butter",
    slug: "shea-body-butter",
    price: 2800,
    description: "Deeply moisturizing raw shea butter blend",
    image_url: "/products/body-butter.jpg",
    category: "Body Care",
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
- Free Nairobi delivery on orders over KSh 5,000
- 10% off first order with code Stawi10
- M-Pesa and PayPal accepted
- New Glow Collection arrivals get 15% discount for first week
`

    const systemPrompt = `You are Stawi's AI Beauty Consultant, a helpful and knowledgeable expert for Stawi, a premium African cosmetics and beauty brand specializing in the Glow Collection - handcrafted botanical skincare and beauty products.

PRODUCT CATALOG:
${productCatalog}

${currentOffers}

BRAND INFO:
- Stawi is a premium beauty brand handcrafted in Kenya using African botanicals
- Known for the Glow Collection featuring skincare, haircare, and body care
- All products are natural, sustainable, and ethically sourced
- We value purity, effective natural ingredients, and African heritage

SKINCARE TIPS:
- Cleanse twice daily with lukewarm water
- Apply serums on damp skin for better absorption
- Always use sun protection
- Store products in a cool, dry place

YOUR RESPONSIBILITIES:
1. Help customers find the perfect beauty products for their skin type
2. Provide skincare routines and product recommendations
3. Answer questions about ingredients, product benefits, and usage
4. Inform about current offers and promotions
5. Be warm, helpful, and embody the pure, natural essence of the brand

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
