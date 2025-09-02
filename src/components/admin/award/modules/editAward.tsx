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
import { Loader2, X } from "lucide-react"
import { getAwardById, updateAward, getAllAwardCategories } from "@/services/awardService"
import { Award, AwardCategory } from "@/types/awardTypes"
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
import { useRouter, useParams } from "next/navigation"
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
  image: z.instanceof(File).optional(),
  array_images: z.array(z.instanceof(File)).optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function EditAwardPage() {
  const [award, setAward] = useState<Award | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [previewArrayImages, setPreviewArrayImages] = useState<string[]>([])
  const [existingImages, setExistingImages] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const arrayImagesInputRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<AwardCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [awardLoading, setAwardLoading] = useState(true)
  const router = useRouter()
  const params = useParams()
  const { showToast } = useToast()

  const awardId = params.id as string

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

  // Fetch award and categories on component mount
  useEffect(() => {
    const fetchData = async () => {
      if (!awardId) return
      
      setAwardLoading(true)
      try {
        const [awardData, categoriesData] = await Promise.all([
          getAwardById(awardId),
          getAllAwardCategories()
        ])
        
        setAward(awardData)
        setCategories(categoriesData)
        
        // Set form values
        form.setValue("title", awardData.title)
        form.setValue("description", awardData.description)
        form.setValue("category", typeof awardData.category === 'string' ? awardData.category : awardData.category._id)
        form.setValue("rule1", awardData.rule1)
        form.setValue("rule2", awardData.rule2)
        form.setValue("rule3", awardData.rule3)
        
        // Set existing images
        if (awardData.image) {
          setPreviewImage(awardData.image)
        }
        if (awardData.array_images && awardData.array_images.length > 0) {
          setExistingImages(awardData.array_images)
        }
        
      } catch (error: any) {
        showToast(error.message || "Failed to fetch data", "error")
        router.push("/admin/dashboard/award")
      } finally {
        setAwardLoading(false)
      }
    }

    fetchData()
  }, [awardId, form, showToast, router])

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
      const currentImages = form.getValues("array_images") || []
      form.setValue("array_images", [...currentImages, ...files])
      
      // Create previews for new images
      files.forEach((file) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreviewArrayImages(prev => [...prev, reader.result as string])
        }
        reader.readAsDataURL(file)
      })
    }
  }

  const removeArrayImage = (index: number, isExisting: boolean = false) => {
    if (isExisting) {
      const newExistingImages = existingImages.filter((_, i) => i !== index)
      setExistingImages(newExistingImages)
    } else {
      const currentImages = form.getValues("array_images") || []
      const newImages = currentImages.filter((_, i) => i !== index)
      form.setValue("array_images", newImages)
      
      const newPreviews = previewArrayImages.filter((_, i) => i !== index)
      setPreviewArrayImages(newPreviews)
    }
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
      const payload = {
        ...values,
        image: values.image,
        array_images: values.array_images || [],
      }
      
      await updateAward(awardId, payload)
      showToast("Award updated successfully!", "success")
      router.push("/admin/dashboard/award")
    } catch (error: any) {
      showToast(error.message || "Failed to update award", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (awardLoading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  if (!award) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold mb-2">Award not found</h3>
          <Button onClick={() => router.push("/admin/dashboard/award")}>
            Back to Awards
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold mb-6">
            Edit Award: {award.title}
          </CardTitle>
          <CardDescription>
            Update award information, rules, and images.
          </CardDescription>
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
                    {previewImage ? "Change Main Image" : "Upload Main Image"}
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
                  {previewImage ? "Current main image" : "Upload the main image for this award"}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Additional Images</Label>
                
                {/* Existing Images */}
                {existingImages.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Current Images:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {existingImages.map((imageUrl, index) => (
                        <div key={`existing-${index}`} className="relative">
                          <img
                            src={imageUrl}
                            alt={`Existing ${index + 1}`}
                            className="w-full h-20 object-cover rounded-md border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                            onClick={() => removeArrayImage(index, true)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* New Images */}
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
                    Add More Images
                  </DynamicButton>
                </div>

                {previewArrayImages.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">New Images:</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {previewArrayImages.map((preview, index) => (
                        <div key={`new-${index}`} className="relative">
                          <img
                            src={preview}
                            alt={`New ${index + 1}`}
                            className="w-full h-20 object-cover rounded-md border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full"
                            onClick={() => removeArrayImage(index, false)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <p className="text-sm text-muted-foreground">
                  Manage additional images for this award
                </p>
              </div>

              <div className="flex gap-4">
                <DynamicButton 
                  type="submit" 
                  loading={isSubmitting}
                  loadingText="Updating..."
                  className="w-full sm:w-auto"
                >
                  Update Award
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
