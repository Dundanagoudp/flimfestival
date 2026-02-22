"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/custom-toast"
import { getPdfs, uploadPdf, getPreviewUrl, updatePdf, deletePdf } from "@/services/pdfService"
import type { PdfItem } from "@/types/pdfTypes"
import { FileText, Loader2, Trash2, Upload, ExternalLink, Pencil } from "lucide-react"
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      dateStyle: "short",
      timeStyle: "short",
    })
  } catch {
    return iso
  }
}

export default function PdfsListPage() {
  const { showToast } = useToast()
  const [pdfs, setPdfs] = useState<PdfItem[]>([])
  const [loading, setLoading] = useState(true)
  const [uploadLoading, setUploadLoading] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [pdfToDelete, setPdfToDelete] = useState<PdfItem | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [name, setName] = useState("")
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [pdfToEdit, setPdfToEdit] = useState<PdfItem | null>(null)
  const [editName, setEditName] = useState("")
  const [editFile, setEditFile] = useState<File | null>(null)
  const [editLoading, setEditLoading] = useState(false)

  const fetchPdfs = async () => {
    setLoading(true)
    try {
      const data = await getPdfs()
      setPdfs(data)
    } catch (err: any) {
      showToast(err?.message || "Failed to load PDFs", "error")
      setPdfs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPdfs()
  }, [])

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      showToast("Please select a PDF file", "error")
      return
    }
    setUploadLoading(true)
    try {
      const formData = new FormData()
      formData.append("pdf", file)
      if (name.trim()) formData.append("name", name.trim())
      await uploadPdf(formData)
      showToast("PDF uploaded", "success")
      setFile(null)
      setName("")
      if (typeof document !== "undefined") {
        const fileInput = document.getElementById("pdf-file-input") as HTMLInputElement
        if (fileInput) fileInput.value = ""
      }
      fetchPdfs()
    } catch (err: any) {
      showToast(err?.message || "Upload failed", "error")
    } finally {
      setUploadLoading(false)
    }
  }

  const handlePreview = (item: PdfItem) => {
    try {
      const url = getPreviewUrl(item._id)
      window.open(url, "_blank", "noopener,noreferrer")
    } catch (err: any) {
      showToast(err?.message || "Could not open preview", "error")
    }
  }

  const handleEditClick = (item: PdfItem) => {
    setPdfToEdit(item)
    setEditName(item.name ?? "")
    setEditFile(null)
    setEditDialogOpen(true)
  }

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pdfToEdit) return
    const hasName = editName.trim().length > 0
    const hasFile = !!editFile
    if (!hasName && !hasFile) {
      showToast("Change name and/or select a new PDF file", "error")
      return
    }
    setEditLoading(true)
    try {
      const formData = new FormData()
      if (hasName) formData.append("name", editName.trim())
      if (hasFile) formData.append("pdf", editFile)
      await updatePdf(pdfToEdit._id, formData)
      showToast("PDF updated", "success")
      setEditDialogOpen(false)
      setPdfToEdit(null)
      setEditName("")
      setEditFile(null)
      if (typeof document !== "undefined") {
        const fileInput = document.getElementById("pdf-edit-file-input") as HTMLInputElement
        if (fileInput) fileInput.value = ""
      }
      fetchPdfs()
    } catch (err: any) {
      showToast(err?.message || "Update failed", "error")
    } finally {
      setEditLoading(false)
    }
  }

  const handleDeleteClick = (item: PdfItem) => {
    setPdfToDelete(item)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!pdfToDelete) return
    setActionLoading(pdfToDelete._id)
    try {
      await deletePdf(pdfToDelete._id)
      showToast("PDF deleted", "success")
      setDeleteDialogOpen(false)
      setPdfToDelete(null)
      fetchPdfs()
    } catch (err: any) {
      showToast(err?.message || "Failed to delete", "error")
    } finally {
      setActionLoading(null)
    }
  }

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
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">PDF Upload</h1>
        <p className="text-sm text-muted-foreground">
          Upload and manage PDFs (session plans, brochures, etc.)
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm sm:text-base">Upload PDF</CardTitle>
          <CardDescription>Select a PDF file and optionally set a display name.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpload} className="flex flex-col gap-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="pdf-file-input">PDF file (required)</Label>
              <Input
                id="pdf-file-input"
                type="file"
                accept=".pdf"
                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pdf-name">Name (optional)</Label>
              <Input
                id="pdf-name"
                type="text"
                placeholder="e.g. Festival Schedule 2025"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={uploadLoading || !file}>
              {uploadLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              Upload
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm sm:text-base">All PDFs</CardTitle>
          <CardDescription>
            {pdfs.length} PDF{pdfs.length !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pdfs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No PDFs yet. Upload one above.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Name
                    </th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Date
                    </th>
                    <th className="text-right py-3 px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pdfs.map((item) => {
                    const busy = actionLoading === item._id
                    return (
                      <tr key={item._id} className="border-b last:border-0 hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">
                          {item.name || item.pdfUrl?.split("/").pop() || item._id}
                        </td>
                        <td className="py-3 px-4 text-muted-foreground text-sm">
                          {formatDate(item.updatedAt)}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handlePreview(item)}
                            >
                              <ExternalLink className="mr-1 h-4 w-4" />
                              Preview
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditClick(item)}
                              disabled={busy}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteClick(item)}
                              disabled={busy}
                            >
                              {busy ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
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

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit PDF</DialogTitle>
            <DialogDescription>
              Update the display name and/or replace the PDF file. At least one change is required.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="flex flex-col gap-4">
            <div className="space-y-2">
              <Label htmlFor="pdf-edit-name">Name</Label>
              <Input
                id="pdf-edit-name"
                type="text"
                placeholder="e.g. Festival Schedule 2025"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pdf-edit-file-input">Replace PDF (optional)</Label>
              <Input
                id="pdf-edit-file-input"
                type="file"
                accept=".pdf"
                onChange={(e) => setEditFile(e.target.files?.[0] ?? null)}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={editLoading || (!editName.trim() && !editFile)}>
                {editLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete PDF?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete &quot;{pdfToDelete?.name || pdfToDelete?.pdfUrl?.split("/").pop() || pdfToDelete?._id}&quot;. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
