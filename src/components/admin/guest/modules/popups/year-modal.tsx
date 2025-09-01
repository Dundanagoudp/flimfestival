"use client"

import { useEffect, useMemo, useState } from "react"
import { createYear, updateYear } from "@/services/guestService"
import type { Year } from "@/types/guestTypes"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/custom-toast"
import DynamicButton from "@/components/common/DynamicButton"

type Props = {
  open: boolean
  onClose: () => void
  initial?: Partial<Year> | null
  onSuccess?: () => void
}

export default function YearModal({ open, onClose, initial, onSuccess }: Props) {
  const isEdit = Boolean(initial?._id)
  const [value, setValue] = useState<string>("")
  const [name, setName] = useState<string>("")
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  useEffect(() => {
    setValue(initial?.value != null ? String(initial.value) : "")
    setName(initial?.name || "")
  }, [initial, open])

  const canSubmit = useMemo(() => {
    const num = Number(value)
    return !loading && !Number.isNaN(num) && value.trim().length > 0
  }, [value, loading])

  async function handleSubmit() {
    try {
      setLoading(true)
      const payload = { value: Number(value), name: name || undefined }
      if (isEdit && initial?._id) {
        await updateYear(initial._id, payload)
        showToast("Year updated successfully", "success")
      } else {
        await createYear(payload)
        showToast("Year created successfully", "success")
      }
      onSuccess?.()
      onClose()
    } catch (e: any) {
      showToast(e?.message || "Failed to save year", "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => (!o ? onClose() : undefined)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Update Year" : "Create Year"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="value">Value</Label>
            <Input
              id="value"
              type="number"
              min={1900}
              max={3000}
              value={value}
              onChange={(e) => setValue(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="name">Name (optional)</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <DynamicButton 
            onClick={handleSubmit} 
            disabled={!canSubmit}
            loading={loading}
            loadingText="Saving..."
            variant="success"
          >
            {isEdit ? "Update" : "Create"}
          </DynamicButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
