import { createClient } from "@/lib/supabase/server"
import { requireAdmin } from "@/lib/auth"
import { getEventRegistrations } from "@/lib/actions/events"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Mail, Download } from "lucide-react"
import Link from "next/link"

export default async function EventBookingsPage({ params }: { params: { id: string } }) {
  await requireAdmin()
  const supabase = await createClient()

  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("id", params.id)
    .single()

  if (!event) {
    return <div>Event not found</div>
  }

  const result = await getEventRegistrations(params.id)
  const registrations = result.success ? result.data : []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/events">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Bookings: {event.title}</h1>
            <p className="text-muted-foreground mt-1">Manage attendees and payment status</p>
          </div>
        </div>
        <div className="flex gap-2">
            <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export CSV
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Total Booked</p>
            <p className="text-2xl font-bold">{registrations?.length || 0}</p>
        </Card>
        <Card className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Confirmed</p>
            <p className="text-2xl font-bold text-green-600">
                {registrations?.filter(r => r.status === 'registered' && r.payment_status === 'completed').length || 0}
            </p>
        </Card>
        <Card className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Pending Payment</p>
            <p className="text-2xl font-bold text-amber-600">
                {registrations?.filter(r => r.status === 'pending_payment').length || 0}
            </p>
        </Card>
        <Card className="p-4 text-center">
            <p className="text-sm text-muted-foreground">Capacity</p>
            <p className="text-2xl font-bold">{event.capacity || "Unlimited"}</p>
        </Card>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Attendee</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {registrations && registrations.length > 0 ? (
              registrations.map((reg: any) => (
                <TableRow key={reg.id}>
                  <TableCell>
                    <div className="font-medium">{reg.profiles?.full_name || "N/A"}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Mail className="h-3 w-3" />
                      {reg.profiles?.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                        reg.status === 'registered' ? 'default' : 
                        reg.status === 'cancelled' ? 'destructive' : 'secondary'
                    }>
                      {reg.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={
                        reg.payment_status === 'completed' ? 'default' : 
                        reg.payment_status === 'failed' ? 'destructive' : 'secondary'
                    }>
                      {reg.payment_status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    KSh {Number(reg.payment_amount).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-sm">
                    {format(new Date(reg.registered_at), "MMM dd, yyyy HH:mm")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">Details</Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No bookings found for this event.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
