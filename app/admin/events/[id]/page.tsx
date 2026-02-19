import { createClient } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/auth"
import { notFound } from "next/navigation"
import { EventForm } from "@/components/admin/events/event-form"

export default async function EditEventPage({ params }: { params: { id: string } }) {
  await requireAdmin()
  const supabase = await createClient()

  const { data: event, error } = await supabase.from("events").select("*").eq("id", params.id).single()

  if (error || !event) {
    notFound()
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Event</h1>
        <p className="text-muted-foreground mt-1">Update event details and settings</p>
      </div>

      <EventForm event={event} />
    </div>
  )
}
