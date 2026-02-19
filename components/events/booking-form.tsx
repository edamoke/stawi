"use client"

import { EventRegistrationButton } from "./event-registration-button"
import { Badge } from "@/components/ui/badge"

type Event = {
  id: string
  title: string
  price: number
  max_attendees: number | null
  is_free: boolean
}

type RegistrationStatus = {
  isRegistered: boolean
  status?: string
}

export function BookingForm({
  event,
  registrationStatus,
  attendeeCount,
}: {
  event: Event
  registrationStatus: RegistrationStatus
  attendeeCount: number
}) {
  const spotsLeft = event.max_attendees ? event.max_attendees - attendeeCount : null
  const isFull = spotsLeft !== null && spotsLeft <= 0

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Price</span>
          <span className="text-2xl font-bold">
            {event.is_free || event.price === 0 ? "Free" : `$${event.price.toFixed(2)}`}
          </span>
        </div>

        {event.max_attendees && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Availability</span>
            <span className="text-sm font-medium">
              {isFull ? (
                <Badge variant="destructive">Sold Out</Badge>
              ) : (
                <Badge variant="secondary">{spotsLeft} spots left</Badge>
              )}
            </span>
          </div>
        )}

        {registrationStatus.isRegistered && (
          <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-md">
            <p className="text-sm text-green-800 dark:text-green-200 font-medium">You're registered for this event</p>
          </div>
        )}
      </div>

      <EventRegistrationButton
        eventId={event.id}
        eventTitle={event.title}
        isRegistered={registrationStatus.isRegistered}
        isFull={isFull}
        requiresAuth={false}
        requiresPayment={true}
      />

      <p className="text-xs text-center text-muted-foreground">
        {registrationStatus.isRegistered
          ? "You can cancel your registration anytime"
          : !event.is_free && event.price > 0 
            ? "By booking, you agree to receive event updates"
            : "By registering, you agree to receive event updates"}
      </p>
    </div>
  )
}
