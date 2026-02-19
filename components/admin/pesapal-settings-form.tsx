"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Loader2, Database } from "lucide-react"
import { updateSiteSettings } from "@/lib/actions/settings"
import { toast } from "sonner"

interface PesapalSettings {
  consumer_key: string
  consumer_secret: string
  is_sandbox: boolean
  ipn_id: string
}

interface PesapalSettingsFormProps {
  initialSettings: PesapalSettings
}

export function PesapalSettingsForm({ initialSettings }: PesapalSettingsFormProps) {
  const [settings, setSettings] = useState<PesapalSettings>(initialSettings || {
    consumer_key: "",
    consumer_secret: "",
    is_sandbox: true,
    ipn_id: ""
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    try {
      await updateSiteSettings("pesapal_settings", settings)
      toast.success("Pesapal settings updated successfully")
    } catch (error: any) {
      toast.error(error.message || "Failed to update settings")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-purple-500" />
          <CardTitle>Pesapal Integration</CardTitle>
        </div>
        <CardDescription>Configure your Pesapal payment gateway credentials</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="space-y-2">
            <Label htmlFor="consumerKey">Consumer Key</Label>
            <Input
              id="consumerKey"
              value={settings.consumer_key}
              onChange={(e) => setSettings({ ...settings, consumer_key: e.target.value })}
              placeholder="Enter your Pesapal Consumer Key"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="consumerSecret">Consumer Secret</Label>
            <Input
              id="consumerSecret"
              type="password"
              value={settings.consumer_secret}
              onChange={(e) => setSettings({ ...settings, consumer_secret: e.target.value })}
              placeholder="Enter your Pesapal Consumer Secret"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="ipnId">IPN ID (Optional)</Label>
            <Input
              id="ipnId"
              value={settings.ipn_id}
              onChange={(e) => setSettings({ ...settings, ipn_id: e.target.value })}
              placeholder="Your Pesapal IPN ID"
            />
            <p className="text-xs text-muted-foreground">
              You can get this from your Pesapal dashboard after registering an IPN URL.
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Sandbox Mode</Label>
              <p className="text-sm text-muted-foreground">Use Pesapal sandbox environment for testing</p>
            </div>
            <Switch
              checked={settings.is_sandbox}
              onCheckedChange={(checked) => setSettings({ ...settings, is_sandbox: checked })}
            />
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={isLoading}
          className="bg-[#8B4513] hover:bg-[#A0522D] text-white"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Pesapal Settings"
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
