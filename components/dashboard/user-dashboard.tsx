"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import {
  Heart,
  ShoppingBag,
  User,
  Settings,
  LogOut,
  Package,
  Sparkles,
  ChevronRight,
  Trash2,
  Menu,
  X,
  Search,
} from "lucide-react"
import { Footer } from "@/components/navigation/footer"

interface UserDashboardProps {
  user: { id: string; email?: string }
  profile: { full_name?: string; is_admin?: boolean } | null
  wishlists: Array<{
    id: string
    product_id: string
    products: {
      id: string
      name: string
      price: number
      image_url: string
    }
  }>
  orders: Array<{
    id: string
    total_amount: number
    status: string
    created_at: string
    order_items: Array<{
      quantity: number
      products: { name: string }
    }>
  }>
  tryons: Array<{
    id: string
    result_image_url: string
    created_at: string
  }>
}

type Tab = "overview" | "wishlist" | "orders" | "tryons" | "settings"

export function UserDashboard({ user, profile, wishlists, orders, tryons }: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>("overview")
  const [localWishlists, setLocalWishlists] = useState(wishlists)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  const removeFromWishlist = async (wishlistId: string) => {
    const supabase = createClient()
    await supabase.from("wishlists").delete().eq("id", wishlistId)
    setLocalWishlists((prev) => prev.filter((w) => w.id !== wishlistId))
  }

  const tabs = [
    { id: "overview", label: "Overview", icon: User },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "orders", label: "Orders", icon: Package },
    { id: "tryons", label: "Try-Ons", icon: Sparkles },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-[#E8E4DE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo - Updated from TREVOR to SULHAAFRIKA */}
            <Link href="/" className="flex-shrink-0">
              <h1 className="text-xl sm:text-2xl font-serif tracking-[0.2em] text-[#2C2420]">SULHAAFRIKA</h1>
            </Link>

            {/* Center Nav */}
            <nav className="hidden md:flex items-center gap-6 lg:gap-8">
              <Link
                href="/our-collection"
                className="text-xs tracking-[0.2em] text-[#2C2420] hover:text-[#8B4513] transition-colors"
              >
                COLLECTION
              </Link>
              <Link
                href="/dress-up"
                className="text-xs tracking-[0.2em] text-[#2C2420] hover:text-[#8B4513] transition-colors"
              >
                STYLE IT
              </Link>
              <Link
                href="/diary"
                className="text-xs tracking-[0.2em] text-[#2C2420] hover:text-[#8B4513] transition-colors"
              >
                JOURNAL
              </Link>
            </nav>

            {/* Right Icons */}
            <div className="flex items-center gap-4 sm:gap-5">
              <button className="text-[#2C2420] hover:text-[#8B4513] transition-colors hidden sm:block">
                <Search className="w-5 h-5" strokeWidth={1.5} />
              </button>
              <Link href="/dashboard" className="text-[#8B4513]">
                <Heart className="w-5 h-5" strokeWidth={1.5} />
              </Link>
              <button className="text-[#2C2420] hover:text-[#8B4513] transition-colors relative">
                <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#8B4513] text-white text-[10px] flex items-center justify-center rounded-full">
                  2
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 z-[100] lg:hidden transition-all duration-300 ${sidebarOpen ? "visible" : "invisible"}`}
      >
        <div
          className={`absolute inset-0 bg-black/50 transition-opacity duration-300 ${sidebarOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setSidebarOpen(false)}
        />
        <div
          className={`absolute left-0 top-0 bottom-0 w-72 bg-white transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="p-4">
            <button onClick={() => setSidebarOpen(false)} className="absolute top-4 right-4">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xs tracking-wider uppercase text-[#6B6560] mb-4 mt-8">My Account</h2>
            <ul className="space-y-1">
              {tabs.map((tab) => (
                <li key={tab.id}>
                  <button
                    onClick={() => {
                      setActiveTab(tab.id as Tab)
                      setSidebarOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-md text-sm transition-colors ${
                      activeTab === tab.id ? "bg-[#8B4513]/10 text-[#8B4513]" : "text-[#6B6560] hover:bg-[#F5F3F0]"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                    {tab.id === "wishlist" && localWishlists.length > 0 && (
                      <span className="ml-auto bg-[#8B4513] text-white text-xs px-2 py-0.5 rounded-full">
                        {localWishlists.length}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 border-r border-[#E8E4DE] bg-white">
          <div className="p-6 sticky top-[73px]">
            <div className="mb-6 pb-6 border-b border-[#E8E4DE]">
              <p className="text-sm text-[#6B6560]">Welcome back,</p>
              <p className="font-serif text-lg text-[#2C2420]">{profile?.full_name || user.email?.split("@")[0]}</p>
            </div>
            <h2 className="text-xs tracking-wider uppercase text-[#6B6560] mb-4">My Account</h2>
            <ul className="space-y-1">
              {tabs.map((tab) => (
                <li key={tab.id}>
                  <button
                    onClick={() => setActiveTab(tab.id as Tab)}
                    className={`w-full flex items-center gap-3 px-3 py-3 rounded-md text-sm transition-colors ${
                      activeTab === tab.id ? "bg-[#8B4513]/10 text-[#8B4513]" : "text-[#6B6560] hover:bg-[#F5F3F0]"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                    {tab.id === "wishlist" && localWishlists.length > 0 && (
                      <span className="ml-auto bg-[#8B4513] text-white text-xs px-2 py-0.5 rounded-full">
                        {localWishlists.length}
                      </span>
                    )}
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-6 border-t border-[#E8E4DE]">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-3 py-3 rounded-md text-sm text-[#6B6560] hover:bg-[#F5F3F0] hover:text-red-500 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {/* Mobile Tab Bar */}
          <div className="lg:hidden mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-sm text-[#6B6560]">Welcome back,</p>
                <p className="font-serif text-lg text-[#2C2420]">{profile?.full_name || user.email?.split("@")[0]}</p>
              </div>
              <button onClick={() => setSidebarOpen(true)} className="p-2 bg-white rounded-md border border-[#E8E4DE]">
                <Menu className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6 sm:space-y-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-serif mb-2">Dashboard</h1>
                <p className="text-[#6B6560]">Manage your account and explore your leather collection.</p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-white p-4 sm:p-6 rounded-lg border border-[#E8E4DE]">
                  <Heart className="w-5 h-5 text-[#8B4513] mb-2" />
                  <p className="text-2xl sm:text-3xl font-serif">{localWishlists.length}</p>
                  <p className="text-xs sm:text-sm text-[#6B6560]">Wishlist Items</p>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-lg border border-[#E8E4DE]">
                  <Package className="w-5 h-5 text-[#8B4513] mb-2" />
                  <p className="text-2xl sm:text-3xl font-serif">{orders.length}</p>
                  <p className="text-xs sm:text-sm text-[#6B6560]">Orders</p>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-lg border border-[#E8E4DE]">
                  <Sparkles className="w-5 h-5 text-[#8B4513] mb-2" />
                  <p className="text-2xl sm:text-3xl font-serif">{tryons.length}</p>
                  <p className="text-xs sm:text-sm text-[#6B6560]">Style Previews</p>
                </div>
                <div className="bg-white p-4 sm:p-6 rounded-lg border border-[#E8E4DE]">
                  <ShoppingBag className="w-5 h-5 text-[#8B4513] mb-2" />
                  <p className="text-2xl sm:text-3xl font-serif">
                    KES {orders.reduce((acc, o) => acc + o.total_amount, 0).toLocaleString()}
                  </p>
                  <p className="text-xs sm:text-sm text-[#6B6560]">Total Spent</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="grid sm:grid-cols-2 gap-4">
                <Link
                  href="/our-collection?sort=newest"
                  className="bg-[#2C2420] text-white p-6 rounded-lg flex items-center justify-between group hover:bg-[#3D322C] transition-colors"
                >
                  <div>
                    <h3 className="font-serif text-lg mb-1">New Arrivals</h3>
                    <p className="text-sm text-white/70">Browse latest bags</p>
                  </div>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/our-collection"
                  className="bg-[#8B4513] text-white p-6 rounded-lg flex items-center justify-between group hover:bg-[#A0522D] transition-colors"
                >
                  <div>
                    <h3 className="font-serif text-lg mb-1">Shop Collection</h3>
                    <p className="text-sm text-white/80">Discover new arrivals</p>
                  </div>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              {/* Recent Orders */}
              {orders.length > 0 && (
                <div>
                  <h2 className="text-xl font-serif mb-4">Recent Orders</h2>
                  <div className="bg-white rounded-lg border border-[#E8E4DE] divide-y divide-[#E8E4DE]">
                    {orders.slice(0, 3).map((order) => (
                      <div key={order.id} className="p-4 flex items-center justify-between">
                        <div>
                          <p className="font-medium text-sm">Order #{order.id.slice(0, 8)}</p>
                          <p className="text-xs text-[#6B6560]">
                            {new Date(order.created_at).toLocaleDateString()} •{" "}
                            {order.order_items.reduce((acc, i) => acc + i.quantity, 0)} items
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">KES {order.total_amount.toLocaleString()}</p>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              order.status === "delivered"
                                ? "bg-green-100 text-green-800"
                                : order.status === "shipped"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Wishlist Tab */}
          {activeTab === "wishlist" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-serif mb-2">My Wishlist</h1>
                <p className="text-[#6B6560]">Bags you&apos;ve saved for later.</p>
              </div>

              {localWishlists.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-[#E8E4DE]">
                  <Heart className="w-12 h-12 text-[#E8E4DE] mx-auto mb-4" />
                  <p className="text-[#6B6560] mb-4">Your wishlist is empty</p>
                  <Link
                    href="/our-collection"
                    className="inline-flex items-center gap-2 text-sm text-[#8B4513] hover:underline"
                  >
                    Browse Collection <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {localWishlists.map((item) => (
                    <div key={item.id} className="bg-white rounded-lg border border-[#E8E4DE] overflow-hidden group">
                      <div className="relative aspect-[3/4] bg-[#F5F3F0]">
                        <Image
                          src={item.products.image_url || "/placeholder.svg?height=400&width=300"}
                          alt={item.products.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          className="absolute top-3 right-3 p-2 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                      <div className="p-4">
                        <h3 className="font-medium text-sm mb-1 line-clamp-1">{item.products.name}</h3>
                        <p className="text-[#8B4513] font-medium">KES {item.products.price.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === "orders" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-serif mb-2">My Orders</h1>
                <p className="text-[#6B6560]">Track and manage your orders.</p>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-[#E8E4DE]">
                  <Package className="w-12 h-12 text-[#E8E4DE] mx-auto mb-4" />
                  <p className="text-[#6B6560] mb-4">No orders yet</p>
                  <Link
                    href="/our-collection"
                    className="inline-flex items-center gap-2 text-sm text-[#8B4513] hover:underline"
                  >
                    Start Shopping <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order) => (
                    <div key={order.id} className="bg-white rounded-lg border border-[#E8E4DE] p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                        <div>
                          <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                          <p className="text-sm text-[#6B6560]">{new Date(order.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          <span
                            className={`text-xs px-3 py-1 rounded-full ${
                              order.status === "delivered"
                                ? "bg-green-100 text-green-800"
                                : order.status === "shipped"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {order.status}
                          </span>
                          <p className="font-medium">KES {order.total_amount.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="border-t border-[#E8E4DE] pt-4">
                        <p className="text-sm text-[#6B6560]">
                          {order.order_items.map((i) => `${i.quantity}x ${i.products.name}`).join(", ")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Try-Ons Tab */}
          {activeTab === "tryons" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-serif mb-2">Style Previews</h1>
                <p className="text-[#6B6560]">Your saved bag styling previews.</p>
              </div>

              {tryons.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-[#E8E4DE]">
                  <Sparkles className="w-12 h-12 text-[#E8E4DE] mx-auto mb-4" />
                  <p className="text-[#6B6560] mb-4">No style previews yet</p>
                  <Link
                    href="/dress-up"
                    className="inline-flex items-center gap-2 text-sm text-[#8B4513] hover:underline"
                  >
                    Try Style It <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {tryons.map((tryon) => (
                    <div key={tryon.id} className="bg-white rounded-lg border border-[#E8E4DE] overflow-hidden">
                      <div className="relative aspect-[3/4] bg-[#F5F3F0]">
                        <Image
                          src={tryon.result_image_url || "/placeholder.svg?height=400&width=300"}
                          alt="Style preview"
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      </div>
                      <div className="p-3">
                        <p className="text-xs text-[#6B6560]">{new Date(tryon.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === "settings" && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-serif mb-2">Account Settings</h1>
                <p className="text-[#6B6560]">Manage your account preferences.</p>
              </div>

              <div className="bg-white rounded-lg border border-[#E8E4DE] p-6">
                <h2 className="font-medium mb-4">Profile Information</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-[#6B6560]">Email</label>
                    <p className="font-medium">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-[#6B6560]">Name</label>
                    <p className="font-medium">{profile?.full_name || "Not set"}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-[#E8E4DE] p-6">
                <h2 className="font-medium mb-4 text-red-600">Danger Zone</h2>
                <p className="text-sm text-[#6B6560] mb-4">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button variant="destructive" size="sm">
                  Delete Account
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  )
}
