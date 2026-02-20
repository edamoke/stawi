import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { CartProvider } from "@/context/cart-context"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { SmoothScroll } from "@/components/smooth-scroll"
import { NewsletterPopup } from "@/components/newsletter-popup"
import "./globals.css"

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "600", "700"],
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500"],
})

export const metadata: Metadata = {
  title: "StawiAFRIKA - Cosmetics and Beuty products Collection",
  description:
    "Discover Stawi - handcrafted African cosmetics and beauty products. Pure, natural, and sustainable skincare from the heart of Kenya.",
  generator: "v0.app",
  icons: {
    icon: "/icon.svg",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfairDisplay.variable} font-sans antialiased`}>
        <SmoothScroll />
        <CartProvider>
          {children}
          <CartDrawer />
          <NewsletterPopup />
        </CartProvider>
        <Analytics />
      </body>
    </html>
  )
}
