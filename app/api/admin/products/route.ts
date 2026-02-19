import { createAdminClient } from "@/lib/supabase/admin"
import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error("Unauthorized")
  }

  const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()

  if (!profile?.is_admin) {
    throw new Error("Admin access required")
  }

  return user
}

// GET all products
export async function GET() {
  try {
    await requireAdmin()
    const supabase = createAdminClient()

    const { data: products, error } = await supabase
      .from("products")
      .select("*, categories(id, name)")
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json({ products })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch products" },
      { status: 500 },
    )
  }
}

// POST create product
export async function POST(request: Request) {
  try {
    await requireAdmin()
    const body = await request.json()
    const supabase = createAdminClient()

    const { data: product, error } = await supabase.from("products").insert([body]).select().single()

    if (error) throw error

    return NextResponse.json({ product }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create product" },
      { status: 500 },
    )
  }
}
