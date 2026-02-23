"use client"

import { useState, useEffect } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { updateCategory } from "@/services/curatedService"
import { useToast } from "@/components/ui/custom-toast"
import DynamicButton from "@/components/common/DynamicButton"
import type { CuratedCategory } from "@/types/curatedTypes"

const formSchema = z.object({
  name: z.string().min(1, "Category name is required").min(2, "Category name must be at least 2 characters"),
  slug: z.string().optional(),
  order: z.coerce.number().optional(),
  public: z.boolean().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface EditCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: CuratedCategory | null
  onSuccess: (category: CuratedCategory) => void
}

export function EditCategoryDialog({ open, onOpenChange, category, onSuccess }: EditCategoryDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { showToast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as Resolver<FormValues>,
    defaultValues: {
      name: "",
      slug: "",
      order: 0,
      public: true,
    },
  })

  useEffect(() => {
    if (category) {
      form.setValue("name", category.name)
      form.setValue("slug", category.slug ?? "")
      form.setValue("order", category.order ?? 0)
      form.setValue("public", category.public ?? true)
    }
  }, [category, form])

  const onSubmit = async (values: FormValues) => {
    if (!category) return
    setIsSubmitting(true)
    try {
      const updated = await updateCategory(category._id, {
        name: values.name,
        slug: values.slug || undefined,
        order: values.order ?? 0,
        public: values.public ?? true,
      })
      onSuccess(updated)
      form.reset()
    } catch (error: unknown) {
      const err = error as Error
      showToast(err.message || "Failed to update category", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      form.reset()
      onOpenChange(false)
    }
  }

  if (!category) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Edit Category</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Update &quot;{category.name}&quot;.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base">Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Category name" {...field} disabled={isSubmitting} className="text-sm sm:text-base" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base">Slug (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. country-focus-japan" {...field} disabled={isSubmitting} className="text-sm sm:text-base" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base">Order</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} disabled={isSubmitting} className="text-sm sm:text-base" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="public"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isSubmitting} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm sm:text-base">Public</FormLabel>
                  </div>
                </FormItem>
              )}
            />
            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isSubmitting}
                className="w-full sm:w-auto order-2 sm:order-1"
              >
                Cancel
              </Button>
              <DynamicButton
                type="submit"
                loading={isSubmitting}
                loadingText="Updating..."
                disabled={isSubmitting}
                className="w-full sm:w-auto order-1 sm:order-2"
              >
                Update Category
              </DynamicButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
