"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/custom-toast"
import {
  AboutBanner,
  AboutIntroduction,
  AboutStatistics,
} from "@/types/aboutTypes"
import {
  getAboutBanner,
  getAboutStatistics,
  getAboutIntroduction,
  deleteAboutBanner,
  deleteAboutStatistics,
  deleteAboutIntroduction,
} from "@/services/aboutServices"
import { Image as ImageIcon, BarChart3, FileText, Loader2, Plus, Pencil, Trash2 } from "lucide-react"
import { BannerModal } from "./modules/popups/banner-modal"
import { StatisticsModal } from "./modules/popups/statistics-modal"
import { IntroductionModal } from "./modules/popups/introduction-modal"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import DynamicButton from "@/components/common/DynamicButton"

type TabKey = "banner" | "statistics" | "introduction"

export default function AboutUsAdminPage() {
  const [active, setActive] = useState<TabKey>("banner")
  const [loading, setLoading] = useState(true)
  const [banner, setBanner] = useState<AboutBanner | null>(null)
  const [stats, setStats] = useState<AboutStatistics | null>(null)
  const [intro, setIntro] = useState<AboutIntroduction | null>(null)

  const [bannerModalOpen, setBannerModalOpen] = useState(false)
  const [statsModalOpen, setStatsModalOpen] = useState(false)
  const [introModalOpen, setIntroModalOpen] = useState(false)

  const [confirmOpen, setConfirmOpen] = useState<null | { type: "banner" | "statistics" | "introduction"; id: string }>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const { showToast } = useToast()

  const fetchAll = async () => {
    setLoading(true)
    try {
      const [b, s, i] = await Promise.allSettled([
        getAboutBanner(),
        getAboutStatistics(),
        getAboutIntroduction(),
      ])

      setBanner(b.status === "fulfilled" ? (b.value as any) : null)
      setStats(s.status === "fulfilled" ? (s.value as any) : null)
      setIntro(i.status === "fulfilled" ? (i.value as any) : null)
    } catch (e: any) {
      showToast(e?.message ?? "Failed to load about-us data", "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAll()
  }, [])

  const handleDelete = async () => {
    if (!confirmOpen) return
    setIsDeleting(true)
    try {
      if (confirmOpen.type === "banner") {
        await deleteAboutBanner(confirmOpen.id)
        setBanner(null)
      } else if (confirmOpen.type === "statistics") {
        await deleteAboutStatistics(confirmOpen.id)
        setStats(null)
      } else {
        await deleteAboutIntroduction(confirmOpen.id)
        setIntro(null)
      }
      showToast("Deleted successfully", "success")
      setConfirmOpen(null)
    } catch (e: any) {
      showToast(e?.message ?? "Delete failed", "error")
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">About Us</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <Button variant={active === "banner" ? "default" : "outline"} onClick={() => setActive("banner")}>Banner</Button>
        <Button variant={active === "statistics" ? "default" : "outline"} onClick={() => setActive("statistics")}>Statistics</Button>
        <Button variant={active === "introduction" ? "default" : "outline"} onClick={() => setActive("introduction")}>Introduction</Button>
      </div>

      {active === "banner" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><ImageIcon className="h-5 w-5"/> Banner</CardTitle>
            <CardDescription>Create or update the about page banner.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {banner ? (
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                <div className="w-full sm:w-80 h-40 rounded-md overflow-hidden bg-muted">
                  <img src={banner.backgroundImage} alt={banner.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-2">
                  <h3 className="text-lg font-semibold">{banner.title}</h3>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => setBannerModalOpen(true)}><Pencil className="mr-2 h-4 w-4"/>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => setConfirmOpen({ type: "banner", id: (banner.id || (banner as any)._id)! })}><Trash2 className="mr-2 h-4 w-4"/>Delete</Button>
                  </div>
                </div>
              </div>
            ) : (
              <Button onClick={() => setBannerModalOpen(true)}><Plus className="mr-2 h-4 w-4"/>Add Banner</Button>
            )}
          </CardContent>
        </Card>
      )}

      {active === "statistics" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5"/> Statistics</CardTitle>
            <CardDescription>Years, Films and Countries shown on about page.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {stats ? (
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <Badge variant="secondary">Years: {stats.years}</Badge>
                  <Badge variant="secondary">Films: {stats.films}</Badge>
                  <Badge variant="secondary">Countries: {stats.countries}</Badge>
                </div>
                {stats.image && (
                  <div className="w-full sm:w-[520px] h-40 rounded-md overflow-hidden bg-muted">
                    <img src={stats.image} alt="statistics" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => setStatsModalOpen(true)}><Pencil className="mr-2 h-4 w-4"/>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => setConfirmOpen({ type: "statistics", id: (stats.id || (stats as any)._id)! })}><Trash2 className="mr-2 h-4 w-4"/>Delete</Button>
                </div>
              </div>
            ) : (
              <Button onClick={() => setStatsModalOpen(true)}><Plus className="mr-2 h-4 w-4"/>Add Statistics</Button>
            )}
          </CardContent>
        </Card>
      )}

      {active === "introduction" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5"/> Introduction</CardTitle>
            <CardDescription>Heading and description for the about page.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {intro ? (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">{intro.title}</h3>
                <p className="text-muted-foreground max-w-2xl">{intro.description}</p>
                {intro.image && (
                  <div className="w-full sm:w-[520px] h-40 rounded-md overflow-hidden bg-muted">
                    <img src={intro.image} alt="introduction" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => setIntroModalOpen(true)}><Pencil className="mr-2 h-4 w-4"/>Edit</Button>
                  <Button size="sm" variant="destructive" onClick={() => setConfirmOpen({ type: "introduction", id: (intro.id || (intro as any)._id)! })}><Trash2 className="mr-2 h-4 w-4"/>Delete</Button>
                </div>
              </div>
            ) : (
              <Button onClick={() => setIntroModalOpen(true)}><Plus className="mr-2 h-4 w-4"/>Add Introduction</Button>
            )}
          </CardContent>
        </Card>
      )}

      <BannerModal
        open={bannerModalOpen}
        onOpenChange={setBannerModalOpen}
        initialData={banner || undefined}
        onSuccess={(b) => { setBanner(b as any); setActive("banner") }}
      />

      <StatisticsModal
        open={statsModalOpen}
        onOpenChange={setStatsModalOpen}
        initialData={stats || undefined}
        onSuccess={(s) => { setStats(s as any); setActive("statistics") }}
      />

      <IntroductionModal
        open={introModalOpen}
        onOpenChange={setIntroModalOpen}
        initialData={intro || undefined}
        onSuccess={(i) => { setIntro(i as any); setActive("introduction") }}
      />

      <Dialog open={!!confirmOpen} onOpenChange={() => !isDeleting && setConfirmOpen(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete {confirmOpen?.type === "banner" ? "Banner" : confirmOpen?.type === "statistics" ? "Statistics" : "Introduction"}?</DialogTitle>
            <DialogDescription>This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(null)} disabled={isDeleting}>Cancel</Button>
            <DynamicButton loading={isDeleting} onClick={handleDelete} variant="destructive">Delete</DynamicButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


