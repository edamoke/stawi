"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { MainNav } from "@/components/navigation/main-nav"
import { Footer } from "@/components/navigation/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Calendar, Smartphone, Loader2, Lock, ChevronLeft, Check, MapPin, Clock, CreditCard } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"

export default function EventCheckoutPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const eventId = searchParams.get("eventId")

  const [isLoading, setIsLoading] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)
  const [event, setEvent] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [paymentMethod, setPaymentMethod] = useState<"mpesa" | "paypal" | "pesapal">("pesapal")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [registrationCreated, setRegistrationCreated] = useState<string | null>(null)

  const [guestDetails, setGuestDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  })

  useEffect(() => {
    const errorParam = searchParams.get("error")
    if (errorParam) {
      setError(errorParam)
    }
  }, [searchParams])

  useEffect(() => {
    async function fetchData() {
      if (!eventId) {
        router.push("/events")
        return
      }

      const supabase = createClient()
      
      // Get user
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        setGuestDetails({
          firstName: user.user_metadata?.first_name || "",
          lastName: user.user_metadata?.last_name || "",
          email: user.email || "",
          phone: user.user_metadata?.phone || "",
        })
      }

      // Get event
      const { data: eventData, error: eventError } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .single()

      if (eventError || !eventData) {
        setError("Event not found")
        setIsLoading(false)
        return
      }

      setEvent(eventData)
      setIsLoading(false)
    }

    fetchData()
  }, [eventId, router])

  const formatPrice = (price: number) => `KSh ${price.toLocaleString()}`

  const handleInitiatePayment = async () => {
    if (!guestDetails.firstName || !guestDetails.lastName || !guestDetails.email || !guestDetails.phone) {
        setError("Please fill in all attendee details")
        return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const supabase = createClient()

      // 1. Create/Update registration as pending_payment
      const { data: registration, error: regError } = await supabase
        .from("event_registrations")
        .insert({
          event_id: eventId,
          user_id: user?.id || null,
          status: "pending_payment",
          payment_status: "pending",
          payment_amount: event.price,
          guest_name: `${guestDetails.firstName} ${guestDetails.lastName}`,
          guest_email: guestDetails.email,
          guest_phone: guestDetails.phone,
        })
        .select()
        .single()

      if (regError) throw regError
      setRegistrationCreated(registration.id)

      // 2. Initiate Payment
      if (paymentMethod === "pesapal") {
        const response = await fetch("/api/payments/pesapal/register-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: event.price,
            orderId: registration.id,
            type: "event",
            billingDetails: {
                email: guestDetails.email,
                phone: guestDetails.phone,
                firstName: guestDetails.firstName,
                lastName: guestDetails.lastName,
                address: "N/A",
                city: "N/A",
            },
          }),
        })

        const data = await response.json()
        if (data.success && data.redirectUrl) {
          window.location.href = data.redirectUrl
        } else {
          throw new Error(data.error || "Pesapal initiation failed")
        }
      } else if (paymentMethod === "mpesa") {
        const phoneToUse = phoneNumber || guestDetails.phone
        if (!phoneToUse) {
          setError("Please enter your M-Pesa phone number")
          setIsProcessing(false)
          return
        }

        const response = await fetch("/api/payments/mpesa/stkpush", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: event.price,
            phoneNumber: phoneToUse,
            registrationId: registration.id,
            type: "event"
          }),
        })

        const data = await response.json()
        if (data.success) {
          router.push(`/checkout/success?type=event&registrationId=${registration.id}`)
        } else {
          throw new Error(data.error || "M-Pesa initiation failed")
        }
      } else {
        // PayPal
        const response = await fetch("/api/payments/paypal/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            registrationId: registration.id,
            type: "event",
            amount: event.price
          }),
        })

        const data = await response.json()
        if (data.success && data.approvalUrl) {
          window.location.href = data.approvalUrl
        } else {
          throw new Error(data.error || "PayPal initiation failed")
        }
      }
    } catch (err: any) {
      console.error("Payment error:", err)
      setError(err.message || "Failed to process payment")
    } finally {
      setIsProcessing(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#C9A86C]" />
      </div>
    )
  }

  if (error && !event) {
    return (
    <div className="min-h-screen">
        <MainNav variant="solid" />
        <div className="max-w-2xl mx-auto px-4 py-32 text-center">
          <h1 className="text-2xl font-serif text-[#2C2420] mb-4">Error</h1>
          <p className="text-[#6B6560] mb-8">{error}</p>
          <Button asChild className="bg-[#C9A86C] hover:bg-[#B8975B] text-white">
            <Link href="/events">Back to Events</Link>
          </Button>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <MainNav variant="solid" />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <Link
          href={`/events/${event.slug}`}
          className="inline-flex items-center gap-2 text-sm text-[#6B6560] hover:text-[#2C2420] mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Event Details
        </Link>

        <h1 className="text-3xl font-serif text-[#2C2420] mb-8">Event Booking Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            {/* Event Summary Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm flex gap-6">
              {event.image_url && (
                <div className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
                  <Image src={event.image_url} alt={event.title} fill className="object-cover" />
                </div>
              )}
              <div className="flex-1">
                <h2 className="text-xl font-serif text-[#2C2420] mb-2">{event.title}</h2>
                <div className="space-y-1 text-sm text-[#6B6560]">
                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {format(new Date(event.event_date), "MMMM dd, yyyy")}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {event.event_time}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {event.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Attendee Details */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-serif text-[#2C2420] mb-6">Attendee Details</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                            id="firstName"
                            value={guestDetails.firstName}
                            onChange={(e) => setGuestDetails(prev => ({ ...prev, firstName: e.target.value }))}
                            placeholder="John"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                            id="lastName"
                            value={guestDetails.lastName}
                            onChange={(e) => setGuestDetails(prev => ({ ...prev, lastName: e.target.value }))}
                            placeholder="Doe"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input
                            id="email"
                            type="email"
                            value={guestDetails.email}
                            onChange={(e) => setGuestDetails(prev => ({ ...prev, email: e.target.value }))}
                            placeholder="john@example.com"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                            id="phone"
                            type="tel"
                            value={guestDetails.phone}
                            onChange={(e) => setGuestDetails(prev => ({ ...prev, phone: e.target.value }))}
                            placeholder="0712345678"
                        />
                    </div>
                </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-serif text-[#2C2420] mb-6">Select Payment Method</h2>

              <RadioGroup
                value={paymentMethod}
                onValueChange={(value: "mpesa" | "paypal" | "pesapal") => setPaymentMethod(value)}
              >
                <div
                  className={`flex items-center space-x-4 border rounded-xl p-4 cursor-pointer transition-colors ${
                    paymentMethod === "pesapal" ? "border-[#C9A86C] bg-[#C9A86C]/5" : "border-[#E8E4DE]"
                  }`}
                >
                  <RadioGroupItem value="pesapal" id="pesapal" />
                  <Label htmlFor="pesapal" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#C9A86C] flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-[#2C2420]">Pesapal (Card/M-Pesa)</div>
                        <div className="text-sm text-[#6B6560]">Secure payment via cards or mobile money</div>
                      </div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {error && <p className="text-sm text-red-500 bg-red-50 p-4 rounded-lg">{error}</p>}

            <Button
              onClick={handleInitiatePayment}
              disabled={isProcessing}
              className="w-full py-6 bg-[#C9A86C] hover:bg-[#B8975B] text-white"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing Payment...
                </>
              ) : (
                <>
                  <Lock className="mr-2 h-4 w-4" />
                  Confirm & Pay {formatPrice(event.price)}
                </>
              )}
            </Button>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-serif text-[#2C2420] mb-6">Booking Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B6560]">Ticket Price</span>
                  <span className="text-[#2C2420]">{formatPrice(event.price)}</span>
                </div>
                <div className="flex justify-between text-sm font-medium pt-4 border-t border-[#E8E4DE]">
                  <span className="text-[#2C2420]">Total Amount</span>
                  <span className="text-[#2C2420] text-lg">{formatPrice(event.price)}</span>
                </div>
              </div>

              <div className="mt-8 p-4 bg-[#FAF8F5] rounded-lg">
                <p className="text-xs text-[#8B8178] leading-relaxed">
                  By clicking "Confirm & Pay", you agree to our event terms and conditions. Your ticket will be issued immediately upon successful payment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
