"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
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
import { createCategory } from "@/services/curatedService"
import { useToast } from "@/components/ui/custom-toast"
import DynamicButton from "@/components/common/DynamicButton"
import type { CuratedCategory } from "@/types/curatedTypes"

const formSchema = z.object({
  name: z.string().min(1, "Category name is required").min(2, "Category name must be at least 2 characters"),
  subtitle: z.string().optional(),
  order: z.coerce.number().optional(),
  isVisible: z.boolean().optional(),
})

type FormValues = z.infer<typeof formSchema>

interface AddCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: (category: CuratedCategory) => void
}

export function AddCategoryDialog({ open, onOpenChange, onSuccess }: AddCategoryDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { showToast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      subtitle: "",
      order: 0,
      isVisible: true,
    },
  })

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true)
    try {
      const newCategory = await createCategory({
        name: values.name,
        subtitle: values.subtitle || undefined,
        order: values.order ?? 0,
        isVisible: values.isVisible ?? true,
      })
      onSuccess(newCategory)
      form.reset({ name: "", subtitle: "", order: 0, isVisible: true })
    } catch (error: unknown) {
      const err = error as Error
      showToast(err.message || "Failed to create category", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      form.reset({ name: "", subtitle: "", order: 0, isVisible: true })
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-[425px] mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Add Curated Category</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Create a new category for curated images.
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
                    <Input
                      placeholder="e.g. Country Focus — Japan"
                      {...field}
                      disabled={isSubmitting}
                      className="text-sm sm:text-base"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base">Subtitle (optional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. A curated selection..."
                      {...field}
                      disabled={isSubmitting}
                      className="text-sm sm:text-base"
                    />
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
              name="isVisible"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={isSubmitting} />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm sm:text-base">Visible to public</FormLabel>
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
                loadingText="Creating..."
                disabled={isSubmitting}
                className="w-full sm:w-auto order-1 sm:order-2"
              >
                Create Category
              </DynamicButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
