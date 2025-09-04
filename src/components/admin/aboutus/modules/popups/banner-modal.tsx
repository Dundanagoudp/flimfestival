"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import DynamicButton from "@/components/common/DynamicButton"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { AboutBanner } from "@/types/aboutTypes"
import { createAboutBanner, updateAboutBanner } from "@/services/aboutServices"
import { useToast } from "@/components/ui/custom-toast"

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  backgroundImage: z.instanceof(File).or(z.any().optional()),
})

type Values = z.infer<typeof schema>

export function BannerModal({ open, onOpenChange, initialData, onSuccess }: { open: boolean; onOpenChange: (o: boolean) => void; initialData?: AboutBanner; onSuccess: (b: AboutBanner) => void }) {
  const { showToast } = useToast()
  const [file, setFile] = useState<File | undefined>(undefined)
  const [loading, setLoading] = useState(false)

  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { title: initialData?.title || "" } })

  useEffect(() => {
    form.reset({ title: initialData?.title || "" })
    setFile(undefined)
  }, [initialData, form])

  const onSubmit = async (values: Values) => {
    setLoading(true)
    try {
      if (initialData && (initialData._id || (initialData as any).id)) {
        const res = await updateAboutBanner(String(initialData._id || (initialData as any).id), { title: values.title, backgroundImage: file })
        onSuccess(res as any)
        showToast("Banner updated", "success")
      } else {
        const res = await createAboutBanner({ title: values.title, backgroundImage: file as File })
        onSuccess(res as any)
        showToast("Banner created", "success")
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
          <DialogTitle>{initialData ? "Edit Banner" : "Add Banner"}</DialogTitle>
          <DialogDescription>Upload banner image and title.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField name="title" control={form.control} render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Title" disabled={loading} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />

            <div className="space-y-2">
              <FormLabel>Background Image</FormLabel>
              <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || undefined)} disabled={loading} />
              {initialData?.backgroundImage && (
                <img src={initialData.backgroundImage} alt="preview" className="h-24 rounded-md object-cover" />
              )}
            </div>

            <DialogFooter>
              <DynamicButton type="submit" loading={loading}>{initialData ? "Save Changes" : "Create"}</DynamicButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

