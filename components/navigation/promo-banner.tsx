"use client"

import { LanguageSwitcher } from "./language-switcher"

export function PromoBanner() {
  return (
    <div className="bg-[#C9A86C] text-white py-2.5 overflow-hidden relative">
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-10 hidden sm:block">
        <LanguageSwitcher />
      </div>

      <div className="animate-marquee whitespace-nowrap flex">
        {[...Array(8)].map((_, i) => (
          <span key={i} className="mx-12 text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.25em] font-medium uppercase">
            Latest Arrivals • Latest Arrivals • Latest Arrivals • Latest Arrivals •
          </span>
        ))}
      </div>
    </div>
  )
}
