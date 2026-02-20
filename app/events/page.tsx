"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Calendar, MapPin, Users, Clock, ArrowRight, Instagram, Facebook, Twitter, Phone, Mail, ChevronLeft, ChevronRight } from "lucide-react"
import { format } from "date-fns"
import { MainNav } from "@/components/navigation/main-nav"
import { createClient } from "@/lib/supabase/client"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const FALLBACK_CITIES = [
  {
    id: "lamu",
    name: "Lamu",
    slug: "lamu",
    city_experiences: [
      { id: "e1", image_url: "/products/chestbags.jpg", title: "Experience" },
      { id: "e2", image_url: "/products/brownmaxiside.jpg", title: "Experience" },
      { id: "e3", image_url: "/products/cardholders1.jpg", title: "Experience" },
      { id: "e4", image_url: "/products/IMG_4398 (Custom).jpg", title: "Experience" }
    ]
  },
  {
    id: "diani",
    name: "Diani",
    slug: "diani",
    city_experiences: [
      { id: "e5", image_url: "/products/IMG_4410(2) (Custom).jpg", title: "Experience" },
      { id: "e6", image_url: "/products/chestbags3.jpg", title: "Experience" },
      { id: "e7", image_url: "/products/cardholders.jpg", title: "Experience" },
      { id: "e8", image_url: "/images/IMG_4745 (Custom).jpg", title: "Experience" }
    ]
  },
  {
    id: "mombasa",
    name: "Mombasa",
    slug: "mombasa",
    city_experiences: [
      { id: "e9", image_url: "/products/glasscases.jpg", title: "Experience" },
      { id: "e10", image_url: "/products/cardholders1.jpg", title: "Experience" },
      { id: "e11", image_url: "/products/IMG_4415 (Custom).jpg", title: "Experience" },
      { id: "e12", image_url: "/products/IMG_4433 (Custom).jpg", title: "Experience" }
    ]
  },
  {
    id: "zanzibar",
    name: "Zanzibar",
    slug: "zanzibar",
    city_experiences: [
      { id: "e13", image_url: "/products/IMG_4435 (Custom).jpg", title: "Experience" },
      { id: "e14", image_url: "/images/IMG_4745 (Custom).jpg", title: "Experience" },
      { id: "e15", image_url: "/products/cardholders2.jpg", title: "Experience" },
      { id: "e16", image_url: "/images/IMG_4419(1) (Custom).jpg", title: "Experience" }
    ]
  }
]

export default function EventsPage() {
  const [events, setEvents] = useState<any[]>([])
  const [isScrolled, setIsScrolled] = useState(false)
  const [loading, setLoading] = useState(true)
  const [cities, setCities] = useState<any[]>([])
  const scrollContainerRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  const scroll = (cityId: string, direction: "left" | "right") => {
    const container = scrollContainerRefs.current[cityId]
    if (container) {
      const scrollAmount = 350 + 24 // Card width + gap
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })

    async function fetchData() {
      const supabase = createClient()
      
      const [
        { data: eventsData },
        { data: citiesData }
      ] = await Promise.all([
        supabase.from("events").select("*").eq("is_published", true).eq("is_active", true).order("event_date", { ascending: true }),
        supabase.from("cities").select("*, city_experiences(*), events(*)").eq("is_active", true).order("display_order")
      ])
      
      if (eventsData) setEvents(eventsData)
      if (citiesData && citiesData.length > 0) {
        setCities(citiesData)
      } else {
        setCities(FALLBACK_CITIES)
      }
      setLoading(false)
    }

    fetchData()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <main className="min-h-screen text-[#2C2420] overflow-x-hidden">
      {/* Navigation */}
      <MainNav variant={isScrolled ? "solid" : "transparent"} showPromoBanner={true} />

      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/IMG_4416(1) (Custom).jpg"
          alt="Events Hero"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <span className="text-xs tracking-[0.4em] mb-4 block uppercase font-medium animate-fade-in">HANDCRAFTED IN AFRICA</span>
          <h1 className="text-5xl md:text-7xl font-serif mb-8 tracking-wider animate-fade-in-up">
            Sensations by Stawi Afrika
          </h1>
          <p className="text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto opacity-90 animate-fade-in-up delay-200">
             Immerse yourself in one of a kind ticketed experience that brings you into living landscapes through guided nature encounters, indigenous knowledge, regenerative practices, and curated moments rooted in place, culture, and craft.
          </p>
        </div>
      </section>

      {/* Sensations Section - Synced with Home Page */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-24">
            {cities.map((city) => (
              <div key={city.id} className="space-y-8">
                <div className="flex items-end justify-between border-b border-[#E8E4DE] pb-4">
                  <h2 className="text-4xl font-serif font-bold tracking-tight">{city.name}</h2>
                  <Link 
                    href={`/experiences?city=${city.slug}`}
                    className="text-xs tracking-[0.3em] font-semibold text-[#8B4513] uppercase hover:underline"
                  >
                    Experiences
                  </Link>
                </div>
                
                <div className="relative group">
                  <div 
                    ref={(el) => { scrollContainerRefs.current[city.id] = el }}
                    className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x snap-mandatory"
                  >
                    {city.city_experiences?.map((exp: any) => (
                      <Link 
                        key={exp.id} 
                        href={`/experiences?city=${city.slug}`}
                        className="flex-none w-[280px] sm:w-[350px] aspect-[4/5] relative rounded-lg overflow-hidden snap-start shadow-sm hover:shadow-xl transition-shadow duration-500 block"
                      >
                        <Image
                          src={exp.image_url || "/placeholder.jpg"}
                          alt={exp.title || "Experience"}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-700"
                          sizes="(max-width: 640px) 280px, 350px"
                        />
                        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center p-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <p className="text-[9px] tracking-[0.4em] mb-2 uppercase opacity-80">SELECTED</p>
                          <h3 className="text-xl sm:text-2xl font-serif mb-4 uppercase tracking-wider">
                            {exp.title?.toUpperCase().includes(city.name.toUpperCase()) ? exp.title : `${city.name} ${exp.title}`}
                          </h3>
                          <div className="w-12 h-[1px] bg-white/50 mb-4" />
                          <p className="text-white/90 text-[10px] tracking-[0.2em] uppercase font-light max-w-[200px] leading-relaxed">
                            {exp.description || "Discover the essence"}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <button 
                    onClick={() => scroll(city.id, "left")}
                    className="absolute top-1/2 -translate-y-1/2 -left-4 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    aria-label="Scroll left"
                  >
                     <div className="bg-white/70 backdrop-blur-sm p-2 rounded-full shadow-lg text-[#2C2420] hover:bg-white transition-colors">
                       <ChevronLeft className="w-6 h-6" />
                     </div>
                  </button>
                  <button 
                    onClick={() => scroll(city.id, "right")}
                    className="absolute top-1/2 -translate-y-1/2 -right-4 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    aria-label="Scroll right"
                  >
                     <div className="bg-white/90 p-2 rounded-full shadow-lg text-[#2C2420] hover:bg-white transition-colors">
                       <ChevronRight className="w-6 h-6" />
                     </div>
                  </button>
                </div>

                {/* City Events Section */}
                {city.events && city.events.length > 0 && (
                  <div className="mt-12 space-y-6">
                    <h3 className="text-xl font-serif font-semibold tracking-tight border-l-4 border-[#8B4513] pl-4">
                      Events in {city.name}
                    </h3>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                      {city.events.map((event: any) => (
                        <Link 
                          key={event.id} 
                          href={`/events/${event.slug}`}
                          className="group/event bg-white/60 backdrop-blur-sm rounded-lg overflow-hidden flex flex-col hover:shadow-md transition-all duration-300"
                        >
                          <div className="relative aspect-[16/9]">
                            <Image
                              src={event.image_url || "/placeholder.jpg"}
                              alt={event.title}
                              fill
                              className="object-cover group-hover/event:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-2 right-2">
                              <Badge className="bg-white/90 text-[#2C2420] text-[8px] tracking-widest py-0.5 px-2">
                                {event.category?.toUpperCase()}
                              </Badge>
                            </div>
                          </div>
                          <div className="p-4 space-y-2">
                            <div className="flex items-center gap-2 text-[9px] tracking-[0.1em] text-[#8B4513] font-bold uppercase">
                              <Calendar className="w-3 h-3" />
                              {format(new Date(event.event_date), "MMM dd, yyyy")}
                            </div>
                            <h4 className="font-serif font-bold text-lg leading-tight group-hover/event:text-[#8B4513] transition-colors">
                              {event.title}
                            </h4>
                            <div className="flex items-center justify-between pt-2 border-t border-[#E8E4DE]/50 mt-2">
                              <span className="text-sm font-medium">
                                {event.price > 0 ? `KSh ${Number(event.price).toLocaleString()}` : 'Free'}
                              </span>
                              <span className="text-[9px] tracking-[0.2em] font-bold uppercase flex items-center gap-1">
                                Book Now <ArrowRight className="w-3 h-3" />
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Footer */}
      <footer className="bg-[#2C2420] text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="relative w-40 h-10 mb-6">
                 <Image 
                   src="/images/logo.png" 
                   alt="StawiAFRIKA" 
                   fill 
                   className="object-contain brightness-0 invert" 
                 />
              </div>
              <p className="text-sm text-white/70 leading-relaxed mb-6">
                Cosmetics and Beuty products handcrafted with African excellence. Each piece tells a story of timeless elegance
                and superior craftsmanship.
              </p>
              <div className="flex gap-4">
                <a href="#" className="hover:text-[#8B4513] transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="hover:text-[#8B4513] transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="hover:text-[#8B4513] transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Shop */}
            <div>
              <h4 className="text-xs tracking-[0.2em] mb-6">SHOP</h4>
              <ul className="space-y-3 text-sm text-white/70">
                <li>
                  <Link href="/our-collection?category=sling-bags" className="hover:text-white transition-colors">
                    Sling Bags
                  </Link>
                </li>
                <li>
                  <Link href="/our-collection?category=side-bags" className="hover:text-white transition-colors">
                    Side Bags
                  </Link>
                </li>
                <li>
                  <Link href="/our-collection?category=crossbody-bags" className="hover:text-white transition-colors">
                    Cross Body Bags
                  </Link>
                </li>
                <li>
                  <Link href="/our-collection" className="hover:text-white transition-colors">
                    All Products
                  </Link>
                </li>
              </ul>
            </div>

            {/* Help */}
            <div>
              <h4 className="text-xs tracking-[0.2em] mb-6">HELP</h4>
              <ul className="space-y-3 text-sm text-white/70">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Shipping & Returns
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Care Guide
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Size Guide
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    FAQs
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div id="contact">
              <h4 className="text-xs tracking-[0.2em] mb-6">CONTACT</h4>
              <ul className="space-y-3 text-sm text-white/70">
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Nairobi, Kenya
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  +254 700 000 000
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  hello@Stawiafrika.com
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-white/50">© 2025 Stawiafrika. All rights reserved.</p>
            <div className="flex gap-6 text-xs text-white/50">
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}
