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
import { updateAwardCategory } from "@/services/awardService"
import { AwardCategory } from "@/types/awardTypes"
import { useToast } from "@/components/ui/custom-toast"
import DynamicButton from "@/components/common/DynamicButton"

const formSchema = z.object({
  name: z.string().min(1, "Category name is required").min(2, "Category name must be at least 2 characters"),
})

type FormValues = z.infer<typeof formSchema>

interface EditCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  category: AwardCategory | null
  onSuccess: (category: AwardCategory) => void
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

  // Update form when category changes
  useEffect(() => {
    if (category) {
      form.setValue("name", category.name)
    }
  }, [category, form])

  const onSubmit = async (values: FormValues) => {
    if (!category) return
    
    setIsSubmitting(true)
    try {
      const updatedCategory = await updateAwardCategory(category._id, values)
      onSuccess(updatedCategory)
      form.reset()
    } catch (error: any) {
      showToast(error.message || "Failed to update category", "error")
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
            Update the category name for "{category.name}".
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm sm:text-base">Category Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Enter category name..." 
                      {...field} 
                      disabled={isSubmitting}
                      className="text-sm sm:text-base"
                    />
                  </FormControl>
                  <FormMessage />
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
