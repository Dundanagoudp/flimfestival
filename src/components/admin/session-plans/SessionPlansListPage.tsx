"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/custom-toast"
import { getPlans, updatePlan, deletePlan } from "@/services/sessionPlanService"
import type { SessionPlan } from "@/types/sessionPlanTypes"
import { CalendarDays, Loader2, Plus, Eye, EyeOff, Trash2, Edit } from "lucide-react"
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

function idOf(plan: SessionPlan) {
  return plan.id ?? plan._id
}

export default function SessionPlansListPage() {
  const router = useRouter()
  const { showToast } = useToast()
  const [plans, setPlans] = useState<SessionPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [visibleOnly, setVisibleOnly] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [planToDelete, setPlanToDelete] = useState<SessionPlan | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const fetchPlans = async () => {
    setLoading(true)
    try {
      const data = await getPlans(visibleOnly)
      setPlans(Array.isArray(data) ? data : [])
    } catch (err: any) {
      showToast(err?.message || "Failed to load plans", "error")
      setPlans([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlans()
  }, [visibleOnly])

  const handleOpen = (plan: SessionPlan) => {
    const pid = idOf(plan)
    router.push(`/admin/dashboard/session-plans/${pid}`)
  }

  const handleToggleVisible = async (plan: SessionPlan) => {
    const pid = idOf(plan)
    setActionLoading(pid)
    try {
      await updatePlan(pid, { isVisible: !plan.isVisible })
      showToast("Visibility updated", "success")
      fetchPlans()
    } catch (err: any) {
      showToast(err?.message || "Failed to update visibility", "error")
    } finally {
      setActionLoading(null)
    }
  }

  const handleDeleteClick = (plan: SessionPlan) => {
    setPlanToDelete(plan)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!planToDelete) return
    const pid = idOf(planToDelete)
    setActionLoading(pid)
    try {
      await deletePlan(pid)
      showToast("Plan deleted", "success")
      setDeleteDialogOpen(false)
      setPlanToDelete(null)
      fetchPlans()
    } catch (err: any) {
      showToast(err?.message || "Failed to delete plan", "error")
    } finally {
      setActionLoading(null)
    }
  }

  const totalDays = plans.reduce((acc, p) => acc + (p.days?.length ?? 0), 0)

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
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Session Plans</h1>
          <p className="text-sm text-muted-foreground">
            Manage festival session plans (days, screens, slots)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={visibleOnly ? "secondary" : "outline"}
            size="sm"
            onClick={() => setVisibleOnly(!visibleOnly)}
          >
            {visibleOnly ? <Eye className="mr-2 h-4 w-4" /> : <EyeOff className="mr-2 h-4 w-4" />}
            {visibleOnly ? "Visible only" : "All plans"}
          </Button>
          <Button asChild>
            <Link href="/admin/dashboard/session-plans/create">
              <Plus className="mr-2 h-4 w-4" />
              Create plan
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Plans</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{plans.length}</div>
            <p className="text-xs text-muted-foreground">Session plans</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Visible</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {plans.filter((p) => p.isVisible).length}
            </div>
            <p className="text-xs text-muted-foreground">Shown on public schedule</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Days</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDays}</div>
            <p className="text-xs text-muted-foreground">Across all plans</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm sm:text-base">All Plans</CardTitle>
          <CardDescription>
            {plans.length} plan{plans.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {plans.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <CalendarDays className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="mb-4">
                {visibleOnly ? "No visible plans." : "No session plans yet. Create your first one."}
              </p>
              {!visibleOnly && (
                <Button asChild>
                  <Link href="/admin/dashboard/session-plans/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Create plan
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Year
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Festival
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Days
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {plans.map((plan) => {
                    const pid = idOf(plan)
                    const busy = actionLoading === pid
                    return (
                      <tr key={pid} className="border-b last:border-0 hover:bg-muted/50">
                        <td className="py-3 px-4 font-mono font-semibold">{plan.year}</td>
                        <td className="py-3 px-4 font-medium">{plan.festival}</td>
                        <td className="py-3 px-4">
                          <Badge variant="secondary">{plan.days?.length ?? 0} days</Badge>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={plan.isVisible ? "default" : "outline"}>
                            {plan.isVisible ? "Visible" : "Hidden"}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleVisible(plan)}
                              disabled={busy}
                            >
                              {busy ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : plan.isVisible ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleOpen(plan)}
                              disabled={busy}
                            >
                              <Edit className="mr-1 h-4 w-4" />
                              Open
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteClick(plan)}
                              disabled={busy}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete session plan?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete &quot;{planToDelete?.festival}&quot; and all its days, screens, and
              slots. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
