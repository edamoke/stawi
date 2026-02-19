"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"
import { createClient } from "@/lib/supabase/client"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

interface HeroSlide {
  id: string
  image_url: string
  alt: string
  heading: string
  subheading: string
  description: string | null
  position: number
  active: boolean
}

export function HeroSlider() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [heroImages, setHeroImages] = useState<HeroSlide[]>([])
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 6000, stopOnInteraction: false }),
  ])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const imageRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const fetchSlides = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("hero_slides")
        .select("*")
        .eq("active", true)
        .order("position", { ascending: true })

      if (data && !error) {
        setHeroImages(data)
      }
    }

    fetchSlides()
    setIsLoaded(true)
    gsap.registerPlugin(ScrollTrigger)
  }, [])

  useEffect(() => {
    if (sectionRef.current && heroImages.length > 0) {
      // Parallax effect for images
      imageRefs.current.forEach((img) => {
        if (img) {
          gsap.to(img, {
            yPercent: 20,
            ease: "none",
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          })
        }
      })

      // Content fade out on scroll
      if (contentRef.current) {
        gsap.to(contentRef.current, {
          opacity: 0,
          y: -50,
          ease: "power1.in",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom 50%",
            scrub: true,
          },
        })
      }
    }
  }, [heroImages])

  useEffect(() => {
    if (!emblaApi) return

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
    }

    emblaApi.on("select", onSelect)
    return () => {
      emblaApi.off("select", onSelect)
    }
  }, [emblaApi])

  const handlePrev = () => {
    emblaApi?.scrollPrev()
  }

  const handleNext = () => {
    emblaApi?.scrollNext()
  }

  if (heroImages.length === 0) {
    return (
      <section className="relative h-screen min-h-[600px] overflow-hidden bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">Loading hero section...</p>
      </section>
    )
  }

  return (
    <section ref={sectionRef} className="relative h-[110vh] min-h-[700px] overflow-hidden">
      <div className="embla h-full" ref={emblaRef}>
        <div className="embla__container h-full">
          {heroImages.map((image, index) => (
            <div key={image.id} className="embla__slide h-full flex-[0_0_100%] overflow-hidden">
              <div
                ref={(el) => {
                  imageRefs.current[index] = el
                }}
                className="absolute inset-0 w-full h-[120%] -top-[10%]"
              >
                <Image
                  src={image.image_url || "/placeholder.svg"}
                  alt={image.alt}
                  fill
                  priority={index === 0}
                  className="object-cover object-center"
                  sizes="100vw"
                  quality={95}
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        ref={contentRef}
        className="absolute inset-0 z-[5] flex flex-col items-center justify-center text-white px-4 pointer-events-none max-w-7xl mx-auto"
      >
        <div
          className={`text-center transition-all duration-1000 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <span className="text-[10px] sm:text-[13px] md:text-sm tracking-[0.7em] mb-8 block text-white/90 font-medium uppercase">
            Handcrafted in Africa
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif mb-8 leading-[0.8] tracking-tighter uppercase hero-text-shadow">
            <span className="block font-bold mix-blend-difference">{heroImages[selectedIndex]?.heading}</span>
            <span className="block italic font-light text-white/80 mt-4 normal-case text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
              {heroImages[selectedIndex]?.subheading}
            </span>
          </h2>
          <div className="w-24 h-[1px] bg-white/40 mx-auto mb-8" />
          <p className="text-sm sm:text-base md:text-lg text-white/80 max-w-2xl mx-auto mb-12 leading-relaxed tracking-[0.1em] font-light">
            {heroImages[selectedIndex]?.description}
          </p>
          <Link
            href="/our-collection"
            className="inline-flex items-center gap-4 border border-white/30 backdrop-blur-sm text-white px-12 py-6 text-xs font-bold tracking-[0.4em] hover:bg-white hover:text-[#2C2420] transition-all duration-700 hover:scale-105 pointer-events-auto uppercase"
          >
            Explore Collection <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      <button
        onClick={handlePrev}
        className="absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white p-2 sm:p-3 transition-all duration-300 backdrop-blur-sm hover:scale-105 pointer-events-auto"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <button
        onClick={handleNext}
        className="absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 z-10 bg-white/20 hover:bg-white/40 text-white p-2 sm:p-3 transition-all duration-300 backdrop-blur-sm hover:scale-105 pointer-events-auto"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
      </button>

      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-10 flex gap-3 pointer-events-auto">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={`h-3 rounded-full transition-all duration-500 ${
              index === selectedIndex ? "bg-white w-12" : "bg-white/60 w-3 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <ChevronDown className="w-6 h-6 text-white/60" />
      </div>
    </section>
  )
}
