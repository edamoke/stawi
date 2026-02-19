"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { uploadImage } from "@/lib/supabase/storage"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, Calendar, MapPin, Users, DollarSign } from "lucide-react"
import { ImageUpload } from "./image-upload"
import { createEvent, updateEvent } from "@/lib/actions/events"

interface Event {
  id?: string
  title: string
  slug: string
  description: string | null
  long_description: string | null
  image_url: string | null
  event_date: string
  end_date: string | null
  location: string | null
  venue: string | null
  max_attendees: number | null
  price: number
  is_free: boolean
  is_published: boolean
  is_featured: boolean
  category: string | null
  tags: string[]
}

interface EventFormProps {
  event?: Event
}

export function EventForm({ event }: EventFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("basic")

  const [formData, setFormData] = useState({
    title: event?.title || "",
    slug: event?.slug || "",
    description: event?.description || "",
    long_description: event?.long_description || "",
    image_url: event?.image_url || "",
    event_date: event?.event_date ? new Date(event.event_date).toISOString().slice(0, 16) : "",
    end_date: event?.end_date ? new Date(event.end_date).toISOString().slice(0, 16) : "",
    location: event?.location || "",
    venue: event?.venue || "",
    max_attendees: event?.max_attendees || 0,
    price: event?.price || 0,
    is_free: event?.is_free ?? true,
    is_published: event?.is_published ?? false,
    is_featured: event?.is_featured ?? false,
    category: event?.category || "",
    tags: event?.tags || [],
  })

  const [tagInput, setTagInput] = useState("")

  const handleImageUpload = async (file: File): Promise<string> => {
    const url = await uploadImage("events", file)
    setFormData({ ...formData, image_url: url })
    return url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const submitData = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "tags") {
          submitData.append(key, JSON.stringify(value))
        } else {
          submitData.append(key, value?.toString() || "")
        }
      })

      const result = event?.id ? await updateEvent(event.id, submitData) : await createEvent(submitData)

      if (result.error) {
        setError(result.error)
      } else {
        router.push("/admin/events")
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] })
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((t) => t !== tag) })
  }

  return (
    <form onSubmit={handleSubmit}>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Basic Info
          </TabsTrigger>
          <TabsTrigger value="details" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Details
          </TabsTrigger>
          <TabsTrigger value="capacity" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Capacity
          </TabsTrigger>
          <TabsTrigger value="pricing" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Pricing
          </TabsTrigger>
        </TabsList>

        {/* Basic Info Tab */}
        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Enter the basic details about your event</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    required
                    placeholder="e.g., Ngozi Collection Launch"
                    value={formData.title}
                    onChange={(e) => {
                      setFormData({ ...formData, title: e.target.value, slug: generateSlug(e.target.value) })
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug">URL Slug *</Label>
                  <Input
                    id="slug"
                    required
                    placeholder="ngozi-collection-launch"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">URL: /events/{formData.slug || "event-slug"}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Short Description *</Label>
                <Textarea
                  id="description"
                  rows={3}
                  required
                  placeholder="Brief description of the event..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="long_description">Full Description</Label>
                <Textarea
                  id="long_description"
                  rows={6}
                  placeholder="Detailed event information, agenda, speakers, etc..."
                  value={formData.long_description}
                  onChange={(e) => setFormData({ ...formData, long_description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Event Image</Label>
                <ImageUpload
                  onUpload={handleImageUpload}
                  currentImage={formData.image_url}
                  label="Upload Event Image"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label htmlFor="is_published">Publish Event</Label>
                    <p className="text-sm text-muted-foreground">
                      {formData.is_published ? "Event is visible to public" : "Event is in draft mode"}
                    </p>
                  </div>
                  <Switch
                    id="is_published"
                    checked={formData.is_published}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_published: checked })}
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label htmlFor="is_featured">Feature Event</Label>
                    <p className="text-sm text-muted-foreground">
                      {formData.is_featured ? "Show on homepage" : "Not featured"}
                    </p>
                  </div>
                  <Switch
                    id="is_featured"
                    checked={formData.is_featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_featured: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Details Tab */}
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
              <CardDescription>Specify when and where the event will take place</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="event_date">Start Date & Time *</Label>
                  <Input
                    id="event_date"
                    type="datetime-local"
                    required
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date & Time</Label>
                  <Input
                    id="end_date"
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    required
                    placeholder="e.g., Nairobi, Kenya"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="venue">Venue</Label>
                  <Input
                    id="venue"
                    placeholder="e.g., Sarit Centre, 2nd Floor"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  placeholder="e.g., Workshop, Launch Event, Fashion Show"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <div className="flex gap-2">
                  <Input
                    id="tags"
                    placeholder="Add a tag"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addTag()
                      }
                    }}
                  />
                  <Button type="button" variant="outline" onClick={addTag}>
                    Add
                  </Button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                      >
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="hover:text-destructive">
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Capacity Tab */}
        <TabsContent value="capacity">
          <Card>
            <CardHeader>
              <CardTitle>Event Capacity</CardTitle>
              <CardDescription>Set the maximum number of attendees</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="max_attendees">Maximum Attendees</Label>
                <Input
                  id="max_attendees"
                  type="number"
                  min="0"
                  placeholder="Leave empty for unlimited"
                  value={formData.max_attendees}
                  onChange={(e) =>
                    setFormData({ ...formData, max_attendees: e.target.value ? Number(e.target.value) : ("" as any) })
                  }
                />
                <p className="text-sm text-muted-foreground">
                  {formData.max_attendees
                    ? `Event limited to ${formData.max_attendees} attendees`
                    : "Unlimited attendees"}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pricing Tab */}
        <TabsContent value="pricing">
          <Card>
            <CardHeader>
              <CardTitle>Event Pricing</CardTitle>
              <CardDescription>Set the ticket price for your event</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="space-y-0.5">
                  <Label htmlFor="is_free">Free Event</Label>
                  <p className="text-sm text-muted-foreground">
                    {formData.is_free ? "No charge for attendees" : "Paid event"}
                  </p>
                </div>
                <Switch
                  id="is_free"
                  checked={formData.is_free}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_free: checked, price: checked ? 0 : formData.price })
                  }
                />
              </div>

              {!formData.is_free && (
                <div className="space-y-2">
                  <Label htmlFor="price">Ticket Price (KSh)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">KSh</span>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      min="0"
                      className="pl-12"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-4 mt-6 bg-red-50 border border-red-200 rounded-lg text-red-800">
          <AlertCircle className="h-5 w-5" />
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Form Actions */}
      <div className="flex items-center justify-between mt-6 pt-6 border-t">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : event ? "Update Event" : "Create Event"}
        </Button>
      </div>
    </form>
  )
}
