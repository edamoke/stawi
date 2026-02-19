"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { MainNav } from "@/components/navigation/main-nav"
import { Instagram, Facebook, Twitter, MapPin, Phone, Mail, ArrowRight, CheckCircle2, Leaf, Heart, Recycle, Users, Award, ShieldCheck, Zap } from "lucide-react"

export default function DiaryPage() {
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <main className="min-h-screen text-[#2C2420] overflow-x-hidden">
      {/* Navigation */}
      <MainNav variant={isScrolled ? "solid" : "transparent"} showPromoBanner={true} />

      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/IMG_4419(1) (Custom).jpg"
          alt="Sulha Afrika Heritage"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="relative z-10 text-center text-white px-4 max-w-4xl">
          <span className="text-xs tracking-[0.4em] mb-4 block uppercase font-medium">ESTABLISHED IN AFRICA</span>
          <h1 className="text-5xl md:text-7xl font-serif mb-8 tracking-wider">
            Who We Are
          </h1>
          <p className="text-lg md:text-xl font-light leading-relaxed max-w-2xl mx-auto opacity-90">
            Welcome to Sulha Afrika, the genuine African solution. We are your premier source for exquisite, sustainable genuine leather bags, accessories, and indigenous shoes.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-[4/5] rounded-lg overflow-hidden shadow-2xl">
              <Image
                src="/images/IMG_4413(2) (Custom).jpg"
                alt="Our Story"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="text-sm tracking-[0.4em] text-[#8B4513] block font-semibold uppercase">Our Story</span>
                <h2 className="text-4xl sm:text-5xl font-serif font-bold">Inspired by African Heritage</h2>
                <p className="text-xl italic text-[#8B4513]">The genuine African solution to global challenges</p>
              </div>
              
              <div className="space-y-6 text-lg text-[#5C5450] leading-relaxed">
                <p>
                  Did you know that Indigenous African cultures never needed words like "sustainability" or "circular economy"? Why?—it was simply a way of life. Guided by these time-honored traditions, where nothing was wasted, we blend ancient practices with modern innovations to offer eco-conscious solutions.
                </p>
                <p>
                  Founded by Fatuma Ali, a petroleum and natural gas engineer turned social entrepreneur, Sulha Afrika bridges heritage and sustainability. Our products, crafted from livestock hides and fish skins, reduce waste while empowering communities, particularly women and youth.
                </p>
                <p>
                  Sulha, meaning "solution" in Swahili, reflects our mission to address environmental challenges through thoughtful design.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision Cards */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-sm p-12 rounded-lg shadow-sm border border-[#E8E4DE] text-center space-y-6">
              <div className="w-16 h-16 bg-[#F5F3F0]/80 rounded-full flex items-center justify-center mx-auto">
                <Zap className="w-8 h-8 text-[#8B4513]" />
              </div>
              <h3 className="text-2xl font-serif font-bold">Our Mission</h3>
              <p className="text-[#5C5450]">To sustainably elevate your style while celebrating the African heritage</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-12 rounded-lg shadow-sm border border-[#E8E4DE] text-center space-y-6">
              <div className="w-16 h-16 bg-[#F5F3F0]/80 rounded-full flex items-center justify-center mx-auto">
                <Award className="w-8 h-8 text-[#8B4513]" />
              </div>
              <h3 className="text-2xl font-serif font-bold">Our Vision</h3>
              <p className="text-[#5C5450]">To become a global sustainable and attainable African brand</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm p-12 rounded-lg shadow-sm border border-[#E8E4DE] text-center space-y-6">
              <div className="w-16 h-16 bg-[#F5F3F0]/80 rounded-full flex items-center justify-center mx-auto">
                <Recycle className="w-8 h-8 text-[#8B4513]" />
              </div>
              <h3 className="text-2xl font-serif font-bold">Our Goal</h3>
              <p className="text-[#5C5450]">To do value addition on raw hides and skins from livestock and fishing industries into high-quality and circular genuine leather products</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainable Development & Economies */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div className="space-y-12">
              <h3 className="text-3xl font-serif font-bold border-b border-[#E8E4DE] pb-4">United Nation Sustainable Development Goals</h3>
              <div className="grid sm:grid-cols-2 gap-8">
                {[
                  { title: "Climate Action", icon: Leaf },
                  { title: "Responsible Consumption", icon: Recycle },
                  { title: "Gender Equality", icon: Users }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <item.icon className="w-6 h-6 text-[#8B4513]" />
                    <span className="font-medium text-lg">{item.title}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-12">
              <h3 className="text-3xl font-serif font-bold border-b border-[#E8E4DE] pb-4">Economies We Impact</h3>
              <div className="grid sm:grid-cols-2 gap-8">
                {[
                  { title: "Green Economy", icon: Leaf },
                  { title: "Blue Economy", icon: Zap },
                  { title: "Circular Economy", icon: Recycle }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <item.icon className="w-6 h-6 text-[#8B4513]" />
                    <span className="font-medium text-lg">{item.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-[#2C2420]/90 backdrop-blur-sm text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold">Our Core Values</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              { title: "Transparency", desc: "Honesty and clarity in every aspect of our operations.", icon: ShieldCheck },
              { title: "Customer Focus", desc: "Putting customers at the heart of everything we do.", icon: Heart },
              { title: "Accountability", desc: "Taking responsibility for delivering on our promises.", icon: CheckCircle2 },
              { title: "Quality", desc: "Reflected in every product we create and service we offer.", icon: Award },
              { title: "Gender Equality", desc: "Fostering an inclusive environment where all voices are heard.", icon: Users },
              { title: "Environmental Focus", desc: "Minimizing our footprint and championing sustainability.", icon: Leaf },
              { title: "Empathy", desc: "Connecting with our community through trust and understanding.", icon: Heart }
            ].map((value, i) => (
              <div key={i} className="space-y-4">
                <div className="flex items-center gap-3">
                  <value.icon className="w-6 h-6 text-[#C9A86C]" />
                  <h4 className="text-xl font-bold">{value.title}</h4>
                </div>
                <p className="text-white/70 leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm tracking-[0.4em] text-[#8B4513] block font-semibold uppercase mb-4">What We Do</span>
            <h2 className="text-4xl sm:text-5xl font-serif font-bold">Our Services</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Consultancy", desc: "Guiding you through the leather value chain—from planning to execution and market entry." },
              { title: "Corporate Branding & Gifting", desc: "Creating sustainable, thoughtful gifts that leave a lasting impression." },
              { title: "Outsourcing", desc: "Connecting you with skilled artisans for high-quality production tailored to your needs." },
              { title: "Private Labeling", desc: "Crafting custom solutions that reflect your brand vision." },
              { title: "Consignment", desc: "Collaborating with retail spaces to grow together." }
            ].map((service, i) => (
              <div key={i} className="p-8 border border-[#E8E4DE] rounded-lg hover:shadow-lg transition-shadow bg-white/60 backdrop-blur-sm">
                <span className="text-[#8B4513] font-bold text-lg mb-4 block">0{i+1}.</span>
                <h4 className="text-xl font-bold mb-4">{service.title}</h4>
                <p className="text-[#5C5450] leading-relaxed">{service.desc}</p>
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
              <h2 className="font-serif text-2xl tracking-[0.15em] mb-6">SULHAAFRIKA</h2>
              <p className="text-sm text-white/70 leading-relaxed mb-6">
                Premium leather bags handcrafted with African excellence. Each piece tells a story of timeless elegance
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
                  hello@sulhaafrika.com
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-white/50">© 2025 Sulhaafrika. All rights reserved.</p>
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
