"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2 } from "lucide-react"

interface PaymentSelectorProps {
  orderId: string
  amount: number
}

export function PaymentSelector({ orderId, amount }: PaymentSelectorProps) {
  const [paymentMethod, setPaymentMethod] = useState<"mpesa" | "paypal">("mpesa")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleMpesaPayment = async () => {
    if (!phoneNumber) {
      setError("Please enter your phone number")
      return
    }

    setIsProcessing(true)
    setError(null)

    try {
      const response = await fetch("/api/payments/mpesa/stkpush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          phoneNumber,
          orderId,
        }),
      })

      const data = await response.json()

      if (data.success) {
        alert("Payment request sent! Please check your phone to complete the payment.")
      } else {
        setError(data.error || "Failed to initiate payment")
      }
    } catch (err) {
      setError("An error occurred while processing your payment")
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePayPalPayment = async () => {
    setIsProcessing(true)
    setError(null)

    try {
      const response = await fetch("/api/payments/paypal/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      })

      const data = await response.json()

      if (data.success && data.approvalUrl) {
        window.location.href = data.approvalUrl
      } else {
        setError(data.error || "Failed to initiate payment")
      }
    } catch (err) {
      setError("An error occurred while processing your payment")
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePayment = () => {
    if (paymentMethod === "mpesa") {
      handleMpesaPayment()
    } else {
      handlePayPalPayment()
    }
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-4">Select Payment Method</h3>
          <RadioGroup value={paymentMethod} onValueChange={(value: "mpesa" | "paypal") => setPaymentMethod(value)}>
            <div className="flex items-center space-x-2 border rounded-lg p-4">
              <RadioGroupItem value="mpesa" id="mpesa" />
              <Label htmlFor="mpesa" className="flex-1 cursor-pointer">
                <div className="font-medium">M-Pesa</div>
                <div className="text-sm text-muted-foreground">Pay with your M-Pesa mobile money</div>
              </Label>
            </div>
            <div className="flex items-center space-x-2 border rounded-lg p-4">
              <RadioGroupItem value="paypal" id="paypal" />
              <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                <div className="font-medium">PayPal</div>
                <div className="text-sm text-muted-foreground">Pay with your PayPal account</div>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {paymentMethod === "mpesa" && (
          <div className="space-y-2">
            <Label htmlFor="phone">M-Pesa Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="07XXXXXXXX or 2547XXXXXXXX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">Enter your M-Pesa registered phone number</p>
          </div>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button onClick={handlePayment} disabled={isProcessing} className="w-full" size="lg">
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay KSh ${amount.toLocaleString()}`
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
