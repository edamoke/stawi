 "use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Search, Heart, ShoppingBag, Menu, X, User } from "lucide-react"
import { useCart } from "@/context/cart-context"

interface MainNavProps {
  variant?: "transparent" | "solid"
  activeItem?: string
  showPromoBanner?: boolean
}

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"

const shopSubItems = [
  { label: "GLOW COLLECTION", href: "/our-collection?view=collections" },
  { label: "SENSATIONS", href: "/events" },
  { label: "Stawi SCENTS", href: "/our-collection?category=scents" },
]

const navItems = [
  { label: "HOME", href: "/" },
  { label: "SHOP", href: "/our-collection", hasDropdown: true },
  { label: "IMPACT", href: "/our-impact" },
  { label: "JOURNAL", href: "/diary" },
  { label: "CONTACT US", href: "/contact" },
]

export function MainNav({ variant = "solid", activeItem, showPromoBanner = true }: MainNavProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [mobileShopOpen, setMobileShopOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()
  const { totalItems, openCart } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen])

  const isTransparent = variant === "transparent" && !isScrolled
  const textColor = isTransparent ? "text-white" : "text-[#2C2420]"
  const logoColor = isTransparent ? "text-white" : "text-[#2C2420]"

  const navStyles = `
    .burger-menu-content, 
    .nav-dropdown-content,
    .mobile-shop-dropdown,
    .mobile-nav-link,
    .nav-item-bg {
      background-color: #ffffff !important;
      background: #ffffff !important;
      opacity: 1 !important;
      visibility: visible !important;
      backdrop-filter: none !important;
      -webkit-backdrop-filter: none !important;
    }
    .nav-dropdown-content {
      z-index: 200 !important;
    }
    .burger-menu-content {
      z-index: 1000 !important;
    }
    div[data-radix-popper-content-wrapper] {
      opacity: 1 !important;
    }
  `

  const isActive = (href: string) => {
    if (activeItem) return activeItem === href
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: navStyles }} />
      {/* Promo Banner - Removed as per request */}

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-[999] transition-all duration-500 lg:hidden ${mobileMenuOpen ? "visible" : "invisible pointer-events-none"}`}
      >
        <div
          className={`absolute inset-0 bg-black/60 transition-opacity duration-500 ${mobileMenuOpen ? "opacity-100" : "opacity-0"}`}
          onClick={() => setMobileMenuOpen(false)}
        />
        <div
          className={`absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white !bg-white transition-transform duration-500 ease-out z-[1000] burger-menu-content ${mobileMenuOpen ? "translate-x-0" : "translate-x-full"}`}
          style={{ backgroundColor: "#ffffff", background: "#ffffff" }}
        >
          <div className="p-6 h-full flex flex-col bg-white !bg-white relative z-10 burger-menu-content" style={{ backgroundColor: "#ffffff", background: "#ffffff" }}>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="absolute top-6 right-6 p-2 hover:bg-[#E8E4DE] rounded-full transition-colors"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="mt-16 space-y-1 flex-1">
              {navItems.map((item) => (
                <div key={item.label} className="nav-item-bg">
                  {item.hasDropdown ? (
                    <>
                      <button
                        onClick={() => setMobileShopOpen(!mobileShopOpen)}
                        className={`flex items-center justify-between w-full py-4 text-sm tracking-[0.15em] transition-colors border-b border-[#2C2420]/10 mobile-nav-link ${
                          isActive(item.href) ? "text-[#8B4513]" : "text-[#2C2420]"
                        }`}
                      >
                        {item.label}
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-300 ${mobileShopOpen ? "rotate-180" : ""}`}
                        />
                      </button>
                      <div
                        className={`overflow-hidden transition-all duration-300 bg-white mobile-shop-dropdown ${
                          mobileShopOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
                        }`}
                      >
                        {shopSubItems.map((subItem) => (
                          <Link
                            key={subItem.label}
                            href={subItem.href}
                            className="block py-4 px-6 text-[10px] tracking-[0.2em] text-[#6B6560] hover:text-[#8B4513] border-b border-[#2C2420]/5 last:border-0 mobile-nav-link"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className={`block py-4 text-sm tracking-[0.15em] transition-colors border-b border-[#2C2420]/10 mobile-nav-link ${
                        isActive(item.href) ? "text-[#8B4513]" : "text-[#2C2420] hover:text-[#8B4513]"
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>

            <div className="border-t border-[#E8E4DE] pt-6 space-y-4">
              {!pathname.startsWith("/checkout") && (
                <Link
                  href="/auth/login"
                  className="flex items-center gap-3 text-[#2C2420] hover:text-[#8B4513] transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="w-5 h-5" />
                  <span className="text-sm tracking-wider">SIGN IN</span>
                </Link>
              )}
              <Link
                href="/dashboard"
                className="flex items-center gap-3 text-[#2C2420] hover:text-[#8B4513] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Heart className="w-5 h-5" />
                <span className="text-sm tracking-wider">WISHLIST</span>
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false)
                  openCart()
                }}
                className="flex items-center gap-3 text-[#2C2420] hover:text-[#8B4513] transition-colors w-full"
              >
                <ShoppingBag className="w-5 h-5" />
                <span className="text-sm tracking-wider">CART ({totalItems})</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Header */}
      <header
        className={`fixed left-0 right-0 z-[60] transition-all duration-500 ${
          isScrolled || variant === "solid" ? "bg-white/95 backdrop-blur-md shadow-sm top-0" : `bg-transparent ${showPromoBanner ? "top-10 sm:top-11" : "top-0"}`
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 sm:h-20">
            {/* Mobile Menu Button */}
            <button
              className={`lg:hidden p-2 -ml-2 ${textColor}`}
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <Link href="/" className="mr-8 flex items-center">
              <div className={`relative transition-all duration-500 ${
                isScrolled || variant === "solid" ? "w-32 h-8" : "w-40 h-10"
              }`}>
                <Image
                  src="/images/logo.png"
                  alt="Stawi"
                  fill
                  className={`object-contain transition-all duration-500 ${isTransparent ? "brightness-0 invert" : ""}`}
                  priority
                />
              </div>
            </Link>

            <div className="flex items-center gap-4 sm:gap-6 ml-auto">
              {navItems.map((item) =>
                item.hasDropdown ? (
                  <DropdownMenu key={item.label}>
                    <DropdownMenuTrigger
                      className={`hidden lg:flex text-xs tracking-[0.2em] transition-colors items-center gap-1 group outline-none ${isActive(item.href) ? "text-[#8B4513]" : `${textColor} hover:text-[#8B4513]`}`}
                    >
                      {item.label}{" "}
                      <ChevronDown className="w-3 h-3 transition-transform group-data-[state=open]:rotate-180" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="bg-white border-[#E8E4DE] min-w-[200px] p-2 z-[200] nav-dropdown-content"
                    >
                      {shopSubItems.map((subItem) => (
                        <DropdownMenuItem key={subItem.label} asChild>
                          <Link
                            href={subItem.href}
                            className="text-[10px] tracking-[0.2em] py-3 px-4 hover:bg-[#FAF8F5] cursor-pointer block transition-colors text-[#2C2420] hover:text-[#8B4513]"
                          >
                            {subItem.label}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`hidden lg:block text-xs tracking-[0.2em] transition-colors ${
                      isActive(item.href) ? "text-[#8B4513]" : `${textColor} hover:text-[#8B4513]`
                    }`}
                  >
                    {item.label}
                  </Link>
                ),
              )}
              <button className={`hover:text-[#8B4513] transition-colors ${textColor}`} aria-label="Search">
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <Link href="/dashboard" className={`hover:text-[#8B4513] transition-colors hidden sm:block ${textColor}`}>
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
              </Link>
              <button
                onClick={openCart}
                className={`hover:text-[#8B4513] transition-colors relative ${textColor}`}
                aria-label="Open cart"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#8B4513] text-white text-[10px] flex items-center justify-center rounded-full">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
