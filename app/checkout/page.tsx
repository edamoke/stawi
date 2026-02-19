"use client"

import { useState, useEffect } from "react"
import { useCart } from "@/context/cart-context"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { MainNav } from "@/components/navigation/main-nav"
import { Footer } from "@/components/navigation/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { ShoppingBag, CreditCard, Smartphone, Loader2, Lock, ChevronLeft, Check } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [step, setStep] = useState<"details" | "payment">("details")
  const [paymentMethod, setPaymentMethod] = useState<"mpesa" | "paypal" | "pesapal">("pesapal")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [orderCreated, setOrderCreated] = useState<string | null>(null)
  const [similarProducts, setSimilarProducts] = useState<any[]>([])
  const [shippingSettings, setShippingSettings] = useState({
    fee: 0,
    freeThreshold: 0,
  })

  const [shippingDetails, setShippingDetails] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Kenya",
  })

  useEffect(() => {
    async function getShippingSettings() {
      const supabase = createClient()
      const { data } = await supabase.from("site_settings").select("value").eq("key", "shipping_settings").single()
      if (data?.value) {
        setShippingSettings(data.value)
      }
    }
    getShippingSettings()

    async function getSimilarProducts() {
      const supabase = createClient()
      const { data } = await supabase
        .from("products")
        .select(`*, categories (name, slug)`)
        .eq("is_active", true)
        .limit(4)
      if (data) setSimilarProducts(data)
    }
    getSimilarProducts()

    async function getUser() {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUser(user)
        setShippingDetails((prev) => ({
          ...prev,
          email: user.email || "",
          firstName: user.user_metadata?.first_name || "",
          lastName: user.user_metadata?.last_name || "",
          phone: user.user_metadata?.phone || "",
        }))
      }
    }
    getUser()
  }, [])

  const formatPrice = (price: number) => `KSh ${price.toLocaleString()}`

  const handleCreateOrder = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const supabase = createClient()

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user?.id || null,
          total_amount: totalPrice,
          status: "pending",
          payment_method: paymentMethod,
          payment_status: "pending",
          shipping_address: shippingDetails,
        })
        .select()
        .single()

      if (orderError) throw orderError

      // Create order items
      const orderItems = items.map((item) => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
        total_price: item.price * item.quantity,
        product_name: item.name,
        product_image: item.image_url,
      }))

      const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

      if (itemsError) throw itemsError

      setOrderCreated(order.id)
      setStep("payment")
    } catch (err: any) {
      console.error("Order creation error:", err)
      setError(err.message || "Failed to create order")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePesapalPayment = async () => {
    if (!orderCreated) return

    setIsLoading(true)
    setError(null)

    try {
      const finalAmount = totalPrice >= shippingSettings.freeThreshold ? totalPrice : totalPrice + shippingSettings.fee

      const response = await fetch("/api/payments/pesapal/register-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: finalAmount,
          orderId: orderCreated,
          billingDetails: shippingDetails,
        }),
      })

      const data = await response.json()

      if (data.success && data.redirectUrl) {
        clearCart()
        window.location.href = data.redirectUrl
      } else {
        setError(data.error || "Failed to initiate Pesapal payment")
      }
    } catch (err) {
      setError("An error occurred while processing your payment")
    } finally {
      setIsLoading(false)
    }
  }

  const handleMpesaPayment = async () => {
    if (!phoneNumber || !orderCreated) {
      setError("Please enter your M-Pesa phone number")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/payments/mpesa/stkpush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: totalPrice,
          phoneNumber,
          orderId: orderCreated,
        }),
      })

      const data = await response.json()

      if (data.success) {
        clearCart()
        router.push(`/checkout/success?orderId=${orderCreated}`)
      } else {
        setError(data.error || "Failed to initiate M-Pesa payment")
      }
    } catch (err) {
      setError("An error occurred while processing your payment")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePayPalPayment = async () => {
    if (!orderCreated) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/payments/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: orderCreated }),
      })

      const data = await response.json()

      if (data.success && data.approvalUrl) {
        clearCart()
        window.location.href = data.approvalUrl
      } else {
        setError(data.error || "Failed to initiate PayPal payment")
      }
    } catch (err) {
      setError("An error occurred while processing your payment")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePayment = () => {
    if (paymentMethod === "pesapal") {
      handlePesapalPayment()
    } else if (paymentMethod === "mpesa") {
      handleMpesaPayment()
    } else {
      handlePayPalPayment()
    }
  }

  if (items.length === 0 && !orderCreated) {
    return (
      <div className="min-h-screen">
        <MainNav variant="solid" />
        <div className="max-w-2xl mx-auto px-4 py-32 text-center">
          <div className="w-20 h-20 rounded-full bg-white mx-auto flex items-center justify-center mb-6">
            <ShoppingBag className="w-8 h-8 text-[#C9A86C]" />
          </div>
          <h1 className="text-2xl font-serif text-[#2C2420] mb-4">Your bag is empty</h1>
          <p className="text-[#6B6560] mb-8">Add some beautiful pieces to your bag before checking out.</p>
          <Button asChild className="bg-[#C9A86C] hover:bg-[#B8975B] text-white">
            <Link href="/our-collection">Browse Collection</Link>
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
        {/* Back Button */}
        <Link
          href="/our-collection"
          className="inline-flex items-center gap-2 text-sm text-[#6B6560] hover:text-[#2C2420] mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          Continue Shopping
        </Link>

        <h1 className="text-3xl font-serif text-[#2C2420] mb-8">Checkout</h1>

        {/* Progress Steps */}
        <div className="flex items-center gap-4 mb-12">
          <div className={`flex items-center gap-2 ${step === "details" ? "text-[#C9A86C]" : "text-[#2C2420]"}`}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                step === "details" ? "bg-[#C9A86C] text-white" : "bg-[#2C2420] text-white"
              }`}
            >
              {step === "payment" ? <Check className="w-4 h-4" /> : "1"}
            </div>
            <span className="text-sm font-medium">Details</span>
          </div>
          <div className="flex-1 h-px bg-[#E8E4DE]" />
          <div className={`flex items-center gap-2 ${step === "payment" ? "text-[#C9A86C]" : "text-[#8B8178]"}`}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                step === "payment" ? "bg-[#C9A86C] text-white" : "bg-[#E8E4DE] text-[#8B8178]"
              }`}
            >
              2
            </div>
            <span className="text-sm font-medium">Payment</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {step === "details" ? (
              <>
                {/* Shipping Details */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-lg font-serif text-[#2C2420] mb-6">Shipping Details</h2>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        value={shippingDetails.firstName}
                        onChange={(e) => setShippingDetails((prev: any) => ({ ...prev, firstName: e.target.value }))}
                        placeholder="John"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        value={shippingDetails.lastName}
                        onChange={(e) => setShippingDetails((prev: any) => ({ ...prev, lastName: e.target.value }))}
                        placeholder="Doe"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={shippingDetails.email}
                        onChange={(e) => setShippingDetails((prev: any) => ({ ...prev, email: e.target.value }))}
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={shippingDetails.phone}
                        onChange={(e) => setShippingDetails((prev: any) => ({ ...prev, phone: e.target.value }))}
                        placeholder="0712 345 678"
                      />
                    </div>
                    <div className="sm:col-span-2 space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={shippingDetails.address}
                        onChange={(e) => setShippingDetails((prev: any) => ({ ...prev, address: e.target.value }))}
                        placeholder="123 Moi Avenue"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={shippingDetails.city}
                        onChange={(e) => setShippingDetails((prev: any) => ({ ...prev, city: e.target.value }))}
                        placeholder="Nairobi"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input
                        id="postalCode"
                        value={shippingDetails.postalCode}
                        onChange={(e) => setShippingDetails((prev: any) => ({ ...prev, postalCode: e.target.value }))}
                        placeholder="00100"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-lg font-serif text-[#2C2420] mb-6">Payment Method</h2>

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

                {/* Similar Products */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h2 className="text-lg font-serif text-[#2C2420] mb-6">You might also like</h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {similarProducts.map((product) => (
                      <Link key={product.id} href={`/products/${product.slug}`} className="group">
                        <div className="aspect-[3/4] relative rounded-lg overflow-hidden bg-[#FAF8F5] mb-2">
                          <Image
                            src={product.images?.[0] || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                        </div>
                        <h4 className="text-xs font-medium text-[#2C2420] truncate">{product.name}</h4>
                        <p className="text-xs text-[#C9A86C]">{formatPrice(product.price)}</p>
                      </Link>
                    ))}
                  </div>
                </div>

                <Button
                  onClick={handleCreateOrder}
                  disabled={isLoading}
                  className="w-full py-6 bg-[#C9A86C] hover:bg-[#B8975B] text-white"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Creating Order...
                    </>
                  ) : (
                    "Continue to Payment"
                  )}
                </Button>
              </>
            ) : (
              /* Payment Step */
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-serif text-[#2C2420] mb-6">
                  {paymentMethod === "pesapal"
                    ? "Pesapal Payment"
                    : paymentMethod === "mpesa"
                      ? "M-Pesa Payment"
                      : "PayPal Payment"}
                </h2>

                {paymentMethod === "pesapal" ? (
                  <p className="text-[#6B6560]">
                    You will be redirected to Pesapal's secure portal to complete your payment via Card, M-Pesa, or
                    Airtel Money.
                  </p>
                ) : paymentMethod === "mpesa" ? (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="mpesaPhone">M-Pesa Phone Number</Label>
                      <Input
                        id="mpesaPhone"
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="07XXXXXXXX or 2547XXXXXXXX"
                      />
                      <p className="text-sm text-[#6B6560]">
                        Enter your M-Pesa registered phone number. You will receive a prompt to enter your PIN.
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-[#6B6560]">You will be redirected to PayPal to complete your payment securely.</p>
                )}

                {error && <p className="text-sm text-red-500 bg-red-50 p-4 rounded-lg mt-4">{error}</p>}

                <div className="flex gap-4 mt-6">
                  <Button variant="outline" onClick={() => setStep("details")} disabled={isLoading}>
                    Back
                  </Button>
                  <Button
                    onClick={handlePayment}
                    disabled={isLoading || (paymentMethod === "mpesa" && !phoneNumber)}
                    className="flex-1 py-6 bg-[#C9A86C] hover:bg-[#B8975B] text-white"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock className="mr-2 h-4 w-4" />
                        Pay {formatPrice(totalPrice)}
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-serif text-[#2C2420] mb-6">Order Summary</h2>

              <div className="space-y-4 max-h-[300px] overflow-y-auto mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-[#FAF8F5] flex-shrink-0">
                      <Image src={item.image_url || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#2C2420] text-white text-xs rounded-full flex items-center justify-center">
                        {item.quantity}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm text-[#2C2420] truncate">{item.name}</h4>
                      <p className="text-sm text-[#C9A86C]">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B6560]">Subtotal</span>
                  <span className="text-[#2C2420]">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B6560]">Shipping</span>
                  <span className="text-[#2C2420]">
                    {totalPrice >= shippingSettings.freeThreshold ? "Free" : formatPrice(shippingSettings.fee)}
                  </span>
                </div>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between">
                <span className="font-serif text-[#2C2420]">Total</span>
                <span className="font-serif text-lg text-[#2C2420]">
                  {formatPrice(
                    totalPrice >= shippingSettings.freeThreshold ? totalPrice : totalPrice + shippingSettings.fee,
                  )}
                </span>
              </div>

              <p className="text-xs text-[#8B8178] mt-4 flex items-center gap-2">
                <Lock className="w-3 h-3" />
                Secure checkout powered by industry-standard encryption
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
