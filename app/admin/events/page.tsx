import { createClient } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/auth"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus, Calendar, Users, CheckCircle } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

export default async function EventsAdminPage() {
  await requireAdmin()
  const supabase = await createClient()

  const { data: events, error } = await supabase
    .from("events")
    .select("*, event_bookings(count)")
    .order("event_date", { ascending: true })

  if (error) {
    console.error("Error loading events:", error)
  }

  const totalEvents = events?.length || 0
  const activeEvents = events?.filter((e) => e.is_active).length || 0
  const totalBookings = events?.reduce((sum, e) => sum + e.booked_count, 0) || 0

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Events Management</h1>
          <p className="text-muted-foreground mt-1">Create and manage events and view bookings</p>
        </div>
        <Link href="/admin/events/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Event
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Events</p>
              <p className="text-2xl font-bold mt-1">{totalEvents}</p>
            </div>
            <Calendar className="h-8 w-8 text-primary" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Events</p>
              <p className="text-2xl font-bold mt-1">{activeEvents}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Bookings</p>
              <p className="text-2xl font-bold mt-1">{totalBookings}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">All Events</h2>
        <div className="space-y-4">
          {events && events.length > 0 ? (
            events.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-start gap-4 flex-1">
                  {event.image_url && (
                    <img
                      src={event.image_url || "/placeholder.svg"}
                      alt={event.title}
                      className="w-20 h-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">{event.title}</h3>
                      {event.is_active ? (
                        <Badge variant="default">Active</Badge>
                      ) : (
                        <Badge variant="secondary">Inactive</Badge>
                      )}
                      {event.category && <Badge variant="outline">{event.category}</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{event.location}</p>
                    <div className="flex items-center gap-4 mt-2 text-sm">
                      <span>📅 {format(new Date(event.event_date), "MMM dd, yyyy")}</span>
                      <span>🕐 {event.event_time}</span>
                      <span>
                        👥 {event.booked_count}/{event.capacity} booked
                      </span>
                      {event.price > 0 && <span>💰 ${event.price}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/events/${event.id}/bookings`}>
                    <Button variant="outline" size="sm">
                      <Users className="h-4 w-4 mr-1" />
                      Bookings
                    </Button>
                  </Link>
                  <Link href={`/admin/events/${event.id}`}>
                    <Button size="sm">Edit</Button>
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No events created yet</p>
              <Link href="/admin/events/new">
                <Button className="mt-4">Create Your First Event</Button>
              </Link>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
