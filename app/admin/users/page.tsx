import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Users, Shield, ShoppingCart, Shirt, UserCheck, MoreHorizontal } from "lucide-react"
import { UserActions } from "@/components/admin/user-actions"

export default async function AdminUsersPage() {
  await requireAdmin()
  const supabase = await createClient()

  const { data: users } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

  // Get order counts per user
  const { data: orderCounts } = await supabase.from("orders").select("user_id")

  // Get try-on counts per user
  const { data: tryonCounts } = await supabase.from("virtual_tryons").select("user_id")

  const userOrderCounts =
    orderCounts?.reduce((acc: Record<string, number>, order) => {
      acc[order.user_id] = (acc[order.user_id] || 0) + 1
      return acc
    }, {}) || {}

  const userTryonCounts =
    tryonCounts?.reduce((acc: Record<string, number>, tryon) => {
      acc[tryon.user_id] = (acc[tryon.user_id] || 0) + 1
      return acc
    }, {}) || {}

  const adminCount = users?.filter((u) => u.is_admin).length || 0
  const regularCount = users?.filter((u) => !u.is_admin).length || 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Users</h1>
          <p className="text-muted-foreground">Manage user accounts and permissions</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Shield className="h-4 w-4 text-[#C9A86C]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Customers</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{regularCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Today</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {users?.filter((u) => {
                const today = new Date()
                const userDate = new Date(u.updated_at || u.created_at)
                return userDate.toDateString() === today.toDateString()
              }).length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>View and manage all registered users</CardDescription>
        </CardHeader>
        <CardContent>
          {users && users.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Orders</TableHead>
                  <TableHead>Try-Ons</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user: any) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          {user.is_admin ? (
                            <Shield className="w-5 h-5 text-[#C9A86C]" />
                          ) : (
                            <Users className="w-5 h-5 text-primary" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{user.full_name || "No name"}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {user.is_admin ? (
                          <Badge className="bg-[#C9A86C] text-[#2C2420] w-fit">Admin</Badge>
                        ) : (
                          <Badge variant="secondary" className="w-fit">
                            Customer
                          </Badge>
                        )}
                        {user.is_suspended && (
                          <Badge variant="destructive" className="w-fit">
                            Suspended
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <ShoppingCart className="w-4 h-4 text-muted-foreground" />
                        <span>{userOrderCounts[user.id] || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Shirt className="w-4 h-4 text-muted-foreground" />
                        <span>{userTryonCounts[user.id] || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(user.updated_at || user.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <UserActions user={user} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No users yet</p>
              <p className="text-sm">Users will appear here when they register</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
