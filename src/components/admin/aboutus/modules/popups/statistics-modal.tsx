"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import DynamicButton from "@/components/common/DynamicButton"
import { useToast } from "@/components/ui/custom-toast"
import { AboutStatistics } from "@/types/aboutTypes"
import { createAboutStatistics, updateAboutStatistics } from "@/services/aboutServices"

export function StatisticsModal({ open, onOpenChange, initialData, onSuccess }: { open: boolean; onOpenChange: (o: boolean) => void; initialData?: AboutStatistics; onSuccess: (s: AboutStatistics) => void }) {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [values, setValues] = useState({ years: "", films: "", countries: "" })
  const [file, setFile] = useState<File | undefined>(undefined)

  useEffect(() => {
    setValues({ years: initialData?.years?.toString() || "", films: initialData?.films?.toString() || "", countries: initialData?.countries?.toString() || "" })
    setFile(undefined)
  }, [initialData])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (initialData && (initialData._id || (initialData as any).id)) {
        const res = await updateAboutStatistics(String(initialData._id || (initialData as any).id), { years: values.years, films: values.films, countries: values.countries, image: file })
        onSuccess(res as any)
        showToast("Statistics updated", "success")
      } else {
        const res = await createAboutStatistics({ years: values.years, films: values.films, countries: values.countries, image: file as File })
        onSuccess(res as any)
        showToast("Statistics created", "success")
      }
      onOpenChange(false)
    } catch (e: any) {
      showToast(e?.message ?? "Failed", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => !loading && onOpenChange(o)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Statistics" : "Add Statistics"}</DialogTitle>
          <DialogDescription>Set years, films and countries.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
            <div>
              <label className="text-sm">Years</label>
              <Input value={values.years} onChange={(e) => setValues(v => ({ ...v, years: e.target.value }))} type="number" min="0" disabled={loading} />
            </div>
            <div>
              <label className="text-sm">Films</label>
              <Input value={values.films} onChange={(e) => setValues(v => ({ ...v, films: e.target.value }))} type="number" min="0" disabled={loading} />
            </div>
            <div>
              <label className="text-sm">Countries</label>
              <Input value={values.countries} onChange={(e) => setValues(v => ({ ...v, countries: e.target.value }))} type="number" min="0" disabled={loading} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm">Image</label>
            <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || undefined)} disabled={loading} />
            {initialData?.image && <img src={initialData.image} alt="preview" className="h-24 rounded-md object-cover" />}
          </div>
          <DialogFooter>
            <DynamicButton type="submit" loading={loading}>{initialData ? "Save Changes" : "Create"}</DynamicButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

