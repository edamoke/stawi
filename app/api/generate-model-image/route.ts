import { experimental_generateImage as generateImage } from "ai"
import { google } from "@ai-sdk/google"
import { type NextRequest, NextResponse } from "next/server"

console.log("[v0] AI Gateway API key available:", !!process.env.AI_GATEWAY_API_KEY)

async function convertImageToSupportedFormat(file: File): Promise<{ buffer: Buffer; mimeType: string }> {
  console.log("[v0] Converting image format:", file.type, "size:", file.size)

  const supportedTypes = ["image/png", "image/jpeg", "image/webp"]

  if (supportedTypes.includes(file.type)) {
    const buffer = Buffer.from(await file.arrayBuffer())
    console.log("[v0] Image already supported, buffer size:", buffer.length)
    return {
      buffer,
      mimeType: file.type,
    }
  }

  console.log("[v0] Converting unsupported format", file.type, "to image/jpeg")
  const buffer = Buffer.from(await file.arrayBuffer())
  console.log("[v0] Converted buffer size:", buffer.length)
  return {
    buffer,
    mimeType: "image/jpeg",
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] === Starting POST request ===")

    const formData = await request.formData()
    console.log("[v0] FormData received, keys:", Array.from(formData.keys()))

    const userPhoto = formData.get("userPhoto") as File
    const productImage = formData.get("productImage") as File
    const productName = formData.get("productName") as string
    const productCategory = formData.get("productCategory") as string

    console.log("[v0] Extracted data:")
    console.log("[v0] - userPhoto:", userPhoto?.name, userPhoto?.type, userPhoto?.size)
    console.log("[v0] - productImage:", productImage?.name, productImage?.type, productImage?.size)
    console.log("[v0] - productName:", productName)
    console.log("[v0] - productCategory:", productCategory)

    if (!userPhoto || !productImage || !productName) {
      console.log("[v0] Missing required fields")
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    console.log("[v0] Generating model image for:", productName)

    console.log("[v0] Converting user photo...")
    const convertedUserPhoto = await convertImageToSupportedFormat(userPhoto)
    console.log("[v0] User photo converted successfully")

    console.log("[v0] Converting product image...")
    const convertedProductImage = await convertImageToSupportedFormat(productImage)
    console.log("[v0] Product image converted successfully")

    const africanModelBase = `
CRITICAL - AFRICAN MODEL REQUIREMENT: The model MUST be a beautiful woman of African descent with dark/brown skin tone, natural African features (full lips, broad nose, high cheekbones, dark eyes), and authentic African hair texture (natural afro, braids, locs, twists, or other African hairstyles). This is a luxury African fashion brand - Trevor Storefront - and the model must authentically represent African beauty and elegance.

SKIN TONE CONSISTENCY: ALL visible skin areas (face, neck, arms, hands, legs, feet) must have consistent dark/brown African skin tone throughout the entire body. NEVER mix different skin tones - ensure perfect uniformity.

`

    let prompt = ""

    if (productName.includes("Vomero")) {
      prompt = `Create a professional product modeling photo showing a beautiful African woman model wearing the exact Nike ZoomX Vomero Plus running shoes from the product image. ${africanModelBase}

The shoes must be the specific Nike Vomero Plus model - lightweight running sneakers with ZoomX foam technology. Frame the shot to show the full body with clear focus on the feet and shoes. The model should be posed naturally in a running or athletic stance, exuding confidence and style.

The background should be a smooth dark gray gradient transitioning from darker gray at the top to lighter gray at the bottom, exactly like professional product photography studio backgrounds. Make it look like a high-quality advertisement photo showcasing specifically the Vomero Plus running shoes. IMPORTANT: Do not include any watermarks, logos, text overlays, or branding marks. Generate a clean, professional image.`
    } else if (productName.includes("Club Cap")) {
      prompt = `Create a professional product modeling photo showing a beautiful African woman model wearing the exact Nike Club Cap from the product image. ${africanModelBase}

The cap should be a classic Nike baseball cap with the Nike swoosh logo. Frame the shot from the chest up, focusing on the head and face area to showcase the cap clearly. The model should be posed naturally with confidence and elegance.

The background should be a smooth dark gray gradient transitioning from darker gray at the top to lighter gray at the bottom, exactly like professional product photography studio backgrounds. Make it look like a high-quality advertisement photo with a cropped, portrait-style framing. IMPORTANT: Do not include any watermarks, logos, text overlays, or branding marks. Generate a clean, professional image.`
    } else if (productName.includes("Tech Woven") || productName.includes("Tech")) {
      prompt = `Create a professional product modeling photo showing a beautiful African woman model wearing the exact Nike Tech Woven Pants from the product image. ${africanModelBase}

CRITICAL CLOTHING FIT REQUIREMENT: The pants MUST maintain the EXACT SAME loose, baggy, relaxed fit as shown in the reference product image. DO NOT make the pants fitted, skinny, or tapered - they should be loose and baggy exactly like the original Nike Tech design. Frame the shot to show the full body to showcase the pants clearly. The model should be posed naturally with confidence.

The background should be a smooth dark gray gradient transitioning from darker gray at the top to lighter gray at the bottom, exactly like professional product photography studio backgrounds. Make it look like a high-quality advertisement photo showcasing the tech pants with their original authentic loose, baggy fit. IMPORTANT: Do not include any watermarks, logos, text overlays, or branding marks. Generate a clean, professional image.`
    } else if (productName.includes("Fleece Hoodie") || productName.includes("Hoodie")) {
      prompt = `Create a professional product modeling photo showing a beautiful African woman model wearing the exact Nike Fleece Hoodie from the product image. ${africanModelBase}

CRITICAL CLOTHING FIT REQUIREMENT: The hoodie MUST maintain the EXACT SAME fit, proportions, and silhouette as shown in the reference product image. Frame the shot from the waist up to showcase the hoodie and upper body clearly. The model should be posed naturally with hands visible, exuding confidence and style.

The background should be a smooth dark gray gradient transitioning from darker gray at the top to lighter gray at the bottom, exactly like professional product photography studio backgrounds. Make it look like a high-quality advertisement photo with an upper body focus. IMPORTANT: Do not include any watermarks, logos, text overlays, or branding marks. Generate a clean, professional image.`
    } else if (
      productCategory.toLowerCase().includes("accessories") ||
      productCategory.toLowerCase().includes("cap") ||
      productCategory.toLowerCase().includes("hat")
    ) {
      prompt = `Create a professional product modeling photo showing a beautiful African woman model wearing the ${productName} from the product image. ${africanModelBase}

Frame the shot from the chest up, focusing on the head and face area to showcase the ${productCategory.toLowerCase()} clearly. The model should be posed naturally with elegance and confidence.

The background should be a smooth dark gray gradient transitioning from darker gray at the top to lighter gray at the bottom, exactly like professional product photography studio backgrounds. The ${productCategory.toLowerCase()} should fit naturally on the model and look realistic. Make it look like a high-quality advertisement photo with a cropped, portrait-style framing. IMPORTANT: Do not include any watermarks, logos, text overlays, or branding marks. Generate a clean, professional image.`
    } else if (
      productCategory.toLowerCase().includes("clothing") ||
      productCategory.toLowerCase().includes("hoodie") ||
      productCategory.toLowerCase().includes("shirt") ||
      productCategory.toLowerCase().includes("jacket") ||
      productCategory.toLowerCase().includes("dress") ||
      productCategory.toLowerCase().includes("top") ||
      productCategory.toLowerCase().includes("bottom")
    ) {
      prompt = `Create a professional product modeling photo showing a beautiful African woman model wearing the ${productName} from the product image. ${africanModelBase}

CRITICAL CLOTHING FIT REQUIREMENT: The ${productCategory.toLowerCase()} MUST maintain the EXACT SAME fit, cut, silhouette, and proportions as shown in the reference product image. Preserve the authentic garment proportions exactly as designed. Frame the shot appropriately to showcase the ${productCategory.toLowerCase()} clearly. The model should be posed naturally with hands visible, radiating confidence and African elegance.

The background should be a smooth dark gray gradient or elegant neutral setting like professional fashion photography. The ${productCategory.toLowerCase()} should fit naturally on the model with its original design characteristics preserved. Make it look like a high-quality African luxury fashion advertisement. IMPORTANT: Do not include any watermarks, logos, text overlays, or branding marks. Generate a clean, professional image.`
    } else {
      prompt = `Create a professional product modeling photo showing a beautiful African woman model wearing or using the ${productName} from the product image. ${africanModelBase}

CRITICAL CLOTHING FIT REQUIREMENT: If it's clothing, the garment MUST maintain the EXACT SAME loose/baggy or fitted characteristics as shown in the reference product image. Preserve the authentic garment design and proportions exactly as intended. The model should be posed naturally showcasing the product with confidence and elegance.

The background should be a smooth dark gray gradient transitioning from darker gray at the top to lighter gray at the bottom, exactly like professional product photography studio backgrounds. The ${productCategory.toLowerCase()} should fit naturally on the model with its original design characteristics preserved. Make it look like a high-quality African luxury fashion advertisement. IMPORTANT: Do not include any watermarks, logos, text overlays, or branding marks. Generate a clean, professional image.`
    }

    console.log("[v0] Generated prompt length:", prompt.length)
    console.log("[v0] Prompt preview:", prompt.substring(0, 100) + "...")

    console.log("[v0] Preparing to call generateImage...")
    const result = await generateImage({
      model: google.image("gemini-1.5-flash") as any,
      prompt: prompt,
    })

    console.log("[v0] generateImage completed")

    if (!result.image || !result.image.base64) {
      console.log("[v0] No image generated")
      return NextResponse.json({ error: "No image was generated" }, { status: 500 })
    }

    const base64Image = `data:image/png;base64,${result.image.base64}`
    console.log("[v0] Base64 image created")

    console.log("[v0] Successfully generated model image for:", productName)

    return NextResponse.json({
      imageUrl: base64Image,
      productName,
    })
  } catch (error) {
    console.error("[v0] Error in POST handler:", error)
    console.error("[v0] Error type:", typeof error)
    console.error("[v0] Error message:", error instanceof Error ? error.message : String(error))
    console.error("[v0] Error stack:", error instanceof Error ? error.stack : "No stack")
    return NextResponse.json({ error: "Failed to generate model image" }, { status: 500 })
  }
}
