"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2 } from "lucide-react"
import { ImageUpload } from "@/components/admin/image-upload"
import { uploadImage } from "@/lib/supabase/storage"

type ContentBlock = {
  id?: string
  row_number: number
  column_number: number
  columns_in_row: number
  image_url: string
  heading: string
  text_content: string
  link_url: string
  link_text: string
}

type ContentSection = {
  id?: string
  section_key: string
  section_type: string
  title: string
  subtitle: string
  display_order: number
  is_active: boolean
  content_blocks?: ContentBlock[]
}

export function ContentSectionForm({ section }: { section?: ContentSection & { content_blocks?: any[] } }) {
  const router = useRouter()
  const supabase = createBrowserClient()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<ContentSection>({
    section_key: section?.section_key || "",
    section_type: section?.section_type || "flexible_grid",
    title: section?.title || "",
    subtitle: section?.subtitle || "",
    display_order: section?.display_order || 0,
    is_active: section?.is_active ?? true,
  })

  const [blocks, setBlocks] = useState<ContentBlock[]>(
    section?.content_blocks || [
      {
        row_number: 1,
        column_number: 1,
        columns_in_row: 2,
        image_url: "",
        heading: "",
        text_content: "",
        link_url: "",
        link_text: "",
      },
    ],
  )

  const addBlock = () => {
    const lastBlock = blocks[blocks.length - 1]
    setBlocks([
      ...blocks,
      {
        row_number: lastBlock ? lastBlock.row_number + 1 : 1,
        column_number: 1,
        columns_in_row: 2,
        image_url: "",
        heading: "",
        text_content: "",
        link_url: "",
        link_text: "",
      },
    ])
  }

  const removeBlock = (index: number) => {
    setBlocks(blocks.filter((_, i) => i !== index))
  }

  const updateBlock = (index: number, field: keyof ContentBlock, value: any) => {
    const newBlocks = [...blocks]
    newBlocks[index] = { ...newBlocks[index], [field]: value }
    setBlocks(newBlocks)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Save section
      const sectionData = {
        section_key: formData.section_key,
        section_type: formData.section_type,
        title: formData.title,
        subtitle: formData.subtitle,
        display_order: formData.display_order,
        is_active: formData.is_active,
      }

      let sectionId = section?.id

      if (section?.id) {
        const { error } = await supabase.from("content_sections").update(sectionData).eq("id", section.id)

        if (error) throw error
      } else {
        const { data, error } = await supabase.from("content_sections").insert(sectionData).select().single()

        if (error) throw error
        sectionId = data.id
      }

      // Delete existing blocks if editing
      if (section?.id) {
        await supabase.from("content_blocks").delete().eq("section_id", section.id)
      }

      // Insert new blocks
      if (blocks.length > 0) {
        const blocksData = blocks.map((block, index) => ({
          section_id: sectionId,
          row_number: block.row_number,
          column_number: block.column_number,
          columns_in_row: block.columns_in_row,
          image_url: block.image_url,
          heading: block.heading,
          text_content: block.text_content,
          link_url: block.link_url,
          link_text: block.link_text,
          display_order: index,
        }))

        const { error } = await supabase.from("content_blocks").insert(blocksData)
        if (error) throw error
      }

      router.push("/admin/cms/sections")
      router.refresh()
    } catch (error: any) {
      alert("Error saving section: " + error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Section Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="section_key">Section Key *</Label>
              <Input
                id="section_key"
                value={formData.section_key}
                onChange={(e) => setFormData({ ...formData, section_key: e.target.value })}
                placeholder="e.g., about-us, features"
                required
              />
              <p className="text-xs text-muted-foreground">Unique identifier for this section</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="section_type">Section Type *</Label>
              <Select
                value={formData.section_type}
                onValueChange={(value) => setFormData({ ...formData, section_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flexible_grid">Flexible Grid</SelectItem>
                  <SelectItem value="text">Text Section</SelectItem>
                  <SelectItem value="banner">Banner</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Section title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle</Label>
            <Textarea
              id="subtitle"
              value={formData.subtitle}
              onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
              placeholder="Optional subtitle or description"
              rows={2}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="display_order">Display Order</Label>
              <Input
                id="display_order"
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: Number.parseInt(e.target.value) })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
              <Label htmlFor="is_active">Active</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Content Blocks</h3>
          <Button type="button" onClick={addBlock} variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Block
          </Button>
        </div>

        {blocks.map((block, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">Block {index + 1}</CardTitle>
              {blocks.length > 1 && (
                <Button type="button" variant="ghost" size="sm" onClick={() => removeBlock(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Row Number</Label>
                  <Input
                    type="number"
                    value={block.row_number}
                    onChange={(e) => updateBlock(index, "row_number", Number.parseInt(e.target.value))}
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Column Number</Label>
                  <Input
                    type="number"
                    value={block.column_number}
                    onChange={(e) => updateBlock(index, "column_number", Number.parseInt(e.target.value))}
                    min="1"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Columns in Row</Label>
                  <Select
                    value={block.columns_in_row.toString()}
                    onValueChange={(value) => updateBlock(index, "columns_in_row", Number.parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 Column</SelectItem>
                      <SelectItem value="2">2 Columns</SelectItem>
                      <SelectItem value="3">3 Columns</SelectItem>
                      <SelectItem value="4">4 Columns</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Image URL</Label>
                <ImageUpload
                  currentImage={block.image_url}
                  onUpload={async (file) => {
                    const url = await uploadImage("content", file)
                    updateBlock(index, "image_url", url)
                    return url
                  }}
                  label="Block Image"
                />
                <Input
                  value={block.image_url}
                  onChange={(e) => updateBlock(index, "image_url", e.target.value)}
                  placeholder="/images/example.jpg or https://..."
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground">Or enter URL directly above</p>
              </div>

              <div className="space-y-2">
                <Label>Heading</Label>
                <Input
                  value={block.heading}
                  onChange={(e) => updateBlock(index, "heading", e.target.value)}
                  placeholder="Block heading"
                />
              </div>

              <div className="space-y-2">
                <Label>Text Content</Label>
                <Textarea
                  value={block.text_content}
                  onChange={(e) => updateBlock(index, "text_content", e.target.value)}
                  placeholder="Block description or content"
                  rows={3}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Link URL</Label>
                  <Input
                    value={block.link_url}
                    onChange={(e) => updateBlock(index, "link_url", e.target.value)}
                    placeholder="/products or https://..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Link Text</Label>
                  <Input
                    value={block.link_text}
                    onChange={(e) => updateBlock(index, "link_text", e.target.value)}
                    placeholder="Learn More"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : section ? "Update Section" : "Create Section"}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
