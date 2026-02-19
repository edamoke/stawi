"use client"

import { useState } from "react"
import { Shield, Users, MoreHorizontal, Trash2, Ban, CheckCircle, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { updateUserRole, deleteUser, toggleUserSuspension } from "@/lib/actions/users"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface UserActionsProps {
  user: any
}

export function UserActions({ user }: UserActionsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleToggleAdmin = async () => {
    setIsLoading(true)
    try {
      const result = await updateUserRole(user.id, !user.is_admin)
      if (result.success) {
        toast.success(`User role updated to ${!user.is_admin ? "Admin" : "Customer"}`)
      } else {
        toast.error(result.error || "Failed to update user role")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteUser = async () => {
    setIsLoading(true)
    try {
      const result = await deleteUser(user.id)
      if (result.success) {
        toast.success("User account deleted successfully")
      } else {
        toast.error(result.error || "Failed to delete user account")
      }
    } catch (error) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsLoading(false)
      setShowDeleteDialog(false)
    }
  }

  return (
    <div className="flex items-center justify-end gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0" disabled={isLoading}>
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-white border-[#E8E4DE] z-[100]">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleToggleAdmin}>
            {user.is_admin ? (
              <>
                <ShieldAlert className="mr-2 h-4 w-4" />
                <span>Revoke Admin</span>
              </>
            ) : (
              <>
                <Shield className="mr-2 h-4 w-4" />
                <span>Make Admin</span>
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={async () => {
              setIsLoading(true)
              try {
                const result = await toggleUserSuspension(user.id, !user.is_suspended)
                if (result.success) {
                  toast.success(`User ${!user.is_suspended ? "suspended" : "activated"}`)
                } else {
                  toast.error(result.error || "Failed to update user status")
                }
              } catch (error) {
                toast.error("An unexpected error occurred")
              } finally {
                setIsLoading(false)
              }
            }}
          >
            {user.is_suspended ? (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                <span>Activate User</span>
              </>
            ) : (
              <>
                <Ban className="mr-2 h-4 w-4" />
                <span>Suspend User</span>
              </>
            )}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={() => setShowDeleteDialog(true)}
            className="text-destructive focus:text-destructive cursor-pointer hover:bg-red-50"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete Account</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 text-destructive hover:text-destructive hover:bg-red-50"
        onClick={() => setShowDeleteDialog(true)}
        disabled={isLoading}
        title="Delete User"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the user account
              for {user.email} and remove their data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault()
                handleDeleteUser()
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? "Deleting..." : "Delete Account"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
