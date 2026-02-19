"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ImageUpload } from "@/components/admin/image-upload"
import { useToast } from "@/hooks/use-toast"

type Event = {
  id?: string
  title: string
  slug: string
  description: string
  location: string
  event_date: string
  event_time: string
  end_time: string
  capacity: number
  price: number
  image_url: string
  category: string
  is_active: boolean
  long_description?: string
  is_free: boolean
  venue?: string
  city_id?: string
}

export function EventForm({ event }: { event?: Event }) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [cities, setCities] = useState<any[]>([])
  const [formData, setFormData] = useState<Event>({
    title: event?.title || "",
    slug: event?.slug || "",
    description: event?.description || "",
    long_description: event?.long_description || "",
    location: event?.location || "",
    venue: event?.venue || "",
    event_date: event?.event_date || "",
    event_time: event?.event_time || "",
    end_time: event?.end_time || "",
    capacity: event?.capacity || 0,
    price: event?.price || 0,
    is_free: event?.is_free ?? true,
    image_url: event?.image_url || "",
    category: event?.category || "",
    is_active: event?.is_active ?? true,
    city_id: event?.city_id || "",
  })

  useEffect(() => {
    async function fetchCities() {
      const supabase = createClient()
      const { data } = await supabase
        .from("cities")
        .select("id, name")
        .eq("is_active", true)
        .order("name")
      
      if (data) setCities(data)
    }
    fetchCities()
  }, [])

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: event?.slug || generateSlug(title),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = event?.id 
        ? `/api/admin/events/${event.id}` 
        : '/api/admin/events'
      
      const method = event?.id ? 'PATCH' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to ${event?.id ? 'update' : 'create'} event`)
      }

      toast({
        title: "Success",
        description: `Event ${event?.id ? 'updated' : 'created'} successfully`,
      })

      router.push("/admin/events")
      router.refresh()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Event Details</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Event Title *</Label>
              <Input id="title" value={formData.title} onChange={(e) => handleTitleChange(e.target.value)} required />
            </div>
            <div>
              <Label htmlFor="slug">URL Slug *</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="city">City (For Sensations Page) *</Label>
              <Select
                value={formData.city_id}
                onValueChange={(value) => setFormData({ ...formData, city_id: value })}
              >
                <SelectTrigger id="city">
                  <SelectValue placeholder="Select a city" />
                </SelectTrigger>
                <SelectContent>
                  {cities.map((city) => (
                    <SelectItem key={city.id} value={city.id}>
                      {city.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="location">Exact Location/Address *</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
                placeholder="e.g. Shela Beach, Lamu"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="venue">Venue Details</Label>
            <Input
              id="venue"
              value={formData.venue}
              onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
              placeholder="Hotel name, Hall, specific spot, etc."
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="Workshop, Conference, Webinar, etc."
            />
          </div>

          <div>
            <Label htmlFor="long_description">Long Description (Details)</Label>
            <Textarea
              id="long_description"
              value={formData.long_description}
              onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
              rows={8}
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Date & Time</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="event_date">Event Date *</Label>
            <Input
              id="event_date"
              type="date"
              value={formData.event_date}
              onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="event_time">Start Time *</Label>
            <Input
              id="event_time"
              type="time"
              value={formData.event_time}
              onChange={(e) => setFormData({ ...formData, event_time: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="end_time">End Time</Label>
            <Input
              id="end_time"
              type="time"
              value={formData.end_time}
              onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
            />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Capacity & Pricing</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="capacity">Capacity *</Label>
            <Input
              id="capacity"
              type="number"
              min="0"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: Number.parseInt(e.target.value) })}
              required
            />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="is_free">Free Event</Label>
              <Switch
                id="is_free"
                checked={formData.is_free}
                onCheckedChange={(checked) => setFormData({ ...formData, is_free: checked, price: checked ? 0 : formData.price })}
              />
            </div>
            {!formData.is_free && (
              <div>
                <Label htmlFor="price">Price (KSh)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) })}
                />
              </div>
            )}
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Event Image</h2>
        <ImageUpload
          currentImage={formData.image_url}
          onUpload={async (file) => {
            const supabase = createClient()
            const fileExt = file.name.split('.').pop()
            const fileName = `${Math.random()}.${fileExt}`
            const filePath = `events/${fileName}`

            const { error: uploadError } = await supabase.storage
              .from("content")
              .upload(filePath, file)

            if (uploadError) throw uploadError

            const { data: { publicUrl } } = supabase.storage
              .from("content")
              .getPublicUrl(filePath)

            setFormData({ ...formData, image_url: publicUrl })
            return publicUrl
          }}
        />
      </Card>

      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="is_active">Event Status</Label>
            <p className="text-sm text-muted-foreground">Active events are visible to the public</p>
          </div>
          <Switch
            id="is_active"
            checked={formData.is_active}
            onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
          />
        </div>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.push("/admin/events")}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : event ? "Update Event" : "Create Event"}
        </Button>
      </div>
    </form>
  )
}
