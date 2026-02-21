"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/custom-toast"
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/services/sessionPlanService"
import type { SessionPlanCategory } from "@/types/sessionPlanTypes"
import { Plus, Edit, Trash2, Loader2, Tag } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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

function idOf(c: SessionPlanCategory) {
  return c.id ?? c._id
}

export default function SessionPlanCategoriesPage() {
  const { showToast } = useToast()
  const [categories, setCategories] = useState<SessionPlanCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [selected, setSelected] = useState<SessionPlanCategory | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const [addName, setAddName] = useState("")
  const [addOrder, setAddOrder] = useState("")
  const [addVisible, setAddVisible] = useState(true)
  const [editName, setEditName] = useState("")
  const [editOrder, setEditOrder] = useState("")
  const [editVisible, setEditVisible] = useState(true)

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const data = await getCategories()
      setCategories(Array.isArray(data) ? data : [])
    } catch (err: any) {
      showToast(err?.message || "Failed to load categories", "error")
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleAddOpen = () => {
    setAddName("")
    setAddOrder("")
    setAddVisible(true)
    setAddOpen(true)
  }

  const handleAddSubmit = async () => {
    if (!addName.trim()) {
      showToast("Name is required", "error")
      return
    }
    setSubmitting(true)
    try {
      const payload: { name: string; order?: number; isVisible?: boolean } = {
        name: addName.trim(),
        isVisible: addVisible,
      }
      if (addOrder.trim() !== "") payload.order = Number(addOrder) || 0
      const created = await createCategory(payload)
      setCategories((prev) => [...prev, created])
      setAddOpen(false)
      showToast("Category created", "success")
    } catch (err: any) {
      showToast(err?.message || "Failed to create category", "error")
    } finally {
      setSubmitting(false)
    }
  }

  const handleEditOpen = (cat: SessionPlanCategory) => {
    setSelected(cat)
    setEditName(cat.name)
    setEditOrder(cat.order != null ? String(cat.order) : "")
    setEditVisible(cat.isVisible ?? true)
    setEditOpen(true)
  }

  const handleEditSubmit = async () => {
    if (!selected) return
    if (!editName.trim()) {
      showToast("Name is required", "error")
      return
    }
    setSubmitting(true)
    try {
      const payload: { name?: string; order?: number; isVisible?: boolean } = {
        name: editName.trim(),
        isVisible: editVisible,
      }
      if (editOrder.trim() !== "") payload.order = Number(editOrder) || 0
      const updated = await updateCategory(idOf(selected), payload)
      setCategories((prev) =>
        prev.map((c) => (idOf(c) === idOf(updated) ? updated : c))
      )
      setEditOpen(false)
      setSelected(null)
      showToast("Category updated", "success")
    } catch (err: any) {
      showToast(err?.message || "Failed to update category", "error")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteOpen = (cat: SessionPlanCategory) => {
    setSelected(cat)
    setDeleteOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!selected) return
    setSubmitting(true)
    try {
      await deleteCategory(idOf(selected))
      setCategories((prev) => prev.filter((c) => idOf(c) !== idOf(selected)))
      setDeleteOpen(false)
      setSelected(null)
      showToast("Category deleted", "success")
    } catch (err: any) {
      showToast(err?.message || "Failed to delete category", "error")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-3 pt-0 sm:gap-6 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Session Plan Categories
          </h1>
          <p className="text-sm text-muted-foreground">
            Categories for slot types (Film, Workshop, etc.). Use visible categories in the slot
            dropdown when adding/editing slots.
          </p>
        </div>
        <Button onClick={handleAddOpen}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm sm:text-base">All Categories</CardTitle>
          <CardDescription>
            {categories.length} categor{categories.length !== 1 ? "ies" : "y"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Tag className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="mb-4">No categories yet. Add one to use in slots.</p>
              <Button onClick={handleAddOpen}>
                <Plus className="mr-2 h-4 w-4" />
                Add Category
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {categories.map((cat) => (
                <div
                  key={idOf(cat)}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{cat.name}</span>
                    {cat.order != null && (
                      <Badge variant="secondary">Order: {cat.order}</Badge>
                    )}
                    <Badge variant={cat.isVisible ? "default" : "outline"}>
                      {cat.isVisible ? "Visible" : "Hidden"}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditOpen(cat)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteOpen(cat)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription>Create a session plan category for slot types.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="add-name">Name *</Label>
              <Input
                id="add-name"
                value={addName}
                onChange={(e) => setAddName(e.target.value)}
                placeholder="e.g. Film"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-order">Order (optional)</Label>
              <Input
                id="add-order"
                type="number"
                value={addOrder}
                onChange={(e) => setAddOrder(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="add-visible"
                checked={addVisible}
                onChange={(e) => setAddVisible(e.target.checked)}
                className="rounded border-input"
              />
              <Label htmlFor="add-visible" className="font-normal cursor-pointer">
                Visible in slot dropdown
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleAddSubmit} disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>Update name, order, or visibility.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Name *</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="e.g. Film"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-order">Order (optional)</Label>
              <Input
                id="edit-order"
                type="number"
                value={editOrder}
                onChange={(e) => setEditOrder(e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="edit-visible"
                checked={editVisible}
                onChange={(e) => setEditVisible(e.target.checked)}
                className="rounded border-input"
              />
              <Label htmlFor="edit-visible" className="font-normal cursor-pointer">
                Visible in slot dropdown
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditOpen(false)} disabled={submitting}>
              Cancel
            </Button>
            <Button onClick={handleEditSubmit} disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete category?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove &quot;{selected?.name}&quot;. Slots using this category may need to
              be updated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground"
              disabled={submitting}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
