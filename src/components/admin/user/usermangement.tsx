"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Users, Mail, Plus, Edit, Trash2, Search, MoreHorizontal, Crown, User as UserIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getAllUsers, deleteUser, getMyProfile } from "@/services/userServices"
import type { User as UserType } from "@/types/user-types"
import { useToast } from "@/hooks/use-toast"
import AddUserModal from "@/components/admin/user/modules/popups/add-user-modal"
import EditUserModal from "@/components/admin/user/modules/popups/edit-user-modal"
import ViewUserDrawer from "@/components/admin/user/modules/popups/view-user-drawer"

export default function UserManagement() {
  const { showToast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null)
  const [users, setUsers] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)

  useEffect(() => {
    void Promise.all([fetchUsers(), fetchCurrentUser()])
  }, [])

  const fetchCurrentUser = async () => {
    try {
      const res = await getMyProfile()
      if (res.success && res.data) {
        setCurrentUserId(res.data._id)
      }
    } catch {
      // ignore; non-blocking
    }
  }

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await getAllUsers()
      if (response.success && response.data) {
        setUsers(response.data)
      } else {
        showToast(response.error || "Failed to fetch users", "error")
      }
    } catch (error) {
      showToast("Failed to fetch users", "error")
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = useMemo(() => {
    const lowered = searchTerm.toLowerCase()
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(lowered) || user.email.toLowerCase().includes(lowered)
      const matchesRole = roleFilter === "all" || user.role === roleFilter
      return matchesSearch && matchesRole
    })
  }, [users, searchTerm, roleFilter])

  const handleDelete = (user: UserType) => {
    if (currentUserId && user._id === currentUserId) {
      showToast("You cannot delete your own account", "warning")
      return
    }
    // Ensure other overlays are closed, then open delete dialog next frame
    setAddOpen(false)
    setEditOpen(false)
    setViewOpen(false)
    setSelectedUser(user)
    requestAnimationFrame(() => setDeleteDialogOpen(true))
  }

  const confirmDelete = async () => {
    if (!selectedUser) return

    try {
      const response = await deleteUser(selectedUser._id)
      if (response.success) {
        showToast("User deleted successfully", "success")
        await fetchUsers()
      } else {
        showToast(response.error || "Failed to delete user", "error")
      }
    } catch (error) {
      showToast("Failed to delete user", "error")
    } finally {
      setDeleteDialogOpen(false)
      setSelectedUser(null)
    }
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <Badge variant="destructive">
            <Crown className="w-3 h-3 mr-1" />
            Admin
          </Badge>
        )
      case "user":
        return (
          <Badge variant="outline">
            <UserIcon className="w-3 h-3 mr-1" />
            User
          </Badge>
        )
      default:
        return <Badge variant="outline">{role}</Badge>
    }
  }

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()

  if (loading) {
  return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900" />
          <p className="mt-4">Loading users...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Users Management</h1>
          <p className="text-muted-foreground">Manage user accounts and roles.</p>
        </div>
        <Button onClick={() => {
          // ensure others are closed
          setEditOpen(false)
          setViewOpen(false)
          requestAnimationFrame(() => setAddOpen(true))
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.length}</div>
            <p className="text-xs text-muted-foreground">All registered users</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Crown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((u) => u.role === "admin").length}</div>
            <p className="text-xs text-muted-foreground">Admin accounts</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Regular Users</CardTitle>
            <UserIcon className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{users.filter((u) => u.role === "user").length}</div>
            <p className="text-xs text-muted-foreground">Regular users</p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-muted/30 border-dashed">
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label htmlFor="search">Search users</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-none">
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>
            {filteredUsers.length} user{filteredUsers.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center border rounded-xl bg-white">
              <Search className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No users match your filters.</p>
            </div>
          ) : (
          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <div key={user._id} className="group flex items-center justify-between p-4 border rounded-xl bg-white hover:shadow-sm transition-shadow">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src="/placeholder.svg" alt={user.name} />
                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold leading-none">{user.name}</h3>
                      {getRoleBadge(user.role)}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {user.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="opacity-70 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => {
                        setSelectedUser(user)
                        // close other overlays before opening
                        setEditOpen(false)
                        setAddOpen(false)
                        requestAnimationFrame(() => setViewOpen(true))
                      }}>
                        <MoreHorizontal className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        setSelectedUser(user)
                        setViewOpen(false)
                        setAddOpen(false)
                        requestAnimationFrame(() => setEditOpen(true))
                      }}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit User
                      </DropdownMenuItem>
                      {currentUserId !== user._id && (
                      <DropdownMenuItem
                        onSelect={(e) => {
                          e.preventDefault()
                          handleDelete(user)
                        }}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedUser?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create / Edit Modals */}
      <AddUserModal open={addOpen} onOpenChange={setAddOpen} onSuccess={fetchUsers} />
      <EditUserModal open={editOpen} onOpenChange={setEditOpen} user={selectedUser} onSuccess={fetchUsers} />
      <ViewUserDrawer open={viewOpen} onOpenChange={setViewOpen} user={selectedUser} />
    </div>
  )
}

// Modals mounted at root to avoid z-index issues
;(() => {})
