"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Clock, Eye, Loader2, MoreHorizontal, Plus, Trash2, Upload, Image as ImageIcon, Edit } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/custom-toast"
import { deleteEvent, getEvent, getFullEvent, getTime, uploadEventDayImage, updateEventDayWithImage, deleteEventDayImage } from "@/services/eventsService"
import type { EventDayItem, EventItem, TimeEntry } from "@/types/eventsTypes"
import EditTimeSlotModal from "./module/popups/edit-timeslot-modal"
import DeleteTimeSlotModal from "./module/popups/delete-timeslot-modal"
import UpdateDayImageModal from "./module/popups/update-day-image-modal"
import DeleteDayImageModal from "./module/popups/delete-day-image-modal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function EventsMainpage() {
  const { showToast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentEvent, setCurrentEvent] = useState<EventItem | null>(null)
  const [days, setDays] = useState<EventDayItem[]>([])
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<TimeEntry | null>(null)
  const [selectedDayId, setSelectedDayId] = useState("")
  const [uploadingImage, setUploadingImage] = useState<string | null>(null)
  const [updateImageModalOpen, setUpdateImageModalOpen] = useState(false)
  const [deleteImageModalOpen, setDeleteImageModalOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<EventDayItem | null>(null)

  useEffect(() => {
    void fetchData()
  }, [])

  async function fetchData() {
    setIsLoading(true)
    try {
      const events = await getEvent()
      const first = events?.[0] ?? null
      setCurrentEvent(first ?? null)
      if (first) {
        const [full, allTimes] = await Promise.all([getFullEvent(first._id), getTime()])
        const timesByDay = (allTimes || []).filter((t) => t.event_ref === first._id).reduce<Record<string, TimeEntry[]>>((acc, t) => {
          const k = t.day_ref
          if (!acc[k]) acc[k] = []
          acc[k].push(t)
          return acc
        }, {})
        const mergedDays = (full?.days ?? []).map((d) => ({ ...d, times: timesByDay[d._id] ?? d.times ?? [] }))
        setDays(mergedDays)
      } else {
        setDays([])
      }
    } catch (err: any) {
      showToast(err?.message ?? "Failed to load events", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const filteredDays = useMemo(() => {
    if (!searchTerm) return days
    const q = searchTerm.toLowerCase()
    return days.filter((d) => d.name.toLowerCase().includes(q) || d.description.toLowerCase().includes(q))
  }, [days, searchTerm])

  const totalSessions = useMemo(() => days.reduce((sum, d) => sum + (d.times?.length ?? 0), 0), [days])

  async function handleDeleteEvent(eventId: string) {
    if (!confirm("Are you sure you want to delete this event?")) return
    setIsDeleting(eventId)
    try {
      const res = await deleteEvent(eventId)
      showToast(res.message ?? "Deleted", "success")
      await fetchData()
    } catch (err: any) {
      showToast(err?.message ?? "Failed to delete event", "error")
    } finally {
      setIsDeleting(null)
    }
  }

  function handleEditTimeSlot(timeSlot: TimeEntry, dayId: string) {
    setSelectedTimeSlot(timeSlot)
    setSelectedDayId(dayId)
    setEditModalOpen(true)
  }

  function handleDeleteTimeSlot(timeSlot: TimeEntry) {
    setSelectedTimeSlot(timeSlot)
    setDeleteModalOpen(true)
  }

  function handleModalSuccess() {
    void fetchData() // Refresh data after successful operation
  }

  async function handleImageUpload(dayId: string, file: File) {
    setUploadingImage(dayId)
    try {
      await uploadEventDayImage(dayId, file)
      showToast("Image uploaded successfully", "success")
      await fetchData() // Refresh data to show new image
    } catch (err: any) {
      showToast(err?.message ?? "Failed to upload image", "error")
    } finally {
      setUploadingImage(null)
    }
  }

  function handleUpdateImage(day: EventDayItem) {
    setSelectedDay(day)
    setUpdateImageModalOpen(true)
  }

  function handleDeleteImage(day: EventDayItem) {
    setSelectedDay(day)
    setDeleteImageModalOpen(true)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
    <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Events Management</h1>
          <p className="text-muted-foreground">Manage events and schedules.</p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link href="/admin/dashboard/events/create">
              <Plus className="mr-2 h-4 w-4" /> Create Event
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/admin/dashboard/events/add-time">
              <Clock className="mr-2 h-4 w-4" /> Add Time Slot
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Event</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentEvent ? 1 : 0}</div>
            <p className="text-xs text-muted-foreground">Active event</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Days</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentEvent?.totalDays ?? 0}</div>
            <p className="text-xs text-muted-foreground">Event duration</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Event Days</CardTitle>
            <Badge>Days</Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{days.length}</div>
            <p className="text-xs text-muted-foreground">Configured days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSessions}</div>
            <p className="text-xs text-muted-foreground">Scheduled sessions</p>
          </CardContent>
        </Card>
      </div>

      {/* Current Event */}
      {currentEvent && (
        <Card>
          <CardHeader>
            <CardTitle>Current Event Details</CardTitle>
            <CardDescription>Information about the active event</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 p-4 border rounded-lg lg:flex-row lg:items-center lg:justify-between">
              <div className="flex-1 space-y-2">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                  <h3 className="text-lg font-semibold">{currentEvent.name}</h3>
                  <Badge className="bg-green-100 text-green-800 w-fit">Active</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{currentEvent.description}</p>
                <div className="flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(currentEvent.startDate).toLocaleDateString()} - {new Date(currentEvent.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" /> <span>{currentEvent.totalDays} days</span>
                  </div>
                  <div className="flex items-center gap-1">Year: {currentEvent.year}</div>
                  <div className="flex items-center gap-1">Month: {currentEvent.month}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" disabled={isDeleting === currentEvent._id}>
                      {isDeleting === currentEvent._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/dashboard/events/${currentEvent._id}`}>
                        <Eye className="mr-2 h-4 w-4" /> View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/dashboard/events/edit/${currentEvent._id}`}>
                        Edit Event
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/admin/dashboard/events/add-time`}>Add Time Slot</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteEvent(currentEvent._id)}>
                      <Trash2 className="mr-2 h-4 w-4" /> Delete Event
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search days */}
      <Card>
        <CardHeader>
          <CardTitle>Search Event Days</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="max-w-md">
            <Label htmlFor="search">Search event days</Label>
            <Input id="search" placeholder="Search by name or description..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* Days list */}
      <Card>
        <CardHeader>
          <CardTitle>Event Days & Sessions</CardTitle>
          <CardDescription>
            {filteredDays.length} day{filteredDays.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredDays.map((day) => (
              <div key={day._id} className="border rounded-lg p-4">
                <div className="flex flex-col gap-3 mb-3 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">Day {day.dayNumber}: {day.name}</h3>
                    <p className="text-sm text-muted-foreground">{day.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">Created: {new Date(day.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{day.times?.length ?? 0} sessions</Badge>
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleImageUpload(day._id, file)
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        disabled={uploadingImage === day._id}
                      />
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={uploadingImage === day._id}
                        className="cursor-pointer"
                      >
                        {uploadingImage === day._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Upload className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Day Image Display */}
                {day.image && (
                  <div className="mb-4">
                    <div className="relative w-full max-w-md">
                      <img
                        src={day.image}
                        alt={`Day ${day.dayNumber} - ${day.name}`}
                        className="w-full h-48 object-cover rounded-lg border"
                      />
                      <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                        <ImageIcon className="h-3 w-3 inline mr-1" />
                        Day Image
                      </div>
                      <div className="absolute bottom-2 right-2 flex gap-1">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleUpdateImage(day)}
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Update
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteImage(day)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {day.times && day.times.length > 0 ? (
                  <div className="space-y-2 mt-4">
                    <h4 className="font-medium text-sm">Sessions:</h4>
                    <div className="grid gap-2 grid-cols-1 lg:grid-cols-2">
                      {day.times.map((t) => (
                        <div key={t._id} className="bg-muted p-3 rounded-md">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <h5 className="font-medium">{t.title}</h5>
                            <Badge variant="secondary">{t.type}</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{t.description}</p>
                          <div className="flex flex-col gap-2 mt-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:gap-4">
                            <span>🕐 {t.startTime} - {t.endTime}</span>
                            <div className="flex gap-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                onClick={() => handleEditTimeSlot(t, day._id)}
                              >
                                Edit
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                onClick={() => handleDeleteTimeSlot(t)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    <Clock className="h-6 w-6 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No sessions scheduled for this day</p>
                    <Button variant="outline" size="sm" className="mt-2" asChild>
                      <Link href="/admin/dashboard/events/add-time">Add Time Slot</Link>
                    </Button>
                  </div>
                )}
              </div>
            ))}

            {filteredDays.length === 0 && !currentEvent && (
              <div className="text-center py-8 text-muted-foreground">
                <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No Events Found</h3>
                <p className="mb-4">Create your first event to get started.</p>
                <Button asChild>
                  <Link href="/admin/dashboard/events/create">
                    <Plus className="mr-2 h-4 w-4" /> Create Event
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <EditTimeSlotModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        timeSlot={selectedTimeSlot}
        dayId={selectedDayId}
        onSuccess={handleModalSuccess}
      />

      <DeleteTimeSlotModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        timeSlot={selectedTimeSlot}
        onSuccess={handleModalSuccess}
      />

      <UpdateDayImageModal
        isOpen={updateImageModalOpen}
        onClose={() => setUpdateImageModalOpen(false)}
        day={selectedDay}
        onSuccess={handleModalSuccess}
      />

      <DeleteDayImageModal
        isOpen={deleteImageModalOpen}
        onClose={() => setDeleteImageModalOpen(false)}
        day={selectedDay}
        onSuccess={handleModalSuccess}
      />
    </div>
  )
}
