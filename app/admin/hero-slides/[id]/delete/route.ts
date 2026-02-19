import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function POST(request: Request, { params }: { params: { id: string } }) {
  await requireAdmin()
  const supabase = await createClient()

  const { error } = await supabase.from("hero_slides").delete().eq("id", params.id)

  if (error) {
    console.error("Error deleting slide:", error)
  }

  redirect("/admin/hero-slides")
}
