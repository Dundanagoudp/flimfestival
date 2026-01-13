"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Loader2, Calendar, Clock, MapPin } from "lucide-react"
import { getEventById, getEventDay, getTime } from "@/services/eventsService"
import type { EventDayItem, EventItem } from "@/types/eventsTypes"
import { getMediaUrl } from "@/utils/media"

interface ViewEventModalProps {
  isOpen: boolean
  onClose: () => void
  eventId: string | null
}

export default function ViewEventModal({ isOpen, onClose, eventId }: ViewEventModalProps) {
  const [loading, setLoading] = useState(false)
  const [event, setEvent] = useState<EventItem | null>(null)
  const [days, setDays] = useState<EventDayItem[]>([])
  const totalSessions = days.reduce((sum, d) => sum + (d.times?.length ?? 0), 0)

  useEffect(() => {
    // Reset data whenever modal is opened or the eventId changes
    if (!isOpen || !eventId) {
      setEvent(null)
      setDays([])
      return
    }
    setEvent(null)
    setDays([])
    setLoading(true)
    void (async () => {
      try {
        const [ev, daysOnly, allTimes] = await Promise.all([getEventById(eventId), getEventDay(eventId), getTime()])
        const timesByDay = (allTimes || [])
          .filter((t) => t.event_ref === eventId)
          .reduce<Record<string, any[]>>((acc, t) => {
            const k = t.day_ref
            if (!acc[k]) acc[k] = []
            acc[k].push(t)
            return acc
          }, {})
        const mergedDays = (daysOnly || [])
          .map((d) => ({ ...d, times: timesByDay[d._id] ?? d.times ?? [] }))
          .sort((a, b) => a.dayNumber - b.dayNumber)
        setEvent(ev)
        setDays(mergedDays)
      } finally {
        setLoading(false)
      }
    })()
  }, [isOpen, eventId])

  const getImageSrc = (url: string) => {
    return getMediaUrl(url)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        key={eventId || "no-event"}
        className="max-w-3xl max-h-[85vh] overflow-y-auto data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 duration-200"
      >
        <DialogHeader>
          <DialogTitle>Event Details</DialogTitle>
          <DialogDescription>Overview of the selected event.</DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : event ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">{event.name}</h3>
                <p className="text-sm text-muted-foreground">{event.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(event.startDate).toLocaleDateString()} – {new Date(event.endDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{event.totalDays} days</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-1.5 py-0.5 rounded bg-muted">Year</span>
                    <span>{event.year}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-1.5 py-0.5 rounded bg-muted">Month</span>
                    <span>{event.month}</span>
                  </div>
                  {event.location && (
                    <div className="flex items-center gap-2 sm:col-span-2">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                  )}
                </div>
              </div>
              {event.image && (
                <img
                  src={getImageSrc(event.image) || "/placeholder.svg"}
                  alt={event.name}
                  className="w-full h-64 md:h-80 object-cover rounded border"
                />
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold">Days ({days.length})</h4>
                <div className="text-sm text-muted-foreground">Total sessions: {totalSessions}</div>
              </div>
              {days.length === 0 ? (
                <p className="text-sm text-muted-foreground">No days configured.</p>
              ) : (
                <ul className="space-y-2 max-h-64 overflow-auto pr-1">
                  {days.map((d) => (
                    <li key={d._id} className="border rounded p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">
                            Day {d.dayNumber}: {d.name}
                          </div>
                          <div className="text-xs text-muted-foreground">{d.description}</div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(d.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-xs mt-2 text-muted-foreground">Sessions: {d.times?.length ?? 0}</div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Event not found.</p>
        )}
      </DialogContent>
    </Dialog>
  )
}
