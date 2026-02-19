"use client"

import { useState } from "react"
import { updateRegistrationStatus } from "@/lib/actions/events"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown, Loader2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface RegistrationStatusActionsProps {
  registrationId: string
  currentStatus: string
  currentPaymentStatus: string
}

export function RegistrationStatusActions({
  registrationId,
  currentStatus,
  currentPaymentStatus,
}: RegistrationStatusActionsProps) {
  const [loading, setLoading] = useState(false)

  const handleUpdateStatus = async (status: string, paymentStatus?: string) => {
    setLoading(true)
    try {
      const result = await updateRegistrationStatus(registrationId, status, paymentStatus)
      if (result.success) {
        toast({
          title: "Status updated",
          description: "The registration status has been successfully updated.",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to update status",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={loading} className="capitalize">
            {loading ? <Loader2 className="h-3 w-3 animate-spin mr-2" /> : null}
            {currentStatus}
            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleUpdateStatus("registered")}>
            Registered
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleUpdateStatus("cancelled")}>
            Cancelled
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleUpdateStatus("attended")}>
            Attended
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" disabled={loading} className="capitalize">
            {currentPaymentStatus}
            <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleUpdateStatus(currentStatus, "pending")}>
            Pending
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleUpdateStatus(currentStatus, "completed")}>
            Completed
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleUpdateStatus(currentStatus, "failed")}>
            Failed
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleUpdateStatus(currentStatus, "refunded")}>
            Refunded
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
