"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import DynamicButton from "@/components/common/DynamicButton"
import { useToast } from "@/components/ui/custom-toast"
import { AboutIntroduction } from "@/types/aboutTypes"
import { createAboutIntroduction, updateAboutIntroduction } from "@/services/aboutServices"

export function IntroductionModal({ open, onOpenChange, initialData, onSuccess }: { open: boolean; onOpenChange: (o: boolean) => void; initialData?: AboutIntroduction; onSuccess: (i: AboutIntroduction) => void }) {
  const { showToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [values, setValues] = useState({ title: "", description: "" })
  const [file, setFile] = useState<File | undefined>(undefined)

  useEffect(() => {
    setValues({ title: initialData?.title || "", description: initialData?.description || "" })
    setFile(undefined)
  }, [initialData])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (initialData && (initialData._id || (initialData as any).id)) {
        const res = await updateAboutIntroduction(String(initialData._id || (initialData as any).id), { title: values.title, description: values.description, image: file })
        onSuccess(res as any)
        showToast("Introduction updated", "success")
      } else {
        const res = await createAboutIntroduction({ title: values.title, description: values.description, image: file })
        onSuccess(res as any)
        showToast("Introduction created", "success")
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
          <DialogTitle>{initialData ? "Edit Introduction" : "Add Introduction"}</DialogTitle>
          <DialogDescription>Title, description and optional image.</DialogDescription>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="text-sm">Title</label>
            <Input value={values.title} onChange={(e) => setValues(v => ({ ...v, title: e.target.value }))} disabled={loading} />
          </div>
          <div>
            <label className="text-sm">Description</label>
            <Textarea rows={4} value={values.description} onChange={(e) => setValues(v => ({ ...v, description: e.target.value }))} disabled={loading} />
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

