"use client"

import { useState, useRef, ChangeEvent, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Loader2, X, Trophy } from "lucide-react"
import { createAward, getAllAwardCategories } from "@/services/awardService"
import { AwardCategory } from "@/types/awardTypes"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useToast } from "@/components/ui/custom-toast"
import DynamicButton from "@/components/common/DynamicButton"

// Form validation schema
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  rule1: z.string().min(1, "Rule 1 is required"),
  rule2: z.string().min(1, "Rule 2 is required"),
  rule3: z.string().min(1, "Rule 3 is required"),
  image: z.instanceof(File, { message: "Main image is required" }),
  array_images: z.array(z.instanceof(File)).min(1, "At least one additional image is required"),
})

type FormValues = z.infer<typeof formSchema>

export default function AddAwardPage() {
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [previewArrayImages, setPreviewArrayImages] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const arrayImagesInputRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<AwardCategory[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { showToast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      rule1: "",
      rule2: "",
      rule3: "",
      array_images: [],
    },
    mode: "onChange",
  })

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true)
      try {
        const categoriesData = await getAllAwardCategories()
        setCategories(categoriesData)
      } catch (error: any) {
        showToast(error.message || "Failed to fetch categories", "error")
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [showToast])

  const handleMainImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      form.setValue("image", file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleArrayImagesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length > 0) {
      form.setValue("array_images", files)
      
      // Create previews for all selected images
      const newPreviews: string[] = []
      files.forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          newPreviews.push(reader.result as string)
          if (newPreviews.length === files.length) {
            setPreviewArrayImages(newPreviews)
          }
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeArrayImage = (index: number) => {
    const currentImages = form.getValues("array_images")
    const newImages = currentImages.filter((_, i) => i !== index)
    form.setValue("array_images", newImages)
    
    const newPreviews = previewArrayImages.filter((_, i) => i !== index)
    setPreviewArrayImages(newPreviews)
  }

  const triggerMainImageInput = () => {
    fileInputRef.current?.click()
  }

  const triggerArrayImagesInput = () => {
    arrayImagesInputRef.current?.click()
  }

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true)
    try {
      await createAward(values)
      showToast("Award created successfully!", "success")
      router.push("/admin/dashboard/award")
    } catch (error: any) {
      showToast(error.message || "Failed to create award", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
      <Card className="w-full">
        <CardHeader>
          <div className="flex items-center justify-between mb-6">
            <div>
              <CardTitle className="text-2xl font-bold">
                Create New Award
              </CardTitle>
              <CardDescription>
                Add new awards with rules, descriptions, and images.
              </CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/admin/dashboard/award/categories">
                <Trophy className="mr-2 h-4 w-4" />
                Manage Categories
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span>Loading categories...</span>
                        </div>
                      ) : (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem
                                key={category._id}
                                value={category._id}
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter award title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter award description..."
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="rule1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rule 1</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter rule 1..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rule2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rule 2</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter rule 2..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="rule3"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rule 3</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Enter rule 3..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label>Main Image</Label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleMainImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <DynamicButton 
                    type="button"
                    variant="outline"
                    onClick={triggerMainImageInput}
                  >
                    Upload Main Image
                  </DynamicButton>
                  {previewImage && (
                    <div className="w-20 h-20 rounded-md overflow-hidden border">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Upload the main image for this award
                </p>
              </div>

              <div className="space-y-2">
                <Label>Additional Images</Label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    ref={arrayImagesInputRef}
                    onChange={handleArrayImagesChange}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                  <DynamicButton 
                    type="button"
                    variant="outline"
                    onClick={triggerArrayImagesInput}
                  >
                    Upload Additional Images
                  </DynamicButton>
                </div>
                {previewArrayImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
                    {previewArrayImages.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-20 object-cover rounded-md border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                          onClick={() => removeArrayImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-sm text-muted-foreground">
                  Upload additional images for this award (at least one required)
                </p>
              </div>

              <div className="flex gap-4">
                <DynamicButton 
                  type="submit" 
                  loading={isSubmitting}
                  loadingText="Creating..."
                  className="w-full sm:w-auto"
                >
                  Create Award
                </DynamicButton>
                <DynamicButton 
                  type="button" 
                  variant="outline"
                  onClick={() => router.push("/admin/dashboard/award")}
                >
                  Cancel
                </DynamicButton>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
