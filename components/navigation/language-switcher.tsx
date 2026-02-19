"use client"

import { useState, useRef, useEffect } from "react"
import { Globe, ChevronDown } from "lucide-react"

const languages = [
  { code: "en", name: "English", flag: "🇬🇧" },
  { code: "sw", name: "Swahili", flag: "🇰🇪" },
  { code: "fr", name: "Français", flag: "🇫🇷" },
  { code: "it", name: "Italiano", flag: "🇮🇹" },
]

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState(languages[0])
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (lang: (typeof languages)[0]) => {
    setCurrentLang(lang)
    setIsOpen(false)
    // In a real app, you'd trigger translation here
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 text-xs tracking-wider hover:text-[#C9A86C] transition-colors"
      >
        <Globe className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{currentLang.code.toUpperCase()}</span>
        <ChevronDown className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 bg-white border border-[#E8E4DE] shadow-lg rounded-sm overflow-hidden z-50 min-w-[140px]">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang)}
              className={`w-full px-4 py-2.5 text-left text-xs tracking-wider flex items-center gap-2 hover:bg-[#FAF8F5] transition-colors ${
                currentLang.code === lang.code ? "bg-[#FAF8F5] text-[#C9A86C]" : "text-[#2C2420]"
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
