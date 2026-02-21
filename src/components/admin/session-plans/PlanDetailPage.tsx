"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/custom-toast"
import {
  getPlan,
  getCategories,
  createDay,
  updateDay,
  deleteDay,
  createScreen,
  updateScreen,
  deleteScreen,
  createSlot,
  updateSlot,
  deleteSlot,
  getPlanPdf,
  uploadPlanPdf,
  getDayPdf,
  uploadDayPdf,
} from "@/services/sessionPlanService"
import type {
  SessionPlan,
  SessionPlanDay,
  SessionPlanScreen,
  SessionPlanSlot,
  SessionPlanCategory,
} from "@/types/sessionPlanTypes"
import { SlotForm, type SlotFormValues } from "./SlotForm"
import {
  ArrowLeft,
  Loader2,
  Plus,
  Edit,
  Trash2,
  CalendarIcon,
  LayoutList,
  CalendarDays,
  FileUp,
  Download,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
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

function idOfPlan(p: SessionPlan) {
  return p.id ?? p._id
}
function idOfDay(d: SessionPlanDay) {
  return d.id ?? d._id
}
function idOfScreen(s: SessionPlanScreen) {
  return s.id ?? s._id
}
function idOfSlot(s: SessionPlanSlot) {
  return s.id ?? s._id
}

type ModalType =
  | null
  | { type: "addDay" }
  | { type: "addScreen"; dayId: string }
  | { type: "renameScreen"; dayId: string; screenId: string; current: string }
  | { type: "addSlot"; dayId: string; screenId: string }
  | { type: "editSlot"; dayId: string; screenId: string; slot: SessionPlanSlot }

export default function PlanDetailPage() {
  const router = useRouter()
  const params = useParams()
  const planId = params?.planId as string | undefined
  const { showToast } = useToast()
  const [plan, setPlan] = useState<SessionPlan | null>(null)
  const [categories, setCategories] = useState<SessionPlanCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [activeDayIndex, setActiveDayIndex] = useState(0)
  const [scheduleView, setScheduleView] = useState(false)
  const [modal, setModal] = useState<ModalType>(null)
  const [submitting, setSubmitting] = useState(false)
  const [planPdfUrl, setPlanPdfUrl] = useState<string | null>(null)
  const [dayPdfUrls, setDayPdfUrls] = useState<Record<string, string | null>>({})
  const [planPdfLoading, setPlanPdfLoading] = useState(false)
  const [planPdfUploading, setPlanPdfUploading] = useState(false)
  const [dayPdfLoading, setDayPdfLoading] = useState(false)
  const [dayPdfUploading, setDayPdfUploading] = useState(false)

  const pid = plan ? idOfPlan(plan) : planId
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL || ""
  const pdfBaseUrl =
    apiBase && typeof window !== "undefined"
      ? new URL(apiBase).origin
      : ""

  const fetchPlan = async () => {
    if (!pid) return
    setLoading(true)
    try {
      const data = await getPlan(pid)
      setPlan(data)
    } catch (err: any) {
      showToast(err?.message || "Failed to load plan", "error")
      router.push("/admin/dashboard/session-plans")
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const data = await getCategories(true)
      setCategories(Array.isArray(data) ? data : [])
    } catch {
      setCategories([])
    }
  }

  useEffect(() => {
    if (planId) {
      fetchPlan()
    }
  }, [planId])

  useEffect(() => {
    fetchCategories()
  }, [])

  const currentDay = plan?.days?.[activeDayIndex] ?? null

  const fetchPlanPdf = async () => {
    if (!pid) return
    setPlanPdfLoading(true)
    try {
      const url = await getPlanPdf(pid)
      setPlanPdfUrl(url)
    } catch {
      setPlanPdfUrl(null)
    } finally {
      setPlanPdfLoading(false)
    }
  }

  useEffect(() => {
    if (pid) fetchPlanPdf()
  }, [pid])

  const fetchDayPdf = async (dayId: string) => {
    if (!pid) return
    setDayPdfLoading(true)
    try {
      const url = await getDayPdf(pid, dayId)
      setDayPdfUrls((prev) => ({ ...prev, [dayId]: url }))
    } catch {
      setDayPdfUrls((prev) => ({ ...prev, [dayId]: null }))
    } finally {
      setDayPdfLoading(false)
    }
  }

  useEffect(() => {
    if (pid && currentDay) {
      const dayId = idOfDay(currentDay)
      if (dayPdfUrls[dayId] === undefined) fetchDayPdf(dayId)
    }
  }, [pid, currentDay])

  const fullPdfUrl = (pdfUrl: string) =>
    pdfUrl.startsWith("http") ? pdfUrl : `${pdfBaseUrl}${pdfUrl}`

  const MAX_PDF_MB = 10
  const handlePlanPdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !pid) return
    e.target.value = ""
    if (file.size > MAX_PDF_MB * 1024 * 1024) {
      showToast(`PDF must be under ${MAX_PDF_MB}MB`, "error")
      return
    }
    setPlanPdfUploading(true)
    try {
      const url = await uploadPlanPdf(pid, file)
      setPlanPdfUrl(url)
      showToast("Plan PDF uploaded", "success")
    } catch (err: any) {
      showToast(err?.message || "Upload failed", "error")
    } finally {
      setPlanPdfUploading(false)
    }
  }

  const handleDayPdfUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    dayId: string
  ) => {
    const file = e.target.files?.[0]
    if (!file || !pid) return
    e.target.value = ""
    if (file.size > MAX_PDF_MB * 1024 * 1024) {
      showToast(`PDF must be under ${MAX_PDF_MB}MB`, "error")
      return
    }
    setDayPdfUploading(true)
    try {
      const url = await uploadDayPdf(pid, dayId, file)
      setDayPdfUrls((prev) => ({ ...prev, [dayId]: url }))
      showToast("Day PDF uploaded", "success")
    } catch (err: any) {
      showToast(err?.message || "Upload failed", "error")
    } finally {
      setDayPdfUploading(false)
    }
  }

  const handleAddDay = async (dayNumber: number, date: string) => {
    if (!pid) return
    setSubmitting(true)
    try {
      const newDay = await createDay(pid, { dayNumber, date })
      setPlan((prev) => {
        if (!prev) return prev
        return { ...prev, days: [...(prev.days || []), newDay] }
      })
      setModal(null)
      showToast("Day added", "success")
    } catch (err: any) {
      showToast(err?.message || "Failed to add day", "error")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteDay = async (dayId: string) => {
    if (!pid) return
    setSubmitting(true)
    try {
      await deleteDay(pid, dayId)
      setPlan((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          days: (prev.days || []).filter((d) => idOfDay(d) !== dayId),
        }
      })
      setActiveDayIndex((i) => Math.max(0, i - 1))
      showToast("Day deleted", "success")
    } catch (err: any) {
      showToast(err?.message || "Failed to delete day", "error")
    } finally {
      setSubmitting(false)
    }
  }

  const handleAddScreen = async (dayId: string, screenName: string) => {
    if (!pid) return
    setSubmitting(true)
    try {
      const newScreen = await createScreen(pid, dayId, { screenName })
      setPlan((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          days: (prev.days || []).map((d) =>
            idOfDay(d) === dayId
              ? { ...d, screens: [...(d.screens || []), newScreen] }
              : d
          ),
        }
      })
      setModal(null)
      showToast("Screen added", "success")
    } catch (err: any) {
      showToast(err?.message || "Failed to add screen", "error")
    } finally {
      setSubmitting(false)
    }
  }

  const handleRenameScreen = async (
    dayId: string,
    screenId: string,
    screenName: string
  ) => {
    if (!pid) return
    setSubmitting(true)
    try {
      const updated = await updateScreen(pid, dayId, screenId, { screenName })
      setPlan((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          days: (prev.days || []).map((d) =>
            idOfDay(d) === dayId
              ? {
                  ...d,
                  screens: (d.screens || []).map((s) =>
                    idOfScreen(s) === screenId ? updated : s
                  ),
                }
              : d
          ),
        }
      })
      setModal(null)
      showToast("Screen renamed", "success")
    } catch (err: any) {
      showToast(err?.message || "Failed to rename screen", "error")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteScreen = async (dayId: string, screenId: string) => {
    if (!pid) return
    setSubmitting(true)
    try {
      await deleteScreen(pid, dayId, screenId)
      setPlan((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          days: (prev.days || []).map((d) =>
            idOfDay(d) === dayId
              ? {
                  ...d,
                  screens: (d.screens || []).filter(
                    (s) => idOfScreen(s) !== screenId
                  ),
                }
              : d
          ),
        }
      })
      setModal(null)
      showToast("Screen deleted", "success")
    } catch (err: any) {
      showToast(err?.message || "Failed to delete screen", "error")
    } finally {
      setSubmitting(false)
    }
  }

  const handleSaveSlot = async (
    dayId: string,
    screenId: string,
    slotId: string | null,
    values: SlotFormValues
  ) => {
    if (!pid) return
    setSubmitting(true)
    try {
      const body = {
        title: values.title.trim(),
        startTime: values.startTime.trim(),
        endTime: values.endTime.trim() || undefined,
        director: values.director.trim() || undefined,
        moderator: values.moderator.trim() || undefined,
        duration: values.duration.trim() || undefined,
        category: values.category.trim() || undefined,
        description: values.description.trim() || undefined,
        order: values.order.trim() !== "" ? Number(values.order) : undefined,
      }
      if (slotId) {
        const updated = await updateSlot(pid, dayId, screenId, slotId, body)
        setPlan((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            days: (prev.days || []).map((d) =>
              idOfDay(d) === dayId
                ? {
                    ...d,
                    screens: (d.screens || []).map((s) =>
                      idOfScreen(s) === screenId
                        ? {
                            ...s,
                            slots: (s.slots || []).map((sl) =>
                              idOfSlot(sl) === slotId ? updated : sl
                            ),
                          }
                        : s
                    ),
                  }
                : d
            ),
          }
        })
        showToast("Slot updated", "success")
      } else {
        const newSlot = await createSlot(pid, dayId, screenId, body)
        setPlan((prev) => {
          if (!prev) return prev
          return {
            ...prev,
            days: (prev.days || []).map((d) =>
              idOfDay(d) === dayId
                ? {
                    ...d,
                    screens: (d.screens || []).map((s) =>
                      idOfScreen(s) === screenId
                        ? {
                            ...s,
                            slots: [...(s.slots || []), newSlot],
                          }
                        : s
                    ),
                  }
                : d
            ),
          }
        })
        showToast("Slot added", "success")
      }
      setModal(null)
    } catch (err: any) {
      showToast(err?.message || "Failed to save slot", "error")
    } finally {
      setSubmitting(false)
    }
  }

  const handleDeleteSlot = async (
    dayId: string,
    screenId: string,
    slotId: string
  ) => {
    if (!pid) return
    setSubmitting(true)
    try {
      await deleteSlot(pid, dayId, screenId, slotId)
      setPlan((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          days: (prev.days || []).map((d) =>
            idOfDay(d) === dayId
              ? {
                  ...d,
                  screens: (d.screens || []).map((s) =>
                    idOfScreen(s) === screenId
                      ? {
                          ...s,
                          slots: (s.slots || []).filter(
                            (sl) => idOfSlot(sl) !== slotId
                          ),
                        }
                      : s
                  ),
                }
              : d
          ),
        }
      })
      setModal(null)
      showToast("Slot deleted", "success")
    } catch (err: any) {
      showToast(err?.message || "Failed to delete slot", "error")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || !plan) {
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
      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        {/* Main content */}
        <div className="flex flex-1 flex-col gap-4 min-w-0">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/dashboard/session-plans">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Editing Plan
            </p>
            <h1 className="text-xl font-bold">
              {plan.festival} — {plan.year}
            </h1>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setScheduleView((v) => !v)}
        >
          {scheduleView ? (
            <>
              <LayoutList className="mr-2 h-4 w-4" />
              Admin view
            </>
          ) : (
            <>
              <CalendarDays className="mr-2 h-4 w-4" />
              Schedule view
            </>
          )}
        </Button>
      </div>

      {/* Day tabs */}
      <div className="flex flex-wrap items-center gap-1 border-b">
        {(plan.days || []).map((day, i) => (
          <Button
            key={idOfDay(day)}
            variant={activeDayIndex === i ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setActiveDayIndex(i)}
          >
            Day {day.dayNumber} · {day.date}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          className="border-dashed"
          onClick={() => setModal({ type: "addDay" })}
        >
          <Plus className="h-4 w-4" />
          Day
        </Button>
      </div>

      {currentDay ? (
        scheduleView ? (
          <ScheduleTableView day={currentDay} />
        ) : (
          <AdminGridView
            day={currentDay}
            onAddScreen={() =>
              setModal({ type: "addScreen", dayId: idOfDay(currentDay) })
            }
            onRenameScreen={(screenId, current) =>
              setModal({
                type: "renameScreen",
                dayId: idOfDay(currentDay),
                screenId,
                current,
              })
            }
            onDeleteScreen={(screenId) => {
              if (
                confirm(
                  "Delete this screen and all its slots?"
                )
              ) {
                handleDeleteScreen(idOfDay(currentDay), screenId)
              }
            }}
            onAddSlot={(screenId) =>
              setModal({
                type: "addSlot",
                dayId: idOfDay(currentDay),
                screenId,
              })
            }
            onEditSlot={(slot) =>
              setModal({
                type: "editSlot",
                dayId: idOfDay(currentDay),
                screenId: (slot as any).screenId ?? "",
                slot,
              })
            }
            onDeleteSlot={(screenId, slotId) => {
              if (confirm("Delete this slot?")) {
                handleDeleteSlot(idOfDay(currentDay), screenId, slotId)
              }
            }}
            onDeleteDay={() => {
              if (confirm("Delete this day and all its data?")) {
                handleDeleteDay(idOfDay(currentDay))
              }
            }}
          />
        )
      ) : (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            No days yet. Click &quot;+ Day&quot; to add a day.
          </CardContent>
        </Card>
      )}
        </div>

        {/* Session PDFs sidebar */}
        <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-3">
          <Card className="lg:sticky lg:top-20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Session PDFs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Plan PDF</p>
                {planPdfLoading ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Checking…
                  </div>
                ) : planPdfUrl ? (
                  <div className="flex flex-col gap-2">
                    <span className="text-sm text-muted-foreground">Uploaded</span>
                    <a
                      href={fullPdfUrl(planPdfUrl)}
                      download
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </a>
                  </div>
                ) : (
                  <span className="text-sm text-muted-foreground">Not uploaded</span>
                )}
                <div className="pt-1">
                  <Label htmlFor="plan-pdf-upload" className="sr-only">
                    Upload plan PDF
                  </Label>
                  <Input
                    id="plan-pdf-upload"
                    type="file"
                    accept="application/pdf"
                    className="hidden"
                    onChange={handlePlanPdfUpload}
                    disabled={planPdfUploading || !pid}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() =>
                      document.getElementById("plan-pdf-upload")?.click()
                    }
                    disabled={planPdfUploading || !pid}
                  >
                    {planPdfUploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <>
                        <FileUp className="mr-2 h-4 w-4" />
                        Upload PDF
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {currentDay && (
                <div className="space-y-2 border-t pt-4">
                  <p className="text-sm font-medium">
                    Day {currentDay.dayNumber} PDF
                  </p>
                  {dayPdfLoading ? (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Checking…
                    </div>
                  ) : dayPdfUrls[idOfDay(currentDay)] ? (
                    <div className="flex flex-col gap-2">
                      <span className="text-sm text-muted-foreground">Uploaded</span>
                      <a
                        href={fullPdfUrl(dayPdfUrls[idOfDay(currentDay)]!)}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </a>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">Not uploaded</span>
                  )}
                  <div className="pt-1">
                    <Label htmlFor="day-pdf-upload" className="sr-only">
                      Upload day PDF
                    </Label>
                    <Input
                      id="day-pdf-upload"
                      type="file"
                      accept="application/pdf"
                      className="hidden"
                      onChange={(e) =>
                        handleDayPdfUpload(e, idOfDay(currentDay))
                      }
                      disabled={dayPdfUploading || !pid}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={() =>
                        document.getElementById("day-pdf-upload")?.click()
                      }
                      disabled={dayPdfUploading || !pid}
                    >
                      {dayPdfUploading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <FileUp className="mr-2 h-4 w-4" />
                          Upload PDF
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </aside>
      </div>

      {/* Add Day modal: date picker is inline so no portal/outside-click issues */}
      <Dialog
        open={modal?.type === "addDay"}
        onOpenChange={(open) => !open && setModal(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Day</DialogTitle>
            <DialogDescription>Day number and date for this plan.</DialogDescription>
          </DialogHeader>
          <AddDayForm
            onSubmit={({ dayNumber, date }) =>
              handleAddDay(dayNumber, date)
            }
            onCancel={() => setModal(null)}
            submitting={submitting}
          />
        </DialogContent>
      </Dialog>

      {/* Add Screen modal */}
      <Dialog
        open={modal?.type === "addScreen"}
        onOpenChange={(open) => !open && setModal(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Screen</DialogTitle>
            <DialogDescription>Screen name (e.g. Amphitheatre).</DialogDescription>
          </DialogHeader>
          {modal?.type === "addScreen" && (
            <AddScreenForm
              onSubmit={(name) =>
                handleAddScreen(modal.dayId, name)
              }
              onCancel={() => setModal(null)}
              submitting={submitting}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Rename Screen modal */}
      <Dialog
        open={modal?.type === "renameScreen"}
        onOpenChange={(open) => !open && setModal(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Screen</DialogTitle>
            <DialogDescription>Enter new screen name.</DialogDescription>
          </DialogHeader>
          {modal?.type === "renameScreen" && (
            <AddScreenForm
              initial={modal.current}
              onSubmit={(name) =>
                handleRenameScreen(modal.dayId, modal.screenId, name)
              }
              onCancel={() => setModal(null)}
              submitting={submitting}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Add / Edit Slot modal */}
      <Dialog
        open={
          modal?.type === "addSlot" ||
          modal?.type === "editSlot"
        }
        onOpenChange={(open) => !open && setModal(null)}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {modal?.type === "editSlot" ? "Edit Slot" : "Add Slot"}
            </DialogTitle>
            <DialogDescription>
              Session title, time, category, and optional details.
            </DialogDescription>
          </DialogHeader>
          {pid &&
            (modal?.type === "addSlot" || modal?.type === "editSlot") && (
              <SlotForm
                categories={categories}
                initial={
                  modal.type === "editSlot" ? modal.slot : null
                }
                submitLabel={
                  modal.type === "editSlot" ? "Save changes" : "Add slot"
                }
                onSubmit={async (values) => {
                  await handleSaveSlot(
                    modal.dayId,
                    modal.screenId,
                    modal.type === "editSlot"
                      ? idOfSlot(modal.slot)
                      : null,
                    values
                  )
                }}
                onCancel={() => setModal(null)}
              />
            )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function formatDayDate(d: Date): string {
  const day = d.getDate()
  const suffix =
    day === 1 || day === 21 || day === 31
      ? "st"
      : day === 2 || day === 22
        ? "nd"
        : day === 3 || day === 23
          ? "rd"
          : "th"
  const month = d.toLocaleString("default", { month: "long" })
  const year = d.getFullYear()
  return `${day}${suffix} ${month}, ${year}`
}

function AddDayForm({
  onSubmit,
  onCancel,
  submitting,
}: {
  onSubmit: (data: { dayNumber: number; date: string }) => void
  onCancel: () => void
  submitting: boolean
}) {
  const [dayNumber, setDayNumber] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [datePickerOpen, setDatePickerOpen] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const num = Number(dayNumber)
    if (!dayNumber.trim() || !selectedDate || isNaN(num)) return
    onSubmit({ dayNumber: num, date: formatDayDate(selectedDate) })
  }

  const handleSelectDate = (d: Date | undefined) => {
    if (!d) return
    setSelectedDate(d)
    setDatePickerOpen(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-2">
        <Label htmlFor="day-number">Day number *</Label>
        <Input
          id="day-number"
          type="number"
          value={dayNumber}
          onChange={(e) => setDayNumber(e.target.value)}
          placeholder="1"
        />
      </div>
      <div className="grid gap-2">
        <Label>Date *</Label>
        <Button
          type="button"
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !selectedDate && "text-muted-foreground"
          )}
          onClick={() => setDatePickerOpen((open) => !open)}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {selectedDate ? formatDayDate(selectedDate) : "Pick a date"}
        </Button>
        {datePickerOpen && (
          <div
            className="rounded-md border bg-background p-2 shadow-sm"
            data-date-picker-inline
          >
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(selected) => {
                if (selected !== undefined) {
                  setSelectedDate(selected)
                  setDatePickerOpen(false)
                }
              }}
            />
          </div>
        )}
      </div>
      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Add day
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

function AddScreenForm({
  initial = "",
  onSubmit,
  onCancel,
  submitting,
}: {
  initial?: string
  onSubmit: (name: string) => void
  onCancel: () => void
  submitting: boolean
}) {
  const [name, setName] = useState(initial)
  useEffect(() => {
    setName(initial)
  }, [initial])
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit(name.trim())
  }
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-2">
        <Label htmlFor="screen-name">Screen name *</Label>
        <Input
          id="screen-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Amphitheatre"
        />
      </div>
      <div className="flex gap-2 pt-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Save
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}

function ScheduleTableView({ day }: { day: SessionPlanDay }) {
  const screens = day.screens || []
  const maxSlots = Math.max(
    ...screens.map((s) => (s.slots || []).length),
    0
  )
  return (
    <Card>
      <CardContent className="p-0 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {screens.map((s) => (
                <th
                  key={idOfScreen(s)}
                  className="border-b border-r last:border-r-0 p-3 text-left text-sm font-semibold bg-muted/50 min-w-[220px]"
                >
                  {s.screenName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: maxSlots }).map((_, rowIdx) => (
              <tr key={rowIdx}>
                {screens.map((s) => {
                  const slot = (s.slots || [])[rowIdx]
                  if (!slot)
                    return (
                      <td
                        key={idOfScreen(s)}
                        className="border-b border-r last:border-r-0 p-2 min-w-[220px]"
                      />
                    )
                  const catName =
                    typeof slot.category === "string"
                      ? slot.category
                      : (slot.category as any)?.name ?? ""
                  return (
                    <td
                      key={idOfSlot(slot)}
                      className="border-b border-r last:border-r-0 p-2 align-top min-w-[220px]"
                    >
                      <div className="rounded-md border p-3 text-sm">
                        <div className="text-xs text-muted-foreground font-mono mb-1">
                          {slot.startTime}
                          {slot.endTime ? ` – ${slot.endTime}` : ""}
                        </div>
                        <div className="font-semibold mb-1">{slot.title}</div>
                        {slot.director && (
                          <div className="text-xs text-muted-foreground">
                            {slot.director}
                          </div>
                        )}
                        {slot.moderator && (
                          <div className="text-xs text-muted-foreground">
                            Moderator: {slot.moderator}
                          </div>
                        )}
                        {slot.duration && (
                          <div className="text-xs text-muted-foreground">
                            {slot.duration}
                          </div>
                        )}
                        {catName && (
                          <Badge variant="secondary" className="mt-2 text-xs">
                            {catName}
                          </Badge>
                        )}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
        {maxSlots === 0 && (
          <div className="p-8 text-center text-muted-foreground text-sm">
            No slots for this day.
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function AdminGridView({
  day,
  onAddScreen,
  onRenameScreen,
  onDeleteScreen,
  onAddSlot,
  onEditSlot,
  onDeleteSlot,
  onDeleteDay,
}: {
  day: SessionPlanDay
  onAddScreen: () => void
  onRenameScreen: (screenId: string, current: string) => void
  onDeleteScreen: (screenId: string) => void
  onAddSlot: (screenId: string) => void
  onEditSlot: (slot: SessionPlanSlot) => void
  onDeleteSlot: (screenId: string, slotId: string) => void
  onDeleteDay: () => void
}) {
  const screens = day.screens || []
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button onClick={onAddScreen}>
          <Plus className="mr-2 h-4 w-4" />
          Add screen
        </Button>
        <Button variant="destructive" size="sm" onClick={onDeleteDay}>
          <Trash2 className="mr-2 h-4 w-4" />
          Delete day
        </Button>
      </div>
      <div
        className="grid gap-4"
        style={{
          gridTemplateColumns: `repeat(${Math.max(screens.length, 1)}, minmax(260px, 1fr))`,
        }}
      >
        {screens.map((screen) => (
          <Card key={idOfScreen(screen)} className="flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {screen.screenName}
              </CardTitle>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() =>
                    onRenameScreen(idOfScreen(screen), screen.screenName)
                  }
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => onDeleteScreen(idOfScreen(screen))}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-2">
                {(screen.slots || []).map((slot) => {
                  const catName =
                    typeof slot.category === "string"
                      ? slot.category
                      : (slot.category as any)?.name ?? ""
                  return (
                    <div
                      key={idOfSlot(slot)}
                      className="rounded-md border p-3 flex items-start justify-between gap-2"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="text-xs text-muted-foreground font-mono">
                          {slot.startTime}
                          {slot.endTime ? ` – ${slot.endTime}` : ""}
                        </div>
                        <div className="font-medium text-sm">{slot.title}</div>
                        {slot.director && (
                          <div className="text-xs text-muted-foreground">
                            {slot.director}
                          </div>
                        )}
                        {catName && (
                          <Badge variant="secondary" className="mt-1 text-xs">
                            {catName}
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            onEditSlot({
                              ...slot,
                              screenId: idOfScreen(screen),
                            } as SessionPlanSlot)
                          }
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() =>
                            onDeleteSlot(
                              idOfScreen(screen),
                              idOfSlot(slot)
                            )
                          }
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )
                })}
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full border-dashed"
                  onClick={() => onAddSlot(idOfScreen(screen))}
                >
                  <Plus className="h-4 w-4" />
                  Add slot
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {screens.length === 0 && (
          <Card className="col-span-full">
            <CardContent className="py-8 text-center text-muted-foreground">
              No screens yet. Click &quot;Add screen&quot; to start.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
