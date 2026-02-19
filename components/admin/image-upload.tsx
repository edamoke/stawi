"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ImageUploadProps {
  onUpload: (file: File) => Promise<string>
  currentImage?: string
  label?: string
  accept?: string
}

export function ImageUpload({ onUpload, currentImage, label = "Upload Image", accept = "image/*" }: ImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [preview, setPreview] = useState<string | undefined>(currentImage)
  const [error, setError] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError("")
    setIsLoading(true)

    try {
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)

      // Upload file
      const url = await onUpload(file)
      setPreview(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
      setPreview(currentImage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium">{label}</label>
      <div className="flex gap-4">
        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            disabled={isLoading}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isLoading}
            className="w-full"
          >
            <Upload className="mr-2 h-4 w-4" />
            {isLoading ? "Uploading..." : "Choose File"}
          </Button>
        </div>
        {preview && (
          <button
            type="button"
            onClick={() => {
              setPreview(undefined)
              if (fileInputRef.current) fileInputRef.current.value = ""
            }}
            className="text-red-500 hover:text-red-700"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
      {preview && (
        <div className="relative w-full h-32 rounded-lg overflow-hidden bg-gray-100">
          <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
        </div>
      )}
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  )
}
