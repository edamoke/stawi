"use client"

import { useState, useEffect, Suspense } from "react"
import Image from "next/image"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { MainNav } from "@/components/navigation/main-nav"
import { Footer } from "@/components/navigation/footer"
import { AIChatCompanion } from "@/components/ai-chat-companion"
import { MapPin, ArrowRight, History, Info, Calendar } from "lucide-react"
import { format } from "date-fns"
import { createClient } from "@/lib/supabase/client"
import { Badge } from "@/components/ui/badge"

const FALLBACK_CITIES = [
  {
    id: "lamu",
    name: "Lamu",
    slug: "lamu",
    description: "A UNESCO World Heritage site where time stands still and the essence of Swahili culture is preserved in every stone.",
    culture: "Lamu is the oldest and best-preserved Swahili settlement in East Africa, maintaining its traditional functions. Built in coral stone and mangrove timber, the town is characterized by the simplicity of structural forms enriched by such features as inner courtyards, verandas, and elaborately carved wooden doors.",
    leather_history: "The Wangozi people of the Lamu archipelago were renowned for their exquisite leather craftsmanship, a tradition that has influenced Sulha Afrika's commitment to heritage and quality.",
    hero_image: "/images/IMG_4416(1) (Custom).jpg",
    city_experiences: [
      { id: "e1", image_url: "/images/IMG_4421(3) (Custom).jpg", title: "Old Town Walk", description: "Wander through the historic streets" },
      { id: "e2", image_url: "/images/IMG_4420(1) (Custom).jpg", title: "Dhow Sailing", description: "Experience the ocean at sunset" }
    ]
  },
  {
    id: "diani",
    name: "Diani",
    slug: "diani",
    description: "Pristine white sands meet turquoise waters, creating a serene sanctuary for the soul and a vibrant playground for the adventurous.",
    culture: "Diani represents the vibrant coastal lifestyle of Kenya, where the rhythm of the ocean dictates the pace of life and the warmth of the community welcomes every visitor with open arms.",
    leather_history: "Coastal leather work in Diani merged utility with aesthetics, creating durable pieces that withstood the salty air and reflected the beauty of the surrounding natural environment.",
    hero_image: "/images/IMG_4413(2) (Custom).jpg",
    city_experiences: [
      { id: "e3", image_url: "/images/IMG_4745 (Custom).jpg", title: "Beach Sensation", description: "Pure relaxation on white sands" },
      { id: "e4", image_url: "/images/IMG_4747 (Custom).jpg", title: "Ocean Adventure", description: "Explore the vibrant reef" }
    ]
  },
  {
    id: "mombasa",
    name: "Mombasa",
    slug: "mombasa",
    description: "A bustling island city where history and modernity dance together in a vibrant celebration of culture, trade, and community.",
    culture: "Mombasa is a melting pot of cultures, a historic gateway to East Africa that has been shaped by centuries of global trade and a resilient spirit of hospitality.",
    leather_history: "As a historic hub for the leather trade, Mombasa has always been at the forefront of craftsmanship, where traditional techniques meet new influences to create something truly unique.",
    hero_image: "/images/IMG_4754 (Custom).jpg",
    city_experiences: [
      { id: "e5", image_url: "/images/IMG_4756 (Custom).jpg", title: "Fort Jesus Visit", description: "Step back in time at the fort" },
      { id: "e6", image_url: "/images/IMG_4411 (Custom).jpg", title: "Spice Market", description: "A feast for the senses" }
    ]
  },
  {
    id: "zanzibar",
    name: "Zanzibar",
    slug: "zanzibar",
    description: "The Spice Island of Stone Town, where every narrow alleyway tells a story and the air is filled with the scent of cloves and history.",
    culture: "Zanzibar's culture is a breathtaking blend of African, Arab, Indian, and European influences, creating a unique tapestry of traditions that is reflected in its art, music, and daily life.",
    leather_history: "Leather craft reached a high level of sophistication in Zanzibar, with intricate designs and master techniques that continue to inspire artisans today.",
    hero_image: "/images/IMG_4412 (Custom).jpg",
    city_experiences: [
      { id: "e7", image_url: "/images/IMG_4415 (Custom).jpg", title: "Stone Town Tour", description: "The heart of Zanzibari culture" },
      { id: "e8", image_url: "/images/IMG_4421 (Custom).jpg", title: "Spice Plantation", description: "Discover the source of flavors" }
    ]
  }
]

function ExperiencesContent() {
  const [cities, setCities] = useState<any[]>([])
  const [selectedCity, setSelectedCity] = useState<any>(null)
  const [cityEvents, setCityEvents] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  
  const searchParams = useSearchParams()
  const cityQuery = searchParams.get("city")

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })

    async function fetchData() {
      const supabase = createClient()
      const { data } = await supabase
        .from("cities")
        .select("*, city_experiences(*)")
        .eq("is_active", true)
        .order("display_order")
      
      const citiesData = data && data.length > 0 ? data : FALLBACK_CITIES
      setCities(citiesData)
      
      const initialCity = cityQuery 
        ? citiesData.find((c: any) => c.slug === cityQuery) || citiesData[0]
        : citiesData[0]
      setSelectedCity(initialCity)
      
      setLoading(false)
    }

    fetchData()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [cityQuery])

  useEffect(() => {
    async function fetchCityEvents() {
      if (!selectedCity || !selectedCity.id || selectedCity.id.length > 20) {
        setCityEvents([])
        return
      }
      
      const supabase = createClient()
      const { data } = await supabase
        .from("events")
        .select("*")
        .eq("city_id", selectedCity.id)
        .eq("is_published", true)
        .eq("is_active", true)
        .order("event_date", { ascending: true })
      
      if (data) setCityEvents(data)
      else setCityEvents([])
    }

    fetchCityEvents()
  }, [selectedCity])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">Loading sensations...</div>
  }

  return (
    <div className="min-h-screen">
      <MainNav variant={isScrolled ? "solid" : "transparent"} activeItem="/experiences" />

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
        <Image
          src={selectedCity.hero_image || "/placeholder.jpg"}
          alt={selectedCity.name}
          fill
          className="object-cover transition-all duration-1000"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div className="max-w-4xl">
            <p className="text-white/80 text-xs tracking-[0.4em] mb-4 uppercase animate-fade-in">Cultural Sensations</p>
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif text-white mb-6 animate-fade-in-up">
              Discover <span className="italic font-light">{selectedCity.name}</span>
            </h1>
            <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto font-light leading-relaxed animate-fade-in-up delay-200">
              {selectedCity.description}
            </p>
          </div>
        </div>

        {/* City Selector */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/20">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-center overflow-x-auto no-scrollbar py-4 gap-8 md:gap-16">
              {cities.map((city) => (
                <button
                  key={city.id}
                  onClick={() => setSelectedCity(city)}
                  className={`text-xs tracking-[0.3em] uppercase font-semibold transition-all duration-300 pb-2 border-b-2 ${
                    selectedCity.id === city.id 
                    ? "text-white border-white" 
                    : "text-white/50 border-transparent hover:text-white/80"
                  }`}
                >
                  {city.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div className="space-y-12">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-[#8B4513]">
                  <Info className="w-5 h-5" />
                  <h2 className="text-sm tracking-[0.3em] font-bold uppercase">The Culture</h2>
                </div>
                <p className="text-xl text-[#2C2420] font-serif leading-relaxed italic">
                  "{selectedCity.culture}"
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 text-[#8B4513]">
                  <History className="w-5 h-5" />
                  <h2 className="text-sm tracking-[0.3em] font-bold uppercase">Leather History</h2>
                </div>
                <div className="text-[#6B6560] text-lg leading-relaxed font-light space-y-4">
                  <p>{selectedCity.leather_history}</p>
                </div>
              </div>
            </div>

            <div className="space-y-12">
              <div className="flex items-center gap-3 text-[#8B4513]">
                <MapPin className="w-5 h-5" />
                <h2 className="text-sm tracking-[0.3em] font-bold uppercase">Experiences</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {selectedCity.city_experiences?.map((exp: any) => (
                  <div key={exp.id} className="group relative aspect-[4/5] rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
                    <Image
                      src={exp.image_url || "/placeholder.jpg"}
                      alt={exp.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-6 text-white">
                      <p className="text-[10px] tracking-[0.4em] mb-2 uppercase opacity-80">SELECTED</p>
                      <h3 className="text-2xl sm:text-3xl font-serif mb-4 uppercase tracking-wider">{selectedCity.name} SENSATIONS</h3>
                      <div className="w-12 h-[1px] bg-white/50 mb-4" />
                      <p className="text-white/90 text-xs tracking-[0.2em] uppercase font-light max-w-[200px] leading-relaxed">
                        {exp.description || "Discover the essence"}
                      </p>
                      <button className="mt-8 flex items-center gap-2 text-[10px] tracking-[0.2em] uppercase font-bold border-b border-white/30 pb-1 hover:border-white transition-all">
                        Inquire Now <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* City Specific Events */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm tracking-[0.4em] text-[#8B4513] mb-4 block font-semibold uppercase">
              Events in {selectedCity.name}
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold">Upcoming Sensations</h2>
          </div>

          {cityEvents.length > 0 ? (
            <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3">
              {cityEvents.map((event) => {
                const spotsLeft = event.capacity - (event.booked_count || 0)
                const isFull = spotsLeft <= 0
                return (
                  <div key={event.id} className="group cursor-pointer">
                    <Link href={`/events/${event.slug}`} className="block">
                      <div className="relative aspect-[4/5] mb-6 overflow-hidden bg-[#F5F3F0] rounded-lg shadow-sm group-hover:shadow-xl transition-all duration-500">
                        <Image
                          src={event.image_url || "/placeholder.svg"}
                          alt={event.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute top-4 left-4">
                           {event.category && (
                             <Badge className="bg-white/90 text-[#2C2420] hover:bg-white transition-colors tracking-widest text-[10px] py-1 px-3 border-none uppercase">
                               {event.category}
                             </Badge>
                           )}
                        </div>
                        {isFull && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="text-white text-xs tracking-[0.3em] font-bold uppercase border border-white/50 px-6 py-2">Sold Out</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-4">
                        <div className="flex items-center gap-4 text-[10px] tracking-[0.2em] text-[#8B4513] font-bold uppercase">
                          <span>{format(new Date(event.event_date), "MMMM dd, yyyy")}</span>
                          <span className="w-1 h-1 bg-[#8B4513] rounded-full" />
                          <span>{event.location}</span>
                        </div>
                        <h3 className="text-2xl font-serif font-bold group-hover:text-[#8B4513] transition-colors">
                          {event.title}
                        </h3>
                        <div className="flex items-center justify-between pt-4 border-t border-[#E8E4DE]">
                          <div className="text-lg font-medium">
                            {event.price > 0 ? `KSh ${Number(event.price).toLocaleString()}` : 'Free'}
                          </div>
                          <div className="inline-flex items-center gap-2 text-xs tracking-[0.2em] font-semibold uppercase group-hover:translate-x-2 transition-transform">
                            {isFull ? "Details" : "Book Now"} <ArrowRight className="w-4 h-4" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#E8E4DE]">
              <Calendar className="h-12 w-12 mx-auto mb-6 text-[#8B8178] opacity-30" />
              <h3 className="text-xl font-serif font-bold mb-4">No events scheduled in {selectedCity.name}</h3>
              <p className="text-[#8B8178] max-w-md mx-auto text-sm">
                We're currently planning our next sensations in {selectedCity.name}. Check back soon or view events in other cities.
              </p>
              <div className="mt-8">
                <Link 
                  href="/events"
                  className="text-[#8B4513] text-xs tracking-[0.2em] font-bold uppercase border-b border-[#8B4513]/30 pb-1 hover:border-[#8B4513] transition-all"
                >
                  All Upcoming Events
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Booking CTA */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-serif text-[#2C2420]">Ready for a <span className="italic font-light">Sensation</span>?</h2>
          <p className="text-lg text-[#6B6560] font-light max-w-2xl mx-auto">
            Book your curated cultural experience in {selectedCity.name} and immerse yourself in the living heritage of Africa.
          </p>
          <div className="pt-4">
            <Link 
              href="/events"
              className="inline-block bg-[#8B4513] text-white px-12 py-4 text-sm tracking-[0.2em] font-bold uppercase hover:bg-[#6B3410] transition-colors"
            >
              Explore All Events
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <AIChatCompanion />
    </div>
  )
}

export default function ExperiencesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">Loading...</div>}>
      <ExperiencesContent />
    </Suspense>
  )
}
