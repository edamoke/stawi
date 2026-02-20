"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import {
  ArrowRight,
  Instagram,
  Facebook,
  Twitter,
  Phone,
  Mail,
  MapPin
} from "lucide-react"
import { AIChatCompanion } from "@/components/ai-chat-companion"
import { HeroSlider } from "@/components/hero-slider"
import { SmoothScroll } from "@/components/smooth-scroll"
import { MainNav } from "@/components/navigation/main-nav"
import { createClient } from "@/lib/supabase/client"

const FALLBACK_CITIES = [
      {
        id: "lamu",
        name: "Lamu",
        slug: "lamu",
        city_experiences: [
          { id: "e1", image_url: "/products/facial-oil.jpg", title: "Experience" },
          { id: "e2", image_url: "/products/body-butter.jpg", title: "Experience" },
          { id: "e3", image_url: "/products/serum.jpg", title: "Experience" },
          { id: "e4", image_url: "/products/cleanser.jpg", title: "Experience" }
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

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false)
  const selectedSectionRef = useRef<HTMLDivElement>(null)
  const bestsellersRef = useRef<HTMLDivElement>(null)
  const valuesRef = useRef<HTMLDivElement>(null)
  
  const [bestsellers, setBestsellers] = useState<any[]>([])
  const [selectedSection, setSelectedSection] = useState<any>(null)
  const [cities, setCities] = useState<any[]>([])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    gsap.registerPlugin(ScrollTrigger)

    const sections = [
      selectedSectionRef.current,
      bestsellersRef.current,
      valuesRef.current,
    ]
    sections.forEach((section) => {
      if (section) {
        gsap.fromTo(
          section,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
            },
          }
        )
      }
    })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      ScrollTrigger.getAll().forEach((t: any) => t.kill())
    }
  }, [])

  useEffect(() => {
    const supabase = createClient()

    async function fetchData() {
      const [
        { data: bestsellersData },
        { data: selectedSectionData },
        { data: citiesData }
      ] = await Promise.all([
        supabase.from("products").select("*").eq("is_active", true).limit(4),
        supabase.from("content_sections").select("*, content_blocks(*)").eq("section_key", "homepage-selected").eq("is_active", true).single(),
        supabase.from("cities").select("*, city_experiences(*)").eq("is_active", true).order("display_order")
      ])

      if (bestsellersData) {
        setBestsellers(bestsellersData.map((p: any) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          image: p.images?.[0] || p.image_url || "/placeholder.svg",
          slug: p.slug
        })))
      }
      if (selectedSectionData) setSelectedSection(selectedSectionData)
      if (citiesData && citiesData.length > 0) {
        setCities(citiesData)
      } else {
        setCities(FALLBACK_CITIES)
      }
    }

    fetchData()
  }, [])

  return (
    <main className="min-h-screen text-[#2C2420] overflow-x-hidden bg-transparent">
      <SmoothScroll />
      <MainNav variant={isScrolled ? "solid" : "transparent"} showPromoBanner={true} />
      <HeroSlider />

      {/* Selected Section */}
      <section ref={selectedSectionRef} className="py-12 sm:py-20 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {/* Glow Collection */}
            <Link href="/our-collection" className="block">
              <div className="parallax-block relative h-[425px] sm:h-[530px] md:h-[640px] overflow-hidden group cursor-pointer rounded-lg">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                >
                  <source src="/0124(33).mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                  <span className="text-xs tracking-[0.4em] mb-4 opacity-90 uppercase font-medium">Selected</span>
                  <h4 className="text-3xl sm:text-4xl font-serif mb-6 tracking-wider uppercase">
                    Glow Collection
                  </h4>
                  <span className="inline-flex items-center gap-2 text-xs tracking-[0.2em] border-b border-white/50 pb-1 group-hover:border-white transition-colors uppercase font-semibold">
                    Explore Collection <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>

            {/* Stawi Scents */}
            <Link href="/our-collection?category=scents" className="block">
              <div className="parallax-block relative h-[425px] sm:h-[530px] md:h-[640px] overflow-hidden group cursor-pointer rounded-lg">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                >
                  <source src="/0124.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                  <span className="text-xs tracking-[0.4em] mb-4 opacity-90 uppercase font-medium">Selected</span>
                  <h4 className="text-3xl sm:text-4xl font-serif mb-6 tracking-wider uppercase">
                    Stawi Scents
                  </h4>
                  <span className="inline-flex items-center gap-2 text-xs tracking-[0.2em] border-b border-white/50 pb-1 group-hover:border-white transition-colors uppercase font-semibold">
                    Discover Scents <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>

            {/* Sensations */}
            <Link href="/events" className="block">
              <div className="parallax-block relative h-[425px] sm:h-[530px] md:h-[640px] overflow-hidden group cursor-pointer rounded-lg">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                >
                  <source src="/0124(1)3.mp4" type="video/mp4" />
                </video>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                  <span className="text-xs tracking-[0.4em] mb-4 opacity-90 uppercase font-medium">Events</span>
                  <h4 className="text-3xl sm:text-4xl font-serif mb-6 tracking-wider uppercase">
                    Sensations
                  </h4>
                  <span className="inline-flex items-center gap-2 text-xs tracking-[0.2em] border-b border-white/50 pb-1 group-hover:border-white transition-colors uppercase font-semibold">
                    Book Events <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section ref={valuesRef} className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 sm:gap-16">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 mb-6 relative">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full text-[#2C2420]">
                  <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" />
                  <path d="M12 6a6 6 0 1 0 6 6 6 6 0 0 0-6-6zm0 10a4 4 0 1 1 4-4 4 4 0 0 1-4 4z" />
                  <path d="M12 8a2 2 0 1 0 2 2 2 2 0 0 0-2-2z" />
                  <path d="M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                </svg>
              </div>
              <h4 className="text-xl font-serif mb-4 font-bold tracking-wider">Circular</h4>
              <p className="text-sm text-[#5C5450] leading-relaxed max-w-[280px]">
                A model that emphasizes reusing, recycling and durability, aiming to eliminate waste and keep resources in use for as long as possible.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 mb-6 relative">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full text-[#2C2420]">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <h4 className="text-xl font-serif mb-4 font-bold tracking-wider">Sustainable</h4>
              <p className="text-sm text-[#5C5450] leading-relaxed max-w-[280px]">
                Practices that meet present needs without compromising the ability of future generations to meet theirs, balancing environmental, social, and economic impacts.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 mb-6 relative">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full text-[#2C2420]">
                  <path d="M12 3v18M3 12h18M5 19l14-14M5 5l14 14" />
                </svg>
              </div>
              <h4 className="text-xl font-serif mb-4 font-bold tracking-wider">Ethical</h4>
              <p className="text-sm text-[#5C5450] leading-relaxed max-w-[280px]">
                A focus on fair practices, including equitable labor conditions, transparency, and respect for communities and the environment throughout the production process.
              </p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 mb-6 relative">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-full h-full text-[#2C2420]">
                  <path d="M3 21h18M3 10h18M5 10V7l7-4 7 4v3M7 21v-11M11 21v-11M13 21v-11M17 21v-11" />
                </svg>
              </div>
              <h4 className="text-xl font-serif mb-4 font-bold tracking-wider">Heritage</h4>
              <p className="text-sm text-[#5C5450] leading-relaxed max-w-[280px]">
                The legacy of cultural practices and traditional craftsmanship that informs our designs and values, celebrating the richness of African traditions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2C2420] text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <div className="lg:col-span-1">
              <div className="relative w-40 h-10 mb-6">
                <Image
                  src="/images/logo.png"
                  alt="Stawi"
                  fill
                  className="object-contain brightness-0 invert"
                />
              </div>
              <p className="text-sm text-white/70 leading-relaxed mb-6">
                Cosmetics and Beauty products handcrafted with African excellence. Each piece tells a story of timeless elegance
                and superior craftsmanship.
              </p>
              <div className="flex gap-4">
                <a href="#" className="hover:text-[#8B4513] transition-colors"><Instagram className="w-5 h-5" /></a>
                <a href="#" className="hover:text-[#8B4513] transition-colors"><Facebook className="w-5 h-5" /></a>
                <a href="#" className="hover:text-[#8B4513] transition-colors"><Twitter className="w-5 h-5" /></a>
              </div>
            </div>
            <div>
              <h4 className="text-xs tracking-[0.2em] mb-6">SHOP</h4>
              <ul className="space-y-3 text-sm text-white/70">
                <li><Link href="/our-collection?category=skincare" className="hover:text-white transition-colors">Skincare</Link></li>
                <li><Link href="/our-collection?category=haircare" className="hover:text-white transition-colors">Haircare</Link></li>
                <li><Link href="/our-collection?category=body-care" className="hover:text-white transition-colors">Body Care</Link></li>
                <li><Link href="/our-collection" className="hover:text-white transition-colors">All Products</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs tracking-[0.2em] mb-6">HELP</h4>
              <ul className="space-y-3 text-sm text-white/70">
                <li><Link href="/shipping-returns" className="hover:text-white transition-colors">Shipping & Returns</Link></li>
                <li><Link href="/care-guide" className="hover:text-white transition-colors">Usage Guide</Link></li>
                <li><Link href="/size-guide" className="hover:text-white transition-colors">Size Guide</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQs</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xs tracking-[0.2em] mb-6 uppercase">Sales</h4>
              <p className="text-sm text-white/70 mb-4">For inquiries about our products, please reach out to us at:</p>
              <ul className="space-y-3 text-sm text-white/70">
                <li className="flex items-center gap-2"><Phone className="w-4 h-4" />+254 794 015 756</li>
                <li className="flex items-center gap-2"><Mail className="w-4 h-4" />info@stawi.ke</li>
                <li className="flex items-center gap-2 pt-2"><MapPin className="w-4 h-4" />Nairobi, Kenya</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-white/50">© 2025 Stawi. All rights reserved.</p>
            <div className="flex gap-6 text-xs text-white/50">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
      <AIChatCompanion />
    </main>
  )
}
