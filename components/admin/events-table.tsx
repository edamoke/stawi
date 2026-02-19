"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, Users, Calendar } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"
import { format } from "date-fns"

interface Event {
  id: string
  title: string
  slug: string
  event_date: string
  location: string
  is_published: boolean
  is_featured: boolean
  max_attendees: number | null
  image_url: string | null
}

export function EventsTable({ events }: { events: Event[] }) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event? All registrations will be removed.")) return

    setIsDeleting(id)
    const supabase = createClient()
    const { error } = await supabase.from("events").delete().eq("id", id)

    if (error) {
      alert("Error deleting event: " + error.message)
    } else {
      router.refresh()
    }
    setIsDeleting(null)
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Event</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Capacity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {events.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground py-12">
                No events found. Create your first event to get started.
              </TableCell>
            </TableRow>
          ) : (
            events.map((event) => (
              <TableRow key={event.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {event.image_url && (
                      <img
                        src={event.image_url || "/placeholder.svg"}
                        alt={event.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div>
                      <span className="font-medium">{event.title}</span>
                      {event.is_featured && (
                        <Badge variant="secondary" className="ml-2">
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {format(new Date(event.event_date), "MMM d, yyyy")}
                  </div>
                </TableCell>
                <TableCell>{event.location || "N/A"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    {event.max_attendees ? `${event.max_attendees} max` : "Unlimited"}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={event.is_published ? "default" : "secondary"}>
                    {event.is_published ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button asChild variant="ghost" size="icon">
                      <Link href={`/admin/events/${event.id}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" size="icon" title="View Bookings">
                      <Link href={`/admin/events/${event.id}/bookings`}>
                        <Users className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(event.id)}
                      disabled={isDeleting === event.id}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
