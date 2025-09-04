"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import type { User } from "@/types/user-types"
import { Crown, Mail, User as UserIcon } from "lucide-react"

interface ViewUserDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
}

export default function ViewUserDrawer({ open, onOpenChange, user }: ViewUserDrawerProps) {
  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()

  const getRoleBadge = (role?: string) => {
    if (!role) return null
    if (role === "admin") {
      return (
        <Badge variant="destructive" className="ml-2">
          <Crown className="w-3 h-3 mr-1" /> Admin
        </Badge>
      )
    }
    return (
      <Badge variant="outline" className="ml-2">
        <UserIcon className="w-3 h-3 mr-1" /> User
      </Badge>
    )
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[420px] sm:w-[520px] p-0">
        <div className="p-6 border-b">
          <SheetHeader>
            <SheetTitle>User Details</SheetTitle>
            <SheetDescription>Read-only view of the selected user.</SheetDescription>
          </SheetHeader>
        </div>
        <div className="p-6">
          {user ? (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14">
                  <AvatarImage src="/placeholder.svg" alt={user.name} />
                  <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center">
                    <h3 className="text-lg font-semibold">{user.name}</h3>
                    {getRoleBadge(user.role)}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Mail className="h-3.5 w-3.5 mr-1" />
                    {user.email}
                  </div>
                </div>
              </div>

              <Card>
                <CardContent className="space-y-4 p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Name</Label>
                      <div className="font-medium">{user.name}</div>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Role</Label>
                      <div className="font-medium capitalize">{user.role}</div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Email</Label>
                    <div className="font-medium">{user.email}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">No user selected.</div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

