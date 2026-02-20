import Link from "next/link"
import Image from "next/image"
import { Instagram, Facebook, Twitter, MapPin, Phone, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#2C2420] text-white relative">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12 sm:mb-16">
          {/* Brand - Updated from TREVOR to SULHAAFRIKA Logo */}
          <div className="col-span-2 lg:col-span-1">
            <div className="relative w-40 h-10 mb-4 text-2xl font-bold tracking-widest text-white">
              STAWI
            </div>
            <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-xs">
              Premium Stawi cosmetics and beauty products. African excellence in skincare and beauty.
            </p>
            <div className="flex space-x-3">
              <a
                href="#"
                className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:border-[#8B4513] hover:text-[#8B4513] transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:border-[#8B4513] hover:text-[#8B4513] transition-all"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 border border-white/20 rounded-full flex items-center justify-center hover:border-[#8B4513] hover:text-[#8B4513] transition-all"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop - Updated categories */}
          <div>
            <h4 className="text-xs tracking-[0.2em] mb-4 sm:mb-6 text-[#8B4513]">SHOP</h4>
            <ul className="space-y-2 sm:space-y-3">
              {[
                { label: "All Bags", href: "/our-collection" },
                { label: "Sling Bags", href: "/our-collection?category=sling-bags" },
                { label: "Side Bags", href: "/our-collection?category=side-bags" },
                { label: "Cross Body Bags", href: "/our-collection?category=crossbody-bags" },
                { label: "Mini Bags", href: "/our-collection?category=mini-bags" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-white/70 hover:text-[#8B4513] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-xs tracking-[0.2em] mb-4 sm:mb-6 text-[#8B4513]">SUPPORT</h4>
            <ul className="space-y-2 sm:space-y-3">
              {[
                { label: "Contact Us", href: "/contact" },
                { label: "Terms and Conditions", href: "/faq#terms" },
                { label: "Care Guide", href: "/care-guide" },
                { label: "Size Guide", href: "/size-guide" },
                { label: "FAQ", href: "/faq" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-white/70 hover:text-[#8B4513] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact - Updated email */}
          <div id="footer-contact">
            <h4 className="text-xs tracking-[0.2em] mb-4 sm:mb-6 text-[#8B4513]">CONTACT</h4>
            <ul className="space-y-3 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#8B4513]" />
                <span>Malindi, Kenya</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0 text-[#8B4513]" />
                <span>+254 794 015 756</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0 text-[#8B4513]" />
                <div className="flex flex-col">
                  <span>sulhaafrika2025@gmail.com</span>
                  <span>info@sulhaafrika.com</span>
                </div>
              </li>
            </ul>
            <div className="mt-6 space-y-2">
              <Link href="/press" className="block text-sm text-white/70 hover:text-[#8B4513] transition-colors">
                Press
              </Link>
              <Link href="/diary" className="block text-sm text-white/70 hover:text-[#8B4513] transition-colors">
                Journal
              </Link>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="border-t border-white/10 pt-8 mb-8">
          <p className="text-xs text-white/40 mb-4 text-center">WE ACCEPT</p>
          <div className="flex justify-center items-center gap-6 flex-wrap">
            <span className="text-sm text-white/60 font-medium">M-Pesa</span>
            <span className="text-sm text-white/60 font-medium">PayPal</span>
            <span className="text-sm text-white/60 font-medium">Visa</span>
            <span className="text-sm text-white/60 font-medium">Mastercard</span>
          </div>
        </div>

        {/* Bottom - Updated copyright */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40 text-center sm:text-left">© 2025 Sulhaafrika. All Rights Reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-xs text-white/40">
            <a href="#" className="hover:text-white/70 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-white/70 transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
