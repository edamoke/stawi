"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Truck, Loader2 } from "lucide-react"
import { updateSiteSettings } from "@/lib/actions/settings"
import { toast } from "@/hooks/use-toast"

interface ShippingSettings {
  fee: number
  freeThreshold: number
}

interface ShippingSettingsFormProps {
  initialSettings: ShippingSettings | null
}

export function ShippingSettingsForm({ initialSettings }: ShippingSettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState<ShippingSettings>(
    initialSettings || {
      fee: 500,
      freeThreshold: 15000,
    },
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await updateSiteSettings("shipping_settings", settings)
      toast({
        title: "Settings updated",
        description: "Shipping settings have been saved successfully.",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update settings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Truck className="w-5 h-5 text-orange-500" />
          <CardTitle>Shipping Settings</CardTitle>
        </div>
        <CardDescription>Configure delivery fees and free shipping thresholds</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="shippingFee">Standard Delivery Fee (KSh)</Label>
              <Input
                id="shippingFee"
                type="number"
                value={settings.fee}
                onChange={(e) => setSettings((prev) => ({ ...prev, fee: Number(e.target.value) }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="freeThreshold">Free Shipping Threshold (KSh)</Label>
              <Input
                id="freeThreshold"
                type="number"
                value={settings.freeThreshold}
                onChange={(e) => setSettings((prev) => ({ ...prev, freeThreshold: Number(e.target.value) }))}
              />
            </div>
          </div>
          <Button type="submit" className="bg-[#8B4513] hover:bg-[#A0522D] text-white" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Shipping Settings"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
