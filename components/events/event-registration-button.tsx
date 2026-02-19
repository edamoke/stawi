"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Calendar, Loader2, CheckCircle } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { toast } from "sonner"

interface EventRegistrationButtonProps {
  eventId: string
  eventTitle: string
  isRegistered: boolean
  isFull: boolean
  requiresAuth: boolean
  requiresPayment?: boolean
}

export function EventRegistrationButton({
  eventId,
  eventTitle,
  isRegistered,
  isFull,
  requiresAuth,
  requiresPayment,
}: EventRegistrationButtonProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleRegistration = async () => {
    // If it requires payment, we allow guests to book now
    if (requiresPayment) {
        router.push(`/checkout/event?eventId=${eventId}`)
        return
    }

    if (requiresAuth) {
      const currentPath = window.location.pathname
      router.push(`/auth/login?redirect=${currentPath}`)
      return
    }

    setIsLoading(true)
    const supabase = createClient()

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      if (isRegistered) {
        // Cancel registration
        const { error } = await supabase
          .from("event_registrations")
          .update({ status: "cancelled" })
          .eq("event_id", eventId)
          .eq("user_id", user.id)

        if (error) throw error
        toast.success("Registration cancelled successfully")
        router.refresh()
      } else {
        // Handle registration for free event
        const { error } = await supabase.from("event_registrations").insert({
          event_id: eventId,
          user_id: user.id,
          status: "registered",
          payment_status: "completed",
          payment_amount: 0,
        })

        if (error) throw error
        toast.success(`You're registered for ${eventTitle}!`)
        router.refresh()
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong. Please try again.")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isFull && !isRegistered) {
    return (
      <Button disabled className="w-full">
        Event Full
      </Button>
    )
  }

  return (
    <Button
      onClick={handleRegistration}
      disabled={isLoading}
      className="w-full"
      variant={isRegistered ? "outline" : "default"}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : isRegistered ? (
        <>
          <CheckCircle className="mr-2 h-4 w-4" />
          Registered
        </>
      ) : (
        <>
          <Calendar className="mr-2 h-4 w-4" />
          {requiresPayment ? "Book Now" : "Register Now"}
        </>
      )}
    </Button>
  )
}
