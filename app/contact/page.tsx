import { MainNav } from "@/components/navigation/main-nav"
import { Footer } from "@/components/navigation/footer"
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <MainNav variant="solid" />
      
      <main className="max-w-7xl mx-auto px-4 py-20 sm:py-32">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <div>
            <h1 className="text-4xl sm:text-5xl font-serif text-[#2C2420] mb-8">Get in Touch</h1>
            <p className="text-[#6B6560] text-lg mb-12 leading-relaxed">
              We'd love to hear from you. Whether you have a question about our collections, 
              an order, or our experiences, our team is here to help.
            </p>

            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm">
                  <Mail className="w-5 h-5 text-[#8B4513]" />
                </div>
                <div>
                  <h3 className="font-medium text-[#2C2420] mb-1">Email</h3>
                  <p className="text-[#6B6560]">Stawiafrika2025@gmail.com</p>
                  <p className="text-[#6B6560]">info@Stawiafrika.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm">
                  <Phone className="w-5 h-5 text-[#8B4513]" />
                </div>
                <div>
                  <h3 className="font-medium text-[#2C2420] mb-1">Phone</h3>
                  <p className="text-[#6B6560]">+254 794 015 756</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm">
                  <MapPin className="w-5 h-5 text-[#8B4513]" />
                </div>
                <div>
                  <h3 className="font-medium text-[#2C2420] mb-1">Location</h3>
                  <p className="text-[#6B6560]">Malindi, Kenya</p>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <h3 className="font-medium text-[#2C2420] mb-6">Follow Us</h3>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:text-[#8B4513] transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:text-[#8B4513] transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:text-[#8B4513] transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white/60 backdrop-blur-md rounded-2xl p-8 sm:p-12 shadow-sm border border-[#E8E4DE]">
            <form className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="text-sm font-medium text-[#2C2420]">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    className="w-full px-4 py-3 rounded-lg border border-[#E8E4DE] bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20 focus:border-[#8B4513] transition-all"
                    placeholder="John"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName" className="text-sm font-medium text-[#2C2420]">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    className="w-full px-4 py-3 rounded-lg border border-[#E8E4DE] bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20 focus:border-[#8B4513] transition-all"
                    placeholder="Doe"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-[#2C2420]">Email Address</label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 rounded-lg border border-[#E8E4DE] bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20 focus:border-[#8B4513] transition-all"
                  placeholder="john@example.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-[#2C2420]">Subject</label>
                <input
                  type="text"
                  id="subject"
                  className="w-full px-4 py-3 rounded-lg border border-[#E8E4DE] bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20 focus:border-[#8B4513] transition-all"
                  placeholder="How can we help?"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-[#2C2420]">Message</label>
                <textarea
                  id="message"
                  rows={6}
                  className="w-full px-4 py-3 rounded-lg border border-[#E8E4DE] bg-white/50 focus:outline-none focus:ring-2 focus:ring-[#8B4513]/20 focus:border-[#8B4513] transition-all resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#8B4513] text-white rounded-lg hover:bg-[#6D360F] transition-colors font-medium tracking-wider"
              >
                SEND MESSAGE
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
