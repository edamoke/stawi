"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Plus, Trash2, Edit2, MapPin, Upload, X } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"
import { ImageUpload } from "@/components/admin/image-upload"

export default function CitiesCMS() {
  const [cities, setCities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCity, setSelectedCity] = useState<any>(null)
  const [isEditing, setIsEditing] = useState(false)

  const supabase = createClient()

  useEffect(() => {
    fetchCities()
  }, [])

  async function fetchCities() {
    setLoading(true)
    const { data, error } = await supabase
      .from("cities")
      .select("*, city_experiences(*)")
      .order("display_order")
    
    if (error) {
      toast.error("Failed to fetch cities")
    } else {
      setCities(data || [])
    }
    setLoading(false)
  }

  async function handleSaveCity(e: React.FormEvent) {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const cityData = {
      name: formData.get("name"),
      slug: formData.get("slug"),
      description: formData.get("description"),
      culture: formData.get("culture"),
      leather_history: formData.get("leather_history"),
      display_order: parseInt(formData.get("display_order") as string),
      hero_image: selectedCity?.hero_image,
      hero_sentence: formData.get("hero_sentence"),
    }

    let error
    if (selectedCity?.id && isEditing) {
      const { error: updateError } = await supabase
        .from("cities")
        .update(cityData)
        .eq("id", selectedCity.id)
      error = updateError
    } else {
      const { error: insertError } = await supabase
        .from("cities")
        .insert([cityData])
      error = insertError
    }

    if (error) {
      toast.error("Error saving city")
    } else {
      toast.success("City saved successfully")
      setIsEditing(false)
      setSelectedCity(null)
      fetchCities()
    }
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>, cityId: string, isHero: boolean) {
    const file = e.target.files?.[0]
    if (!file) return

    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random()}.${fileExt}`
    const filePath = `cities/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from("cities")
      .upload(filePath, file)

    if (uploadError) {
      toast.error("Error uploading image")
      return
    }

    const { data: { publicUrl } } = supabase.storage
      .from("cities")
      .getPublicUrl(filePath)

    if (isHero) {
      const { error: updateError } = await supabase
        .from("cities")
        .update({ hero_image: publicUrl })
        .eq("id", cityId)
      
      if (updateError) toast.error("Error updating city image")
    } else {
      // Logic for adding experience image
      const { error: insertError } = await supabase
        .from("city_experiences")
        .insert([{ city_id: cityId, title: "New Experience", image_url: publicUrl }])
      
      if (insertError) toast.error("Error adding experience image")
    }

    fetchCities()
    toast.success("Image uploaded successfully")
  }

  const seedCities = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/cities/seed', {
        method: 'POST',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Seeding failed')
      }

      toast.success("Cities seeded successfully")
      fetchCities()
    } catch (error: any) {
      console.error("Seeding failed:", error)
      toast.error(error.message || "Seeding failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8 p-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-serif font-bold flex items-center gap-2">
          <MapPin className="w-6 h-6" /> City Sensations Management
        </h2>
        <div className="flex gap-4">
          <Button variant="outline" onClick={seedCities} disabled={loading}>
            Seed Default Cities
          </Button>
          <Button onClick={() => { setSelectedCity({}); setIsEditing(true); }}>
            <Plus className="w-4 h-4 mr-2" /> Add New City
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cities.map((city) => (
          <div key={city.id} className="bg-white rounded-xl shadow-sm border border-[#E8E4DE] overflow-hidden">
            <div className="relative h-48 bg-[#F5F3F0]">
              {city.hero_image ? (
                <Image src={city.hero_image} alt={city.name} fill className="object-cover" />
              ) : (
                <div className="flex items-center justify-center h-full text-[#8B8178]">No Hero Image</div>
              )}
              <label className="absolute bottom-2 right-2 p-2 bg-white/90 rounded-full cursor-pointer shadow-lg">
                <Upload className="w-4 h-4 text-[#8B4513]" />
                <span className="sr-only">Upload hero image</span>
                <input type="file" className="hidden" aria-label="Upload hero image" onChange={(e) => handleImageUpload(e, city.id, true)} />
              </label>
            </div>
            <div className="p-6 space-y-4">
              <h3 className="text-xl font-bold font-serif">{city.name}</h3>
              <p className="text-sm text-[#6B6560] line-clamp-2">{city.description}</p>
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => { setSelectedCity(city); setIsEditing(true); }}>
                  <Edit2 className="w-4 h-4 mr-2" /> Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={async () => {
                  if (confirm("Delete this city?")) {
                    await supabase.from("cities").delete().eq("id", city.id)
                    fetchCities()
                  }
                }}>
                  <Trash2 className="w-4 h-4 mr-2" /> Delete
                </Button>
              </div>

              <div className="pt-4 border-t border-[#E8E4DE]">
                <h4 className="text-xs font-bold uppercase tracking-wider mb-3">Experiences ({city.city_experiences?.length || 0})</h4>
                <div className="grid grid-cols-4 gap-2">
                  {city.city_experiences?.map((exp: any) => (
                    <div key={exp.id} className="relative aspect-square rounded bg-[#F5F3F0] overflow-hidden group">
                      <Image src={exp.image_url} alt={exp.title} fill className="object-cover" />
                      <button 
                        onClick={async () => {
                          await supabase.from("city_experiences").delete().eq("id", exp.id)
                          fetchCities()
                        }}
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                        aria-label="Delete experience"
                      >
                        <Trash2 className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  ))}
                  <label className="aspect-square rounded border-2 border-dashed border-[#E8E4DE] flex items-center justify-center cursor-pointer hover:bg-[#F5F3F0] transition-colors">
                    <Plus className="w-4 h-4 text-[#8B8178]" />
                    <span className="sr-only">Add experience image</span>
                    <input type="file" className="hidden" aria-label="Add experience image" onChange={(e) => handleImageUpload(e, city.id, false)} />
                  </label>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black/60 flex items-start justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl my-8">
            <h3 className="text-2xl font-serif font-bold mb-6">{selectedCity?.id ? "Edit City" : "Add New City"}</h3>
            <form onSubmit={handleSaveCity} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider">City Name</label>
                  <Input name="name" defaultValue={selectedCity?.name} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider">Slug</label>
                  <Input name="slug" defaultValue={selectedCity?.slug} required />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider">Hero Image</label>
                <ImageUpload
                  currentImage={selectedCity?.hero_image}
                  onUpload={async (file) => {
                    const fileExt = file.name.split(".").pop()
                    const fileName = `${Math.random()}.${fileExt}`
                    const filePath = `cities/${fileName}`

                    const { error: uploadError } = await supabase.storage.from("cities").upload(filePath, file)

                    if (uploadError) throw uploadError

                    const {
                      data: { publicUrl },
                    } = supabase.storage.from("cities").getPublicUrl(filePath)

                    setSelectedCity({ ...selectedCity, hero_image: publicUrl })
                    return publicUrl
                  }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider">Hero Sentence (Overlay)</label>
                <Input name="hero_sentence" defaultValue={selectedCity?.hero_sentence} placeholder="e.g., DISCOVER SCENTS" />
                <p className="text-[10px] text-[#8B8178]">This text appears in the center of the hero image.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider">Short Description</label>
                <Textarea name="description" defaultValue={selectedCity?.description} rows={2} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider">Culture Info</label>
                <Textarea name="culture" defaultValue={selectedCity?.culture} rows={4} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider">Leather History</label>
                <Textarea name="leather_history" defaultValue={selectedCity?.leather_history} rows={4} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-bold uppercase tracking-wider">Display Order</label>
                  <Input name="display_order" type="number" defaultValue={selectedCity?.display_order || 0} />
                </div>
              </div>

              {selectedCity?.id && (
                <div className="pt-4 border-t border-[#E8E4DE]">
                  <h4 className="text-sm font-bold uppercase tracking-wider mb-4">City Experiences</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {selectedCity.city_experiences?.map((exp: any) => (
                      <div key={exp.id} className="space-y-4 p-4 border border-[#E8E4DE] rounded-xl bg-gray-50">
                        <div className="relative aspect-square rounded-lg overflow-hidden group">
                          <Image src={exp.image_url} alt={exp.title} fill className="object-cover" />
                          <button
                            type="button"
                            onClick={async () => {
                              const { error } = await supabase.from("city_experiences").delete().eq("id", exp.id)
                              if (error) toast.error("Error deleting experience")
                              else {
                                const updatedExps = selectedCity.city_experiences.filter((e: any) => e.id !== exp.id)
                                setSelectedCity({ ...selectedCity, city_experiences: updatedExps })
                                fetchCities()
                              }
                            }}
                            className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                            aria-label="Delete experience"
                          >
                            <Trash2 className="w-5 h-5 text-white" />
                          </button>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[#8B8178]">Card Title (Overlay)</label>
                            <Input 
                              value={exp.title} 
                              onChange={async (e) => {
                                const newTitle = e.target.value;
                                const updatedExps = selectedCity.city_experiences.map((item: any) => 
                                  item.id === exp.id ? { ...item, title: newTitle } : item
                                );
                                setSelectedCity({ ...selectedCity, city_experiences: updatedExps });
                                await supabase.from("city_experiences").update({ title: newTitle }).eq("id", exp.id);
                              }}
                              className="text-xs"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold uppercase tracking-widest text-[#8B8178]">Card Sentence</label>
                            <Input 
                              value={exp.description || ""} 
                              onChange={async (e) => {
                                const newDesc = e.target.value;
                                const updatedExps = selectedCity.city_experiences.map((item: any) => 
                                  item.id === exp.id ? { ...item, description: newDesc } : item
                                );
                                setSelectedCity({ ...selectedCity, city_experiences: updatedExps });
                                await supabase.from("city_experiences").update({ description: newDesc }).eq("id", exp.id);
                              }}
                              className="text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="aspect-square">
                      <ImageUpload
                        label="Add Experience"
                        onUpload={async (file) => {
                          const fileExt = file.name.split(".").pop()
                          const fileName = `${Math.random()}.${fileExt}`
                          const filePath = `cities/experiences/${fileName}`

                          const { error: uploadError } = await supabase.storage.from("cities").upload(filePath, file)

                          if (uploadError) throw uploadError

                          const {
                            data: { publicUrl },
                          } = supabase.storage.from("cities").getPublicUrl(filePath)

                          const { data, error: insertError } = await supabase
                            .from("city_experiences")
                            .insert([{ 
                              city_id: selectedCity.id, 
                              title: "New Experience", 
                              image_url: publicUrl,
                              description: "Discover the essence" 
                            }])
                            .select()

                          if (insertError) throw insertError

                          const updatedExps = [...(selectedCity.city_experiences || []), ...(data || [])]
                          setSelectedCity({ ...selectedCity, city_experiences: updatedExps })
                          fetchCities()
                          return publicUrl
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-4 pt-4 border-t border-[#E8E4DE]">
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
                <Button type="submit" className="bg-[#8B4513] hover:bg-[#6B3410]">Save Changes</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
