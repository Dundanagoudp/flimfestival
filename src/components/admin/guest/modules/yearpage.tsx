"use client"

import useSWR from "swr"
import { useMemo, useState } from "react"
import { getYears, deleteYear } from "@/services/guestService"
import type { Year } from "@/types/guestTypes"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/custom-toast"
import YearModal from "@/components/admin/guest/modules/popups/year-modal"
import { Trash2, Pencil, Plus } from "lucide-react"
import DynamicButton from "@/components/common/DynamicButton"
import DynamicPagination from "@/components/common/DynamicPagination"
import { BounceLoader } from "@/components/ui/bounce-loader"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const fetcher = async () => getYears()

export default function YearsPage() {
  const { data, isLoading, mutate } = useSWR<Year[]>("/guest/years", fetcher)
  const { showToast } = useToast()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Year | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; year: Year | null }>({ open: false, year: null })

  const years = useMemo(() => data ?? [], [data])
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  // Pagination calculations
  const totalPages = Math.ceil(years.length / itemsPerPage)
  const paginatedYears = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return years.slice(startIndex, endIndex)
  }, [years, currentPage, itemsPerPage])

  async function onDelete(y: Year) {
    try {
      await deleteYear(y._id)
      showToast("Year deleted successfully", "success")
      mutate()
    } catch (e: any) {
      showToast(e?.message || "Failed to delete year", "error")
    }
  }

  function confirmDelete(year: Year) {
    setDeleteDialog({ open: true, year })
  }

  function handleDelete() {
    if (deleteDialog.year) {
      onDelete(deleteDialog.year)
      setDeleteDialog({ open: false, year: null })
    }
  }

  return (
    <main className="p-4 md:p-6 max-w-8xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl md:text-2xl font-semibold text-pretty">Years</h1>
        <DynamicButton
          onClick={() => {
            setEditing(null)
            setOpen(true)
          }}
          icon={<Plus className="size-4" />}
        >
          Create Year
        </DynamicButton>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-pretty">All Years</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <BounceLoader size="lg" className="mb-2" />
              <div className="text-center space-y-2">
                <p className="text-lg font-medium text-foreground">Loading Years...</p>
                <p className="text-sm text-muted-foreground">Please wait while we fetch the data</p>
              </div>
            </div>
          ) : years.length === 0 ? (
            <p className="text-sm text-muted-foreground">No years yet. Create the first one.</p>
          ) : (
            <>
              <div className="grid gap-3 md:hidden">
                {paginatedYears.map((y) => (
                  <div key={y._id} className="rounded-md border p-3 flex items-center justify-between">
                    <div>
                      <div className="font-medium">{y.name ? `${y.value} — ${y.name}` : y.value}</div>
                      <div className="text-xs text-muted-foreground">Active: {y.active ? "Yes" : "No"}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <DynamicButton
                        size="icon"
                        variant="outline"
                        onClick={() => {
                          setEditing(y)
                          setOpen(true)
                        }}
                        aria-label="Edit year"
                        icon={<Pencil className="size-4" />}
                      >
                        <span className="sr-only">Edit</span>
                      </DynamicButton>
                      <DynamicButton 
                        size="icon" 
                        variant="destructive" 
                        onClick={() => confirmDelete(y)} 
                        aria-label="Delete year"
                        icon={<Trash2 className="size-4" />}
                      >
                        <span className="sr-only">Delete</span>
                      </DynamicButton>
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Value</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Active</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedYears.map((y) => (
                      <TableRow key={y._id}>
                        <TableCell className="font-medium">{y.value}</TableCell>
                        <TableCell>{y.name || "-"}</TableCell>
                        <TableCell>{y.active ? "Yes" : "No"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <DynamicButton
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditing(y)
                                setOpen(true)
                              }}
                              icon={<Pencil className="size-4" />}
                            >
                              Edit
                            </DynamicButton>
                            <DynamicButton 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => confirmDelete(y)}
                              icon={<Trash2 className="size-4" />}
                            >
                              Delete
                            </DynamicButton>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {years.length > 0 && totalPages > 1 && (
        <div className="mt-4">
          <DynamicPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={years.length}
            itemsPerPage={itemsPerPage}
            showItemsInfo={true}
          />
        </div>
      )}

      <YearModal open={open} onClose={() => setOpen(false)} initial={editing} onSuccess={() => mutate()} />

      <Dialog open={deleteDialog.open} onOpenChange={(open: boolean) => setDeleteDialog({ open, year: deleteDialog.year })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the year "{deleteDialog.year?.value}".
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DynamicButton variant="outline" onClick={() => setDeleteDialog({ open: false, year: null })}>
              Cancel
            </DynamicButton>
            <DynamicButton onClick={handleDelete} variant="destructive">
              Delete
            </DynamicButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
