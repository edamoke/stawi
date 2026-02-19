import { requireAdmin } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Store, Bell, Shield, Database, Globe } from "lucide-react"
import { getSiteSettings } from "@/lib/actions/settings"
import { PesapalSettingsForm } from "@/components/admin/pesapal-settings-form"
import { ShippingSettingsForm } from "@/components/admin/shipping-settings-form"

export default async function AdminSettingsPage() {
  await requireAdmin()
  const pesapalSettings = await getSiteSettings("pesapal_settings")
  const shippingSettings = await getSiteSettings("shipping_settings")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your store configuration and preferences</p>
      </div>

      <div className="grid gap-6">
        {/* Store Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Store className="w-5 h-5 text-[#8B4513]" />
              <CardTitle>Store Settings</CardTitle>
            </div>
            <CardDescription>General store configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input id="storeName" defaultValue="Sulhaafrika" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeEmail">Contact Email</Label>
                <Input id="storeEmail" type="email" defaultValue="hello@sulhaafrika.co.ke" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input id="currency" defaultValue="KES" disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input id="timezone" defaultValue="Africa/Nairobi" disabled />
              </div>
            </div>
            <Button className="bg-[#8B4513] hover:bg-[#A0522D] text-white">Save Store Settings</Button>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-blue-500" />
              <CardTitle>Notifications</CardTitle>
            </div>
            <CardDescription>Configure email and push notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>New Order Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive email when a new order is placed</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Low Stock Alerts</Label>
                <p className="text-sm text-muted-foreground">Get notified when products are running low</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>New User Registration</Label>
                <p className="text-sm text-muted-foreground">Receive email when a new user signs up</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              <CardTitle>Security</CardTitle>
            </div>
            <CardDescription>Security and authentication settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">Add an extra layer of security to admin accounts</p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Session Timeout</Label>
                <p className="text-sm text-muted-foreground">Automatically log out after 30 minutes of inactivity</p>
              </div>
              <Switch defaultChecked />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Login Attempt Logging</Label>
                <p className="text-sm text-muted-foreground">Log all admin login attempts for security audit</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Pesapal Settings */}
        <PesapalSettingsForm initialSettings={pesapalSettings} />

        {/* Shipping Settings */}
        <ShippingSettingsForm initialSettings={shippingSettings} />

        {/* API & Integrations */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Database className="w-5 h-5 text-purple-500" />
              <CardTitle>API & Integrations</CardTitle>
            </div>
            <CardDescription>Connected services and API configurations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Database className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="font-medium">Supabase</p>
                  <p className="text-sm text-muted-foreground">Database & Authentication</p>
                </div>
              </div>
              <span className="text-sm text-green-500 font-medium">Connected</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium">Google OAuth</p>
                  <p className="text-sm text-muted-foreground">Social Login</p>
                </div>
              </div>
              <span className="text-sm text-green-500 font-medium">Connected</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
