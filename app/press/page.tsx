"use client"

import { useState } from "react"
import Image from "next/image"
import { MainNav } from "@/components/navigation/main-nav"
import { Footer } from "@/components/navigation/footer"
import { ArrowRight, ExternalLink, Play } from "lucide-react"

const pressFeatures = [
  {
    publication: "Vogue Africa",
    title: "Trevor: Redefining Kenyan Luxury Fashion",
    excerpt: "The Nairobi-based brand is making waves with its blend of coastal elegance and modern sophistication...",
    date: "November 2024",
    image: "/beautiful-black-african-woman-model-fashion-magazi.jpg",
    featured: true,
  },
  {
    publication: "Daily Nation",
    title: "Local Brand Trevor Takes African Fashion Global",
    excerpt: "From Westlands to the world, this Kenyan fashion house is rewriting the rules of African luxury...",
    date: "October 2024",
    image: "/fashion-magazine-editorial-photoshoot-elegant-afri.jpg",
  },
  {
    publication: "Business Daily",
    title: "How Trevor is Disrupting Kenya's Fashion Industry",
    excerpt:
      "With a focus on sustainability and local craftsmanship, Trevor is building a new model for African fashion...",
    date: "September 2024",
    image: "/elegant-african-woman-writing-journal-coastal-keny.jpg",
  },
  {
    publication: "Elle East Africa",
    title: "The Rise of Coastal Elegance",
    excerpt: "Trevor's latest collection celebrates the beauty of Kenya's coastline with stunning resort wear...",
    date: "August 2024",
    image: "/kenyan-woman-in-elegant-resort-dress-mombasa-beach.jpg",
  },
  {
    publication: "Standard Media",
    title: "Trevor Founder Named in Top 40 Under 40",
    excerpt: "Recognition for innovation in sustainable fashion and commitment to Kenyan craftsmanship...",
    date: "July 2024",
    image: "/beautiful-african-woman-in-elegant-tropical-resort.jpg",
  },
  {
    publication: "Marie Claire Africa",
    title: "The Brand Making Kenyan Fashion Cool",
    excerpt: "How Trevor is attracting a new generation of fashion-conscious African women...",
    date: "June 2024",
    image: "/black-african-woman-model-kenyan-fashion-instagram.jpg",
  },
]

const awards = [
  { year: "2024", title: "Best Emerging African Fashion Brand", org: "Africa Fashion Week" },
  { year: "2024", title: "Sustainable Fashion Award", org: "Kenya Fashion Council" },
  { year: "2023", title: "Innovation in Retail", org: "Nairobi Business Awards" },
  { year: "2023", title: "Best E-commerce Fashion Brand", org: "Digital Kenya Awards" },
]

const videoFeatures = [
  {
    title: "Behind the Scenes: Lamu Collection",
    duration: "4:32",
    thumbnail: "/african-resort-wear-swimwear-lamu-island.jpg",
  },
  {
    title: "Meet Our Artisans",
    duration: "6:15",
    thumbnail: "/elegant-african-gold-jewelry-accessories-black-wom.jpg",
  },
  {
    title: "Trevor at Nairobi Fashion Week",
    duration: "8:45",
    thumbnail: "/beautiful-black-african-woman-model-elegant-dress-.jpg",
  },
]

export default function PressPage() {
  const [activeFilter, setActiveFilter] = useState("all")

  return (
    <div className="min-h-screen">
      <MainNav variant="solid" />

      {/* Hero Section */}
      <section className="relative h-[50vh] sm:h-[60vh] overflow-hidden">
        <Image
          src="/beautiful-black-african-woman-model-fashion-magazi.jpg"
          alt="Press Hero"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white px-4">
          <span className="text-xs sm:text-sm tracking-[0.4em] mb-4 text-[#C9A86C]">TREVOR IN THE MEDIA</span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif mb-4">Press</h1>
          <p className="text-sm sm:text-base tracking-wide opacity-90 max-w-lg">
            News and features from leading media outlets
          </p>
        </div>
      </section>

      {/* Featured Press */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-xs tracking-[0.3em] text-[#C9A86C] mb-3 block">FEATURED</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif">As Featured In</h2>
          </div>

          {/* Featured Article */}
          {pressFeatures
            .filter((p) => p.featured)
            .map((feature, index) => (
              <div key={index} className="mb-16 sm:mb-20">
                <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
                    <Image
                      src={feature.image || "/placeholder.svg"}
                      alt={feature.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    <div className="absolute top-4 left-4 bg-[#C9A86C] text-white px-3 py-1 text-xs tracking-wider rounded-sm">
                      FEATURED
                    </div>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-serif text-[#C9A86C]">{feature.publication}</span>
                      <span className="text-xs text-[#8B8178] tracking-wider">{feature.date}</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif leading-tight">{feature.title}</h3>
                    <p className="text-[#8B8178] leading-relaxed">{feature.excerpt}</p>
                    <a
                      href="#"
                      className="inline-flex items-center gap-3 text-xs tracking-[0.2em] text-[#2C2420] border-b border-[#2C2420] pb-1 hover:text-[#C9A86C] hover:border-[#C9A86C] transition-colors"
                    >
                      READ FULL ARTICLE <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            ))}

          {/* Press Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {pressFeatures
              .filter((p) => !p.featured)
              .map((feature, index) => (
                <article key={index} className="group cursor-pointer">
                  <div className="relative aspect-[4/3] mb-4 overflow-hidden bg-[#F5F3F0] rounded-lg">
                    <Image
                      src={feature.image || "/placeholder.svg"}
                      alt={feature.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-medium tracking-wider text-[#C9A86C]">{feature.publication}</span>
                    <span className="text-xs text-[#8B8178]">{feature.date}</span>
                  </div>
                  <h3 className="font-serif text-lg sm:text-xl mb-2 group-hover:text-[#C9A86C] transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-[#8B8178] line-clamp-2">{feature.excerpt}</p>
                </article>
              ))}
          </div>
        </div>
      </section>

      {/* Video Features */}
      <section className="py-16 sm:py-24 bg-[#2C2420] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-xs tracking-[0.3em] text-[#C9A86C] mb-3 block">VIDEO</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif">Watch and Listen</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {videoFeatures.map((video, index) => (
              <div key={index} className="group cursor-pointer">
                <div className="relative aspect-video mb-4 overflow-hidden rounded-lg">
                  <Image
                    src={video.thumbnail || "/placeholder.svg"}
                    alt={video.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play className="w-6 h-6 text-white fill-white ml-1" />
                    </div>
                  </div>
                  <span className="absolute bottom-3 right-3 bg-black/60 text-white text-xs px-2 py-1 rounded-sm">
                    {video.duration}
                  </span>
                </div>
                <h3 className="font-serif text-lg group-hover:text-[#C9A86C] transition-colors">{video.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <span className="text-xs tracking-[0.3em] text-[#C9A86C] mb-3 block">RECOGNITION</span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif mb-6">Awards and Honors</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {awards.map((award, index) => (
              <div
                key={index}
                className="text-center p-6 sm:p-8 border border-[#E8E4DE] hover:border-[#C9A86C] transition-colors rounded-lg"
              >
                <span className="text-4xl sm:text-5xl font-serif text-[#C9A86C] mb-4 block">{award.year}</span>
                <h3 className="font-serif text-lg mb-2">{award.title}</h3>
                <p className="text-sm text-[#8B8178]">{award.org}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Press Contact */}
      <section className="py-16 sm:py-24 bg-[#F5F3F0]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="text-xs tracking-[0.3em] text-[#C9A86C] mb-3 block">PRESS INQUIRIES</span>
          <h2 className="text-3xl sm:text-4xl font-serif mb-6">Press Contact</h2>
          <p className="text-[#8B8178] mb-8 leading-relaxed">
            For interviews, press photos, or more information about Trevor, please contact our communications team.
          </p>
          <div className="space-y-4">
            <a
              href="mailto:press@trevor.co.ke"
              className="block text-lg font-serif text-[#2C2420] hover:text-[#C9A86C] transition-colors"
            >
              press@trevor.co.ke
            </a>
            <a
              href="tel:+254700123456"
              className="block text-lg font-serif text-[#2C2420] hover:text-[#C9A86C] transition-colors"
            >
              +254 700 123 456
            </a>
          </div>
          <div className="mt-10">
            <a
              href="#"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#2C2420] text-white text-xs tracking-[0.2em] hover:bg-[#3D322C] transition-colors rounded-sm"
            >
              DOWNLOAD PRESS KIT <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
