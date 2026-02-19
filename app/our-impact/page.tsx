"use client"

import Image from "next/image"
import { MainNav } from "@/components/navigation/main-nav"
import { Footer } from "@/components/navigation/footer"
import { AIChatCompanion } from "@/components/ai-chat-companion"
import { Users, Leaf, Factory, FileText, Award } from "lucide-react"

export default function OurImpactPage() {
  const stats = [
    {
      icon: <Leaf className="w-8 h-8" />,
      value: "250 +",
      label: "Consumers educated on conscious consumption",
    },
    {
      icon: <Users className="w-8 h-8" />,
      value: "20 +",
      label: "Women and youth from low income backgrounds enabled",
    },
    {
      icon: <Factory className="w-8 h-8" />,
      value: "3",
      label: "Contract production facilities secured",
    },
    {
      icon: <FileText className="w-8 h-8" />,
      value: "1",
      label: "Research paper done and presented",
    },
  ]

  return (
    <div className="min-h-screen">
      <MainNav variant="solid" activeItem="/our-impact" />

      {/* Hero Section */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <Image
          src="/images/IMG_4416(1) (Custom).jpg"
          alt="Sulhaafrika Our Impact"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/50" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div>
            <p className="text-white/80 text-xs tracking-[0.4em] mb-4 uppercase">Purpose Driven</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-white mb-4">
              Our <span className="italic font-light">Impact</span>
            </h1>
            <p className="text-white/80 text-sm sm:text-base max-w-md mx-auto">
              Measuring our progress in creating a sustainable and equitable fashion ecosystem.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {stats.map((stat, index) => (
              <div 
                key={index} 
                className="flex flex-col items-center text-center p-8 rounded-2xl bg-[#FAF8F5]/50 backdrop-blur-sm transition-all duration-500 hover:shadow-xl hover:-translate-y-2 border border-[#E8E4DE]"
              >
                <div className="text-[#8B4513] mb-6 p-4 bg-white/80 rounded-full shadow-sm">
                  {stat.icon}
                </div>
                <div className="text-4xl md:text-5xl font-serif font-bold text-[#2C2420] mb-4">
                  {stat.value}
                </div>
                <p className="text-sm sm:text-base text-[#6B6560] leading-relaxed tracking-wide">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Awards Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-white/80 rounded-full shadow-sm mb-8">
            <Award className="w-10 h-10 text-[#8B4513]" />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif text-[#2C2420] mb-8">
            Recognition & <span className="italic font-light">Milestones</span>
          </h2>
          <div className="bg-white/80 backdrop-blur-sm p-12 rounded-3xl shadow-sm border border-[#E8E4DE]">
            <p className="text-lg md:text-xl text-[#6B6560] leading-relaxed font-light italic">
              "Local and International awards and certificates received"
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl">
              <Image 
                src="/products/IMG_4745 (Custom).jpg"
                alt="Conscious Production"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-8">
              <h3 className="text-sm tracking-[0.4em] text-[#8B4513] font-semibold uppercase">Our Philosophy</h3>
              <h2 className="text-4xl md:text-5xl font-serif text-[#2C2420] leading-tight">
                Empowering Communities Through <span className="italic font-light">Conscious Craft</span>
              </h2>
              <div className="space-y-6 text-[#6B6560] text-lg leading-relaxed font-light">
                <p>
                  At Sulhaafrika, impact is not just a metric—it's the core of why we exist. Every piece handcrafted in our partner facilities represents a step toward economic independence for women and youth.
                </p>
                <p>
                  We believe that by educating consumers on conscious consumption, we can shift the fashion paradigm from disposability to durability, from exploitation to empowerment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Projects Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-[#2C2420] mb-4">Our <span className="italic font-light">Projects</span></h2>
            <div className="w-24 h-1 bg-[#8B4513] mx-auto opacity-20"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 order-2 lg:order-1">
              <h3 className="text-2xl md:text-3xl font-serif text-[#2C2420]">Reviving Indigenous Leather Craft: A Cultural Mission by Sulha Afrika</h3>
              <div className="space-y-6 text-[#6B6560] text-lg leading-relaxed font-light">
                <p>
                  At Sulha Afrika, we are inspired by the Wangozi people—the ancestors of the Swahili—renowned for their advanced leather craftsmanship, which predates foreign influence. Determined to preserve this endangered craft, we co-authored a research paper with a renowned Doctor in Leather Technology, focusing on Lamu Archipelago practices. We presented our findings at the 126th annual conference of the Society of Leather Technologists and Chemists in Northampton, UK.
                </p>
                <p>
                  To further our mission, we've partnered with Enuka, whose work centers on bridging generations through mentorship and co-creating sustainable solutions with communities. Together, we are documenting this heritage through written, photographic, and video formats while ensuring skill transfer to future generations. Our focus is on Siyu village, one of the most marginalized areas in Lamu County, to empower its residents with sustainable economic opportunities while keeping this ancestral knowledge alive.
                </p>
                <p>
                  By combining our expertise and Enuka's mentorship network, we aim to foster intergenerational knowledge sharing, ensuring the legacy of African leather craftsmanship thrives for years to come.
                </p>
              </div>
              <div className="pt-4">
                <p className="text-[#8B4513] font-semibold tracking-wider uppercase text-sm mb-6">Our Partners:</p>
                <div className="flex items-center">
                  <div className="relative w-72 h-24">
                    <Image 
                      src="/images/enuka.png"
                      alt="Enuka Logo"
                      fill
                      className="object-contain object-left"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl order-1 lg:order-2">
              <Image 
                src="/products/IMG_4436 (Custom).jpg"
                alt="African Leather Craftsmanship"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Partners Section (Laikipia Value Chain) */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl">
              <Image 
                src="/products/washbag.jpg"
                alt="Laikipia Landscape"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-serif text-[#2C2420]">Exploring the Leather Value Chain within Laikipia County</h2>
              <div className="space-y-6 text-[#6B6560] text-lg leading-relaxed font-light">
                <p>
                  At Sulha Afrika, we're thrilled to collaborate with the Laikipia Permaculture Centre Trust (LPC) on an exciting project to explore the full leather value chain within Laikipia. From sourcing raw hides and skins to producing high-quality finished leather goods, our goal is to empower women and youth along the way.
                </p>
                <p>
                  LPC's community-led approach, rooted in sustainable resource management and gender equality, aligns with our mission to build eco-friendly, circular systems. Through this partnership, we'll ensure that each step—from flaying materials to crafting finished leather products—contributes to both economic growth and environmental regeneration.
                </p>
                <p>
                  Together with LPC's network of self-help groups and expertise in sustainable practices, we aim to unlock new opportunities in leather production. This initiative will not only preserve indigenous skills but also provide essential income streams for women and youth, fostering resilience in a region deeply impacted by climate change.
                </p>
                <p className="italic">
                  We look forward to co-creating a vibrant, sustainable leather ecosystem—rooted in African tradition and regenerative practices—for future generations.
                </p>
              </div>
              <div className="pt-12 border-t border-[#E8E4DE]">
                <p className="text-[#8B4513] font-semibold tracking-wider uppercase text-sm mb-8">Our Partners:</p>
                <div className="flex flex-col items-center">
                  <p className="text-[#2C2420] font-serif italic text-xl mb-6">Laikipia Permaculture Centre Trust (LPC)</p>
                  <div className="relative w-64 h-64">
                    <Image 
                      src="/images/logolsikipis.jpeg"
                      alt="Partner Logo"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tagline Section */}
      <section className="py-24 bg-[#2C2420]/90 backdrop-blur-sm text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif">
            Get a <span className="italic font-light">Sulha</span>(solution), <br className="md:hidden" />
            Be a <span className="italic font-light">Sulha</span>(solution)
          </h2>
        </div>
      </section>

      <Footer />
      <AIChatCompanion />
    </div>
  )
}
