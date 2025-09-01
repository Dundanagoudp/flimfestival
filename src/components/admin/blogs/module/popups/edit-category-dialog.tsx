"use client"

import { useState, useEffect } from "react"
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
import { useToast } from "@/components/ui/custom-toast"
import { updateCategory } from "@/services/blogsServices"
import { BlogCategory } from "@/types/blogsTypes"
import { Loader2 } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Category name must be at least 2 characters.",
  }),
})

type FormValues = z.infer<typeof formSchema>

interface EditCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: BlogCategory | null
  onSuccess: () => void
}

export function EditCategoryDialog({ open, onOpenChange, category, onSuccess }: EditCategoryDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { showToast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  })

  useEffect(() => {
    if (category && open) {
      form.reset({
        name: category.name,
      })
    }
  }, [category, open, form])

  const onSubmit = async (values: FormValues) => {
    if (!category) return

    setIsSubmitting(true)
    try {
      await updateCategory(category._id, values)
      showToast("Category updated successfully!", "success")
      onSuccess()
      onOpenChange(false)
    } catch (error: any) {
      showToast(error.message || "Failed to update category", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      form.reset()
    }
    onOpenChange(open)
  }

  if (!category) return null

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogDescription>
            Update the category name. This will affect all blog posts in this category.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter category name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => handleOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Category"
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
