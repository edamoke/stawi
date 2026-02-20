"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { MainNav } from "@/components/navigation/main-nav"
import { Heart, Droplets, Leaf, Sparkles, ShieldCheck, Sun, Wind, Recycle } from "lucide-react"

export default function CareGuidePage() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <main className="min-h-screen text-[#2C2420] bg-[#FAF8F5]">
      <MainNav variant={isScrolled ? "solid" : "transparent"} showPromoBanner={true} />

      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/IMG_4416(1) (Custom).jpg"
          alt="Stawi Beauty Guide"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-6xl font-serif mb-4">Beauty Guide</h1>
          <p className="text-lg md:text-xl font-light tracking-wide uppercase">Caring for your natural radiance</p>
        </div>
      </section>

      {/* Guide Content */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="prose prose-stone prose-lg max-w-none text-[#5C5450]">
          <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-[#E8E4DE] mb-16">
            <h2 className="text-3xl font-serif text-[#2C2420] mt-0 mb-6">Natural Skincare Rituals</h2>
            <p>
              Our Glow Collection is formulated with premium African botanicals that nourish and revitalize your skin. To ensure you get the best results from our natural products, follow these usage rituals:
            </p>

            <div className="grid gap-12 mt-12">
              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-[#F5F3F0] rounded-full flex items-center justify-center">
                  <Droplets className="w-6 h-6 text-[#8B4513]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#2C2420] mb-2">Cleansing</h3>
                  <p>Always start with clean skin. Use lukewarm water and a gentle touch to prepare your skin for botanical nourishment.</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-[#F5F3F0] rounded-full flex items-center justify-center">
                  <Sparkles className="w-6 h-6 text-[#8B4513]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#2C2420] mb-2">Application</h3>
                  <p>Apply serums and oils while your skin is still slightly damp. This helps lock in moisture and allows deeper penetration of active ingredients.</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-[#F5F3F0] rounded-full flex items-center justify-center">
                  <Sun className="w-6 h-6 text-[#8B4513]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#2C2420] mb-2">Protection</h3>
                  <p>Store your products in a cool, dry place away from direct sunlight to preserve the potency of our natural botanical extracts.</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-[#F5F3F0] rounded-full flex items-center justify-center">
                  <Heart className="w-6 h-6 text-[#8B4513]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#2C2420] mb-2">Consistency</h3>
                  <p>Natural beauty is a journey. For optimal results, maintain a consistent morning and evening ritual using the complete Stawi system.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#2C2420] text-white p-8 sm:p-12 rounded-2xl mb-16">
            <h2 className="text-3xl font-serif text-white mt-0 mb-6">Our Purity Standard</h2>
            <p className="text-white/80">Every Stawi product is crafted with respect for nature and your skin:</p>
            <ul className="list-none pl-0 grid sm:grid-cols-2 gap-4 mt-8">
              <li className="flex items-center gap-3">
                <Leaf className="w-5 h-5 text-[#C9A86C]" />
                <span>100% Botanical Ingredients</span>
              </li>
              <li className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-[#C9A86C]" />
                <span>Dermatologically Tested</span>
              </li>
              <li className="flex items-center gap-3">
                <Droplets className="w-5 h-5 text-[#C9A86C]" />
                <span>No Synthetic Fragrances</span>
              </li>
              <li className="flex items-center gap-3">
                <Recycle className="w-5 h-5 text-[#C9A86C]" />
                <span>Sustainable Packaging</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2C2420] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="font-serif text-2xl tracking-[0.2em] mb-4">Stawi</h2>
          <p className="text-white/50 text-sm mb-8">Pure. Natural. African.</p>
          <Link href="/our-collection" className="inline-block border-b border-white pb-1 text-sm tracking-widest uppercase hover:text-[#C9A86C] transition-colors">
            Shop the Collection
          </Link>
        </div>
      </footer>
    </main>
  )
}
