"use client"

import useSWR from "swr"
import { useMemo, useState } from "react"
import { getAllGuests, getYears, getGuestsByYearId, deleteGuest } from "@/services/guestService"
import type { Guest, Year } from "@/types/guestTypes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/custom-toast"
import GuestModal from "@/components/admin/guest/modules/popups/guest-modal"
import { Trash2, Pencil, Plus } from "lucide-react"
import Image from "next/image"
import DynamicButton from "@/components/common/DynamicButton"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const fetchYears = async () => getYears()
const fetchGuestsAll = async () => getAllGuests()
const fetchGuestsByYear = async (yearId: string) => (await getGuestsByYearId(yearId)).guests

export default function GuestsPage() {
  const { data: yearsData } = useSWR<Year[]>("/guest/years", fetchYears)
  const [yearFilter, setYearFilter] = useState<string>("all")

  const guestsKey = yearFilter === "all" ? "/guest/allguests" : `/guest/guests/year/${yearFilter}`
  const {
    data: guestsData,
    isLoading,
    mutate,
  } = useSWR<Guest[]>(guestsKey, () => (yearFilter === "all" ? fetchGuestsAll() : fetchGuestsByYear(yearFilter)))

  const { showToast } = useToast()
  const guests = useMemo(() => guestsData ?? [], [guestsData])
  const years = useMemo(() => yearsData ?? [], [yearsData])

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Guest | null>(null)
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; guest: Guest | null }>({ open: false, guest: null })

  async function onDelete(g: Guest) {
    try {
      await deleteGuest(g._id)
      showToast("Guest deleted successfully", "success")
      mutate()
    } catch (e: any) {
      showToast(e?.message || "Failed to delete guest", "error")
    }
  }

  function confirmDelete(guest: Guest) {
    setDeleteDialog({ open: true, guest })
  }

  function handleDelete() {
    if (deleteDialog.guest) {
      onDelete(deleteDialog.guest)
      setDeleteDialog({ open: false, guest: null })
    }
  }

  return (
    <main className="p-2 md:p-4 max-w-12xl ">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h1 className="text-xl md:text-2xl font-semibold text-pretty">Guests</h1>
        <div className="flex items-center gap-2">
          <select
            className="h-10 w-[200px] rounded-md border border-input bg-background px-3 text-sm"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
          >
            <option value="all">All Years</option>
            {years.map((y) => (
              <option key={y._id} value={y._id}>
                {y.name ? `${y.value} — ${y.name}` : String(y.value)}
              </option>
            ))}
          </select>
          <DynamicButton
            onClick={() => {
              setEditing(null)
              setOpen(true)
            }}
            icon={<Plus className="size-4" />}
          >
            Add Guest
          </DynamicButton>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-pretty">All Guests</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : guests.length === 0 ? (
            <p className="text-sm text-muted-foreground">No guests to show.</p>
          ) : (
            <>
              <div className="grid gap-3 md:hidden">
                {guests.map((g) => (
                  <div key={g._id} className="rounded-md border p-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-md overflow-hidden bg-muted shrink-0">
                        <Image
                          src={
                            typeof g.photo === "string" && g.photo
                              ? g.photo
                              : "/placeholder.svg?height=48&width=48&query=guest%20photo"
                          }
                          alt={g.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="font-medium truncate">{g.name}</div>
                        <div className="text-xs text-muted-foreground">{g.role}</div>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground line-clamp-3">{g.description}</div>
                    <div className="mt-3 flex items-center justify-end gap-2">
                      <DynamicButton
                        size="icon"
                        variant="outline"
                        onClick={() => {
                          setEditing(g)
                          setOpen(true)
                        }}
                        aria-label="Edit guest"
                        icon={<Pencil className="size-4" />}
                      >
                        <span className="sr-only">Edit</span>
                      </DynamicButton>
                      <DynamicButton 
                        size="icon" 
                        variant="destructive" 
                        onClick={() => confirmDelete(g)} 
                        aria-label="Delete guest"
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
                      <TableHead>Photo</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Year</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {guests.map((g) => (
                      <TableRow key={g._id}>
                        <TableCell>
                          <div className="relative h-10 w-10 rounded-md overflow-hidden bg-muted">
                            <Image
                              src={
                                typeof g.photo === "string" && g.photo
                                  ? g.photo
                                  : "/placeholder.svg?height=40&width=40&query=guest%20photo"
                              }
                              alt={g.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{g.name}</TableCell>
                        <TableCell>{g.role}</TableCell>
                        <TableCell>{typeof g.year === "number" ? g.year : "-"}</TableCell>
                        <TableCell>{g.age}</TableCell>
                        <TableCell className="max-w-[320px]">
                          <div className="text-sm text-muted-foreground line-clamp-2">{g.description}</div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <DynamicButton
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditing(g)
                                setOpen(true)
                              }}
                              icon={<Pencil className="size-4" />}
                            >
                              Edit
                            </DynamicButton>
                            <DynamicButton 
                              size="sm" 
                              variant="destructive" 
                              onClick={() => confirmDelete(g)}
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

      <GuestModal
        open={open}
        onClose={() => setOpen(false)}
        initial={editing}
        years={years}
        onSuccess={() => mutate()}
      />

      <Dialog open={deleteDialog.open} onOpenChange={(open: boolean) => setDeleteDialog({ open, guest: deleteDialog.guest })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the guest "{deleteDialog.guest?.name}".
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, guest: null })}>
              Cancel
            </Button>
            <DynamicButton onClick={handleDelete} variant="destructive">
              Delete
            </DynamicButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
