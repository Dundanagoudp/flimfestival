"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DynamicButton } from "@/components/common"

type Props = {
  title?: string
  description?: string
  open: boolean
  onOpenChange: (v: boolean) => void
  onConfirm: () => Promise<void> | void
  danger?: boolean
  confirmText?: string
}

export default function ConfirmDeleteModal({
  title = "Are you sure?",
  description = "This action cannot be undone.",
  open,
  onOpenChange,
  onConfirm,
  danger = true,
  confirmText = "Delete",
}: Props) {
  const [loading, setLoading] = React.useState(false)

  const handle = async () => {
    try {
      setLoading(true)
      await onConfirm()
      onOpenChange(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">{description}</p>
        <DialogFooter>
          <DynamicButton variant="secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </DynamicButton>
          <DynamicButton variant={danger ? "destructive" : "default"} onClick={handle} disabled={loading}>
            {loading ? "Working..." : confirmText}
          </DynamicButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
