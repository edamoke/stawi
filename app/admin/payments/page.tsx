import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DollarSign, CreditCard, Clock, CheckCircle, XCircle, TrendingUp, Download, RefreshCw, Eye } from "lucide-react"

export default async function PaymentsPage() {
  await requireAdmin()
  const supabase = await createClient()

  const { data: orders } = await supabase
    .from("orders")
    .select(`
      *,
      profiles (email, full_name)
    `)
    .order("created_at", { ascending: false })

  const allOrders = orders || []

  // Payment Statistics
  const totalRevenue = allOrders
    .filter((o) => o.payment_status === "paid")
    .reduce((sum, o) => sum + Number(o.total_amount), 0)

  const pendingPayments = allOrders.filter((o) => o.payment_status === "pending")
  const pendingAmount = pendingPayments.reduce((sum, o) => sum + Number(o.total_amount), 0)

  const failedPayments = allOrders.filter((o) => o.payment_status === "failed")
  const refundedPayments = allOrders.filter((o) => o.payment_status === "refunded")
  const completedPayments = allOrders.filter((o) => o.payment_status === "paid")

  // Calculate this month's revenue
  const now = new Date()
  const thisMonth = allOrders.filter((o) => {
    const orderDate = new Date(o.created_at)
    return (
      orderDate.getMonth() === now.getMonth() &&
      orderDate.getFullYear() === now.getFullYear() &&
      o.payment_status === "paid"
    )
  })
  const thisMonthRevenue = thisMonth.reduce((sum, o) => sum + Number(o.total_amount), 0)

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800">Paid</Badge>
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800">Pending</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      case "refunded":
        return <Badge variant="secondary">Refunded</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getPaymentMethodIcon = (method: string | null) => {
    switch (method) {
      case "mpesa":
        return "M-Pesa"
      case "card":
        return "Card"
      case "bank":
        return "Bank Transfer"
      default:
        return method || "Unknown"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payment Management</h1>
          <p className="text-muted-foreground">Track payments, refunds, and revenue</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Sync Payments
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">KSh {totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-green-600">{completedPayments.length} successful payments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KSh {thisMonthRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{thisMonth.length} orders</p>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700">KSh {pendingAmount.toLocaleString()}</div>
            <p className="text-xs text-amber-600">{pendingPayments.length} awaiting payment</p>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Failed/Refunded</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{failedPayments.length + refundedPayments.length}</div>
            <p className="text-xs text-red-600">
              {failedPayments.length} failed, {refundedPayments.length} refunded
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Payment Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Transactions ({allOrders.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingPayments.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedPayments.length})</TabsTrigger>
          <TabsTrigger value="failed">Failed ({failedPayments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Transactions</CardTitle>
              <CardDescription>Complete payment history</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {allOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center text-muted-foreground py-8">
                        No transactions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    allOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-sm">{order.id.slice(0, 8)}...</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{order.profiles?.full_name || "Guest"}</p>
                            <p className="text-sm text-muted-foreground">{order.profiles?.email}</p>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">KSh {Number(order.total_amount).toLocaleString()}</TableCell>
                        <TableCell>{getPaymentMethodIcon(order.payment_method)}</TableCell>
                        <TableCell>{getPaymentStatusBadge(order.payment_status)}</TableCell>
                        <TableCell className="font-mono text-sm">{order.payment_reference || "-"}</TableCell>
                        <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-600" />
                Pending Payments
              </CardTitle>
              <CardDescription>Orders awaiting payment confirmation</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingPayments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <p>No pending payments</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingPayments.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 border rounded-lg bg-amber-50/50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center">
                          <Clock className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <p className="font-medium">{order.profiles?.full_name || "Guest"}</p>
                          <p className="text-sm text-muted-foreground">
                            Order #{order.id.slice(0, 8)} - {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">KSh {Number(order.total_amount).toLocaleString()}</p>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="outline">
                            Send Reminder
                          </Button>
                          <Button size="sm">Mark as Paid</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completed">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Completed Payments
              </CardTitle>
              <CardDescription>Successfully processed payments</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Reference</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedPayments.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-sm">{order.id.slice(0, 8)}...</TableCell>
                      <TableCell>{order.profiles?.full_name || "Guest"}</TableCell>
                      <TableCell className="font-medium text-green-700">
                        KSh {Number(order.total_amount).toLocaleString()}
                      </TableCell>
                      <TableCell>{getPaymentMethodIcon(order.payment_method)}</TableCell>
                      <TableCell className="font-mono text-sm">{order.payment_reference || "-"}</TableCell>
                      <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="outline">
                          Refund
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="failed">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600" />
                Failed Payments
              </CardTitle>
              <CardDescription>Payments that could not be processed</CardDescription>
            </CardHeader>
            <CardContent>
              {failedPayments.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <CheckCircle className="h-12 w-12 mx-auto mb-4 text-green-500" />
                  <p>No failed payments</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {failedPayments.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50/50"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                          <XCircle className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <p className="font-medium">{order.profiles?.full_name || "Guest"}</p>
                          <p className="text-sm text-muted-foreground">
                            Order #{order.id.slice(0, 8)} - {new Date(order.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-red-700">KSh {Number(order.total_amount).toLocaleString()}</p>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" variant="outline">
                            Contact Customer
                          </Button>
                          <Button size="sm">Retry Payment</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Payment Methods Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Payment Methods</CardTitle>
          <CardDescription>Breakdown by payment method</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="font-bold text-green-700">M</span>
                </div>
                <div>
                  <p className="font-medium">M-Pesa</p>
                  <p className="text-sm text-muted-foreground">Mobile Money</p>
                </div>
              </div>
              <p className="text-2xl font-bold">
                {allOrders.filter((o) => o.payment_method === "mpesa").length} transactions
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <CreditCard className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <p className="font-medium">Card Payments</p>
                  <p className="text-sm text-muted-foreground">Visa, Mastercard</p>
                </div>
              </div>
              <p className="text-2xl font-bold">
                {allOrders.filter((o) => o.payment_method === "card").length} transactions
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                  <DollarSign className="h-5 w-5 text-purple-700" />
                </div>
                <div>
                  <p className="font-medium">Bank Transfer</p>
                  <p className="text-sm text-muted-foreground">Direct deposit</p>
                </div>
              </div>
              <p className="text-2xl font-bold">
                {allOrders.filter((o) => o.payment_method === "bank").length} transactions
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
