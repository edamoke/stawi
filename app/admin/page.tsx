import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Package, ShoppingCart, Users, TrendingUp, DollarSign, ArrowRight, FileText, Calendar } from "lucide-react"

export default async function AdminDashboardPage() {
  await requireAdmin()
  const supabase = await createClient()

  // Fetch dashboard stats
  const [
    { count: productsCount },
    { count: ordersCount },
    { count: usersCount },
    { data: recentOrders },
    { data: recentUsers },
    { count: pendingOrdersCount },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select("id, email, full_name, total_amount, status, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("profiles").select("*").order("created_at", { ascending: false }).limit(5),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "pending"),
  ])

  // Calculate revenue
  const { data: ordersForRevenue } = await supabase.from("orders").select("total_amount").eq("payment_status", "paid")
  const totalRevenue = ordersForRevenue?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0

  const stats = [
    {
      title: "Total Revenue",
      value: `KES ${totalRevenue.toLocaleString()}`,
      icon: DollarSign,
      description: "From paid orders",
      trend: "+12.5%",
      trendUp: true,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Total Orders",
      value: ordersCount || 0,
      icon: ShoppingCart,
      description: `${pendingOrdersCount || 0} pending`,
      trend: "+8.2%",
      trendUp: true,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Total Users",
      value: usersCount || 0,
      icon: Users,
      description: "Registered accounts",
      trend: "+15.3%",
      trendUp: true,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Products",
      value: productsCount || 0,
      icon: Package,
      description: "Active in store",
      trend: "stable",
      trendUp: null,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ]

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { variant: "default" | "secondary" | "destructive" | "outline"; label: string }
    > = {
      pending: { variant: "secondary", label: "Pending" },
      processing: { variant: "default", label: "Processing" },
      completed: { variant: "outline", label: "Completed" },
      cancelled: { variant: "destructive", label: "Cancelled" },
      paid: { variant: "default", label: "Paid" },
      unpaid: { variant: "secondary", label: "Unpaid" },
    }
    const config = statusConfig[status] || { variant: "secondary", label: status }
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here&apos;s what&apos;s happening with Stawiafrika.</p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline">
            <Link href="/admin/products/new">
              <Package className="w-4 h-4 mr-2" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="relative overflow-hidden">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-muted-foreground">{stat.description}</p>
                  {stat.trendUp !== null && (
                    <span className={`text-xs flex items-center ${stat.trendUp ? "text-green-500" : "text-red-500"}`}>
                      <TrendingUp className={`w-3 h-3 mr-1 ${!stat.trendUp && "rotate-180"}`} />
                      {stat.trend}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Latest customer orders</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/orders">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders && recentOrders.length > 0 ? (
                recentOrders.map((order: any) => (
                  <div key={order.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <ShoppingCart className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{order.full_name || order.email || "Guest"}</p>
                        <p className="text-xs text-muted-foreground">KES {order.total_amount?.toLocaleString() || 0}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">{getStatusBadge(order.status)}</div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingCart className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p>No orders yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Users */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>New Users</CardTitle>
              <CardDescription>Recently registered accounts</CardDescription>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link href="/admin/users">
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers && recentUsers.length > 0 ? (
                recentUsers.map((user: any) => (
                  <div key={user.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-purple-500" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">{user.full_name || "No name"}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {user.is_admin && <Badge variant="default">Admin</Badge>}
                      <span className="text-xs text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="w-10 h-10 mx-auto mb-2 opacity-50" />
                  <p>No users yet</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/admin/cms" className="group">
          <Card className="transition-all hover:shadow-md hover:border-primary/50">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 rounded-lg bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors">
                <FileText className="w-6 h-6 text-indigo-500" />
              </div>
              <div>
                <h3 className="font-semibold">Content Manager</h3>
                <p className="text-sm text-muted-foreground">Edit homepage & content</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/products" className="group">
          <Card className="transition-all hover:shadow-md hover:border-primary/50">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 rounded-lg bg-orange-500/10 group-hover:bg-orange-500/20 transition-colors">
                <Package className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h3 className="font-semibold">Manage Products</h3>
                <p className="text-sm text-muted-foreground">Add, edit, or remove products</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/orders" className="group">
          <Card className="transition-all hover:shadow-md hover:border-primary/50">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors">
                <ShoppingCart className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold">View Orders</h3>
                <p className="text-sm text-muted-foreground">Process customer orders</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/admin/users" className="group">
          <Card className="transition-all hover:shadow-md hover:border-primary/50">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 rounded-lg bg-purple-500/10 group-hover:bg-purple-500/20 transition-colors">
                <Users className="w-6 h-6 text-purple-500" />
              </div>
              <div>
                <h3 className="font-semibold">Manage Users</h3>
                <p className="text-sm text-muted-foreground">View and manage accounts</p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/events" className="group">
          <Card className="transition-all hover:shadow-md hover:border-primary/50">
            <CardContent className="flex items-center gap-4 p-6">
              <div className="p-3 rounded-lg bg-red-500/10 group-hover:bg-red-500/20 transition-colors">
                <Calendar className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="font-semibold">Events Manager</h3>
                <p className="text-sm text-muted-foreground">Manage brand experiences</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
