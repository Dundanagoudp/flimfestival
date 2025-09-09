"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import DynamicButton from "@/components/common/DynamicButton"
import type { CreateUserData } from "@/types/user-types"
import { addUser } from "@/services/userServices"
import { useToast } from "@/hooks/use-toast"

interface AddUserModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export default function AddUserModal({ open, onOpenChange, onSuccess }: AddUserModalProps) {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<CreateUserData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "editor",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (formData.password !== formData.confirmPassword) {
        showToast("Passwords do not match", "error")
        return
      }
      if (formData.password.length < 6) {
        showToast("Password must be at least 6 characters long", "error")
        return
      }
      const response = await addUser(formData)
      if (response.success) {
        showToast("User created successfully!", "success")
        onOpenChange(false)
        setFormData({ name: "", email: "", password: "", confirmPassword: "", role: "editor" })
        onSuccess?.()
      } else {
        showToast(response.error || "Failed to create user", "error")
      }
    } catch (error) {
      showToast("Failed to create user", "error")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: keyof CreateUserData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Create New User</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Card className="border-0 shadow-none">
            <CardHeader className="px-0">
              <CardTitle>User Information</CardTitle>
              <CardDescription>Basic information about the new user.</CardDescription>
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
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder="Enter password..."
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    placeholder="Confirm password..."
                    required
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
            <DynamicButton type="submit" loading={loading} loadingText="Creating...">
              Create User
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

