"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DynamicButton from "@/components/common/DynamicButton"
import type { EditUserData, User } from "@/types/user-types"
import { editUser } from "@/services/userServices"
import { useToast } from "@/hooks/use-toast"

interface EditUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
  onSuccess?: () => void
}

export default function EditUserModal({ open, onOpenChange, user, onSuccess }: EditUserModalProps) {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<EditUserData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "editor",
  })

  useEffect(() => {
    if (user) {
      setFormData({ name: user.name, email: user.email, password: "", confirmPassword: "", role: user.role })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setLoading(true)
    try {
      if (formData.password && formData.password !== formData.confirmPassword) {
        showToast("Passwords do not match", "error")
        return
      }
      if (formData.password && formData.password.length < 6) {
        showToast("Password must be at least 6 characters long", "error")
        return
      }
      const updateData: EditUserData = { name: formData.name, email: formData.email, role: formData.role }
      if (formData.password) {
        updateData.password = formData.password
        updateData.confirmPassword = formData.confirmPassword
      }
      const response = await editUser(user._id, updateData)
      if (response.success) {
        showToast("User updated successfully!", "success")
        onOpenChange(false)
        onSuccess?.()
      } else {
        showToast(response.error || "Failed to update user", "error")
      }
    } catch (error) {
      showToast("Failed to update user", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof EditUserData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Card className="border-0 shadow-none">
            <CardHeader className="px-0">
              <CardTitle>User Information</CardTitle>
              <CardDescription>Update the user's basic information and role.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-0">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter full name..."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder="user@example.com"
                    required
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password (Optional)</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="Leave blank to keep current password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    placeholder="Confirm new password"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">User Role *</Label>
                <Select value={formData.role} onValueChange={(value: "admin" | "editor") => handleInputChange("role", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select user role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
          <DialogFooter className="mt-4">
            <DynamicButton type="submit" loading={loading} loadingText="Updating...">
              Update User
            </DynamicButton>
            <DynamicButton type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </DynamicButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

