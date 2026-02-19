import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { BookingForm } from "@/components/events/booking-form"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Clock, ChevronLeft } from "lucide-react"
import { format } from "date-fns"
import Link from "next/link"
import { checkRegistrationStatus } from "@/lib/actions/events"

export default async function EventDetailPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient()

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("slug", params.slug)
    .eq("is_published", true)
    .single()

  if (!event) {
    notFound()
  }

  const { count: attendeeCount } = await supabase
    .from("event_registrations")
    .select("*", { count: "exact", head: true })
    .eq("event_id", event.id)
    .eq("status", "registered")

  const registrationStatus = await checkRegistrationStatus(event.id)

  const spotsLeft = event.max_attendees ? event.max_attendees - (attendeeCount || 0) : null
  const isFull = spotsLeft !== null && spotsLeft <= 0

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Link href="/events">
          <Button variant="ghost" className="mb-6">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Button>
        </Link>

        <div className="max-w-5xl mx-auto">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-6">
              {event.image_url && (
                <div className="aspect-video overflow-hidden rounded-lg">
                  <img
                    src={event.image_url || "/placeholder.svg"}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div>
                <div className="flex items-start justify-between mb-4">
                  <h1 className="text-4xl font-bold">{event.title}</h1>
                  {event.category && (
                    <Badge variant="secondary" className="text-sm">
                      {event.category}
                    </Badge>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Date</p>
                        <p className="font-semibold">{format(new Date(event.event_date), "MMMM dd, yyyy")}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Time</p>
                        <p className="font-semibold">
                          {format(new Date(event.event_date), "h:mm a")}
                          {event.end_date && ` - ${format(new Date(event.end_date), "h:mm a")}`}
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="font-semibold">{event.location || event.venue || "TBA"}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm text-muted-foreground">Availability</p>
                        <p className="font-semibold">
                          {isFull ? "Sold Out" : spotsLeft ? `${spotsLeft} spots left` : "Unlimited"}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>

                {event.description && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-3">About This Event</h2>
                    <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">{event.description}</p>
                  </div>
                )}

                {event.long_description && (
                  <div className="mt-6">
                    <h2 className="text-2xl font-semibold mb-3">Details</h2>
                    <div className="prose prose-sm max-w-none">
                      <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                        {event.long_description}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-6">
                <BookingForm event={event} registrationStatus={registrationStatus} attendeeCount={attendeeCount || 0} />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
