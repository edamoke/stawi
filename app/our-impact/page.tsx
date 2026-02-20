"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { MainNav } from "@/components/navigation/main-nav"
import { Heart, Globe, Users, Leaf, Sparkles, ShieldCheck, ArrowRight } from "lucide-react"

export default function OurImpactPage() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <main className="min-h-screen text-[#2C2420] bg-white overflow-x-hidden">
      <MainNav variant={isScrolled ? "solid" : "transparent"} showPromoBanner={true} />

      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/Website photos/IMG_4761 (Custom).jpg"
          alt="Stawi Our Impact"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-serif mb-6">Beauty with Purpose</h1>
          <p className="text-xl md:text-2xl font-light tracking-wide italic">Creating a sustainable future through African botanical excellence.</p>
        </div>
      </section>

      {/* Core Philosophy */}
      <section className="py-24 sm:py-32 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <span className="text-sm tracking-[0.4em] text-[#8B4513] font-semibold uppercase">Our Philosophy</span>
            <h2 className="text-4xl sm:text-5xl font-serif text-[#2C2420]">Empowering Communities Through Natural Beauty</h2>
            <p className="text-lg text-[#5C5450] leading-relaxed">
              At Stawi, impact is not just a metric—it's the core of why we exist. Every product crafted represents a step toward economic independence for women and youth across Kenya, while preserving our rich botanical heritage.
            </p>
          </div>
        </div>
      </section>

      {/* Impact Pillars */}
      <section className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-16">
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-[#F5F3F0] rounded-full flex items-center justify-center mx-auto">
                <Users className="w-8 h-8 text-[#8B4513]" />
              </div>
              <h3 className="text-2xl font-serif">Community Empowerment</h3>
              <p className="text-[#5C5450] leading-relaxed">
                We partner with local farmers and wild-harvesters, ensuring fair wages and sustainable livelihoods for the guardians of our natural ingredients.
              </p>
            </div>

            <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-[#F5F3F0] rounded-full flex items-center justify-center mx-auto">
                <Leaf className="w-8 h-8 text-[#8B4513]" />
              </div>
              <h3 className="text-2xl font-serif">Regenerative Sourcing</h3>
              <p className="text-[#5C5450] leading-relaxed">
                Our ingredients are sourced using regenerative practices that protect biodiversity and restore the Kenyan landscapes we call home.
              </p>
            </div>

            <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-[#F5F3F0] rounded-full flex items-center justify-center mx-auto">
                <Globe className="w-8 h-8 text-[#8B4513]" />
              </div>
              <h3 className="text-2xl font-serif">Circular Beauty</h3>
              <p className="text-[#5C5450] leading-relaxed">
                From biodegradable formulations to recyclable packaging, we are committed to a circular system that honors the Earth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 sm:py-32 bg-[#2C2420] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl sm:text-5xl font-serif">Preserving Ancestral Wisdom</h2>
              <div className="space-y-6 text-lg text-white/80 leading-relaxed">
                <p>
                  For generations, African communities have used botanical oils and extracts for healing and beauty. At Stawi, we are determined to preserve this precious knowledge, blending it with modern science to create effective, pure skincare.
                </p>
                <p>
                  By partnering with research institutions and local experts, we aim to document and protect the traditional use of Kenyan botanicals, ensuring this legacy thrives for future generations.
                </p>
              </div>
              <Link href="/our-collection" className="inline-flex items-center gap-2 border-b border-white pb-2 text-sm tracking-widest uppercase hover:text-[#C9A86C] hover:border-[#C9A86C] transition-all">
                Explore our products <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <Image
                src="/Website photos/IMG_4708 (Custom).jpg"
                alt="Impact Story"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 text-center bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="font-serif text-2xl tracking-[0.2em] mb-4 text-[#2C2420]">Stawi</h2>
          <p className="text-[#6B6560] text-sm mb-8">Join us in our journey toward sustainable beauty.</p>
          <div className="flex justify-center gap-8">
            <Link href="/contact" className="text-sm font-semibold text-[#8B4513] hover:underline">Get Involved</Link>
            <Link href="/our-collection" className="text-sm font-semibold text-[#8B4513] hover:underline">Shop Consciously</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
