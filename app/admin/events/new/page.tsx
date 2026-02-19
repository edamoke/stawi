import { requireAdmin } from "@/lib/auth"
import { EventForm } from "@/components/admin/events/event-form"

export default async function NewEventPage() {
  await requireAdmin()

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create New Event</h1>
        <p className="text-muted-foreground mt-1">Add a new event to your calendar</p>
      </div>

      <EventForm />
    </div>
  )
}
