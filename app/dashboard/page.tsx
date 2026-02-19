import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { UserDashboard } from "@/components/dashboard/user-dashboard"

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is admin - redirect to admin dashboard
  const { data: profile } = await supabase.from("profiles").select("is_admin, full_name").eq("id", user.id).single()

  if (profile?.is_admin) {
    redirect("/admin")
  }

  // Fetch user's wishlists
  const { data: wishlists } = await supabase.from("wishlists").select("*, products(*)").eq("user_id", user.id)

  // Fetch user's orders
  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(*, products(*))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  // Fetch user's virtual try-ons
  const { data: tryons } = await supabase
    .from("virtual_tryons")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(6)

  return (
    <UserDashboard
      user={user}
      profile={profile}
      wishlists={wishlists || []}
      orders={orders || []}
      tryons={tryons || []}
    />
  )
}
