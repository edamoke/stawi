"use client"

import { useState, useEffect } from "react"
import { X, Mail, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"

export function NewsletterPopup() {
  const [isOpen, setIsOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubscribed, setIsSubscribed] = useState(false)

  useEffect(() => {
    // Check if user has already seen or closed the popup
    const hasSeenPopup = localStorage.getItem("sulha_newsletter_seen")
    
    if (!hasSeenPopup) {
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 5000) // Show after 5 seconds

      return () => clearTimeout(timer)
    }
  }, [])

  const handleClose = () => {
    setIsOpen(false)
    localStorage.setItem("sulha_newsletter_seen", "true")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setIsSubscribed(true)
    setIsSubmitting(false)
    
    // Auto close after 2 seconds on success
    setTimeout(() => {
      handleClose()
    }, 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-500">
      <div className="relative w-full max-w-2xl bg-white overflow-hidden shadow-2xl rounded-sm flex flex-col md:flex-row animate-in zoom-in-95 slide-in-from-bottom-4 duration-500">
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-1 hover:bg-black/5 rounded-full transition-colors text-[#2C2420]"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Image Side */}
        <div className="hidden md:block w-5/12 relative min-h-[400px]">
          <Image
            src="/images/IMG_4410(2) (Custom).jpg"
            alt="Sulhaafrika Collection"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#2C2420]/10" />
        </div>

        {/* Content Side */}
        <div className="flex-1 p-8 md:p-12 flex flex-col justify-center text-center md:text-left">
          {!isSubscribed ? (
            <>
              <h2 className="text-2xl md:text-3xl font-serif text-[#2C2420] mb-4">
                Join our <span className="italic">Ngozi</span> Community
              </h2>
              <p className="text-[#6B6560] text-sm mb-8 leading-relaxed">
                Subscribe to receive early access to new collections, exclusive event invitations, and stories from the heart of Africa.
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B6560]" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 border-[#E8E4DE] focus:border-[#2C2420] focus:ring-0 rounded-none bg-[#FAF8F5]"
                  />
                </div>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-12 bg-[#2C2420] hover:bg-[#1A1512] text-white rounded-none tracking-[0.2em] text-xs transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? "SUBSCRIBING..." : (
                    <>
                      SUBSCRIBE <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
                <p className="text-[10px] text-[#A8A29E] mt-4">
                  By subscribing, you agree to our Privacy Policy and to receive marketing emails.
                </p>
              </form>
            </>
          ) : (
            <div className="py-8 animate-in fade-in zoom-in-95 duration-500">
              <div className="w-16 h-16 bg-[#F5F3F0] rounded-full flex items-center justify-center mb-6 mx-auto md:mx-0 text-[#2C2420]">
                <Mail className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-serif text-[#2C2420] mb-2">Welcome Home</h2>
              <p className="text-[#6B6560] text-sm">
                Thank you for joining us. You'll be hearing from us soon with something special.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
