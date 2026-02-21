"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/custom-toast"
import { createPlan } from "@/services/sessionPlanService"
import { ArrowLeft, Loader2 } from "lucide-react"

export default function CreateSessionPlanPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [year, setYear] = useState(() => new Date().getFullYear())
  const [festival, setFestival] = useState("")
  const [isVisible, setIsVisible] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!festival.trim()) {
      showToast("Festival name is required", "error")
      return
    }
    setSubmitting(true)
    try {
      const data = await createPlan({
        year: Number(year) || new Date().getFullYear(),
        festival: festival.trim(),
        isVisible,
      })
      const planId = data.id ?? data._id
      showToast("Session plan created", "success")
      router.push(`/admin/dashboard/session-plans/${planId}`)
    } catch (err: any) {
      showToast(err?.message || "Failed to create plan", "error")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-3 pt-0 sm:gap-6 sm:p-6 max-w-2xl">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/dashboard/session-plans">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Create Session Plan</h1>
          <p className="text-sm text-muted-foreground">Add a new festival session plan</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New plan</CardTitle>
          <CardDescription>Year, festival name, and visibility</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="year">Year *</Label>
              <Input
                id="year"
                type="number"
                value={year}
                onChange={(e) => setYear(Number(e.target.value) || new Date().getFullYear())}
                placeholder="2024"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="festival">Festival name *</Label>
              <Input
                id="festival"
                value={festival}
                onChange={(e) => setFestival(e.target.value)}
                placeholder="e.g. 9th Annual Arunachal Film Festival"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isVisible"
                checked={isVisible}
                onChange={(e) => setIsVisible(e.target.checked)}
                className="rounded border-input"
              />
              <Label htmlFor="isVisible" className="font-normal cursor-pointer">
                Make visible on public schedule immediately
              </Label>
            </div>
            <div className="flex gap-2 pt-2 border-t">
              <Button type="submit" disabled={submitting}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Create plan
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/dashboard/session-plans">Cancel</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
