import { requireAdmin } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Package, AlertTriangle, TrendingDown, CheckCircle, Download, Upload } from "lucide-react"
import Link from "next/link"

export default async function InventoryPage() {
  await requireAdmin()
  const supabase = await createClient()

  const { data: products } = await supabase
    .from("products")
    .select(`*, categories (name)`)
    .order("stock_quantity", { ascending: true })

  const allProducts = products || []
  const outOfStock = allProducts.filter((p) => p.stock_quantity === 0)
  const lowStock = allProducts.filter((p) => p.stock_quantity > 0 && p.stock_quantity <= 10)
  const inStock = allProducts.filter((p) => p.stock_quantity > 10)
  const totalValue = allProducts.reduce((sum, p) => sum + p.price * p.stock_quantity, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventory Management</h1>
          <p className="text-muted-foreground">Track and manage your product stock levels</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{allProducts.length}</div>
            <p className="text-xs text-muted-foreground">Across all categories</p>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-red-700">Out of Stock</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-700">{outOfStock.length}</div>
            <p className="text-xs text-red-600">Requires immediate attention</p>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-amber-700">Low Stock</CardTitle>
            <TrendingDown className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-700">{lowStock.length}</div>
            <p className="text-xs text-amber-600">Below 10 units</p>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-700">In Stock</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-700">{inStock.length}</div>
            <p className="text-xs text-green-600">Well stocked</p>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Value */}
      <Card>
        <CardHeader>
          <CardTitle>Inventory Value</CardTitle>
          <CardDescription>Total value of all products in stock</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold">KSh {totalValue.toLocaleString()}</div>
          <p className="text-muted-foreground mt-1">
            Based on {allProducts.reduce((sum, p) => sum + p.stock_quantity, 0)} total units
          </p>
        </CardContent>
      </Card>

      {/* Out of Stock Alert */}
      {outOfStock.length > 0 && (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-700 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Out of Stock Products
            </CardTitle>
            <CardDescription>These products need to be restocked immediately</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {outOfStock.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {product.images && product.images[0] && (
                      <img
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    )}
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.categories?.name || "Uncategorized"}</p>
                    </div>
                  </div>
                  <Button size="sm" asChild>
                    <Link href={`/admin/products/${product.id}`}>Restock</Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Low Stock Warning */}
      {lowStock.length > 0 && (
        <Card className="border-amber-200">
          <CardHeader>
            <CardTitle className="text-amber-700 flex items-center gap-2">
              <TrendingDown className="h-5 w-5" />
              Low Stock Warning
            </CardTitle>
            <CardDescription>These products are running low and should be restocked soon</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStock.map((product) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {product.images && product.images[0] && (
                      <img
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        className="w-10 h-10 object-cover rounded"
                      />
                    )}
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">{product.stock_quantity} units remaining</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/admin/products/${product.id}`}>Update Stock</Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Full Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
          <CardDescription>Complete inventory overview</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Value</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {product.images && product.images[0] && (
                        <img
                          src={product.images[0] || "/placeholder.svg"}
                          alt={product.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                      )}
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{product.categories?.name || "Uncategorized"}</TableCell>
                  <TableCell>KSh {product.price.toLocaleString()}</TableCell>
                  <TableCell>{product.stock_quantity}</TableCell>
                  <TableCell>KSh {(product.price * product.stock_quantity).toLocaleString()}</TableCell>
                  <TableCell>
                    {product.stock_quantity === 0 ? (
                      <Badge variant="destructive">Out of Stock</Badge>
                    ) : product.stock_quantity <= 10 ? (
                      <Badge variant="secondary" className="bg-amber-100 text-amber-800">
                        Low Stock
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        In Stock
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost" asChild>
                      <Link href={`/admin/products/${product.id}`}>Edit</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
