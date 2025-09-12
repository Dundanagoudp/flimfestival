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
import { Loader2 } from "lucide-react"
import { createBlog, getAllCategories } from "@/services/blogsServices"
import { BlogCategory } from "@/types/blogsTypes"
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
import { useToast } from "@/components/ui/custom-toast"
import DynamicButton from "@/components/common/DynamicButton"

// Form validation schema
const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  contentType: z.enum(["blog", "link"]),
  category: z.string().min(1, "Category is required"),
  contents: z.string().optional(),
  link: z.string().optional(),
  author: z.string().min(1, "Author is required"),
  publishedDate: z.string().min(1, "Published date is required"),
  image: z.instanceof(File, { message: "Featured image is required" }),
}).refine((data) => {
  if (data.contentType === "blog") {
    return data.contents && data.contents.trim().length > 0;
  }
  if (data.contentType === "link") {
    return data.link && data.link.trim().length > 0;
  }
  return false;
}, {
  message: "Content is required for blog posts, Link URL is required for link posts",
  path: ["contentType"]
});

type FormValues = z.infer<typeof formSchema>

export default function AddBlogPage() {
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { showToast } = useToast()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      contentType: "blog",
      category: "",
      contents: "",
      link: "",
      author: "",
      publishedDate: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
    },
    mode: "onChange", // Enable real-time validation
  })

  const contentType = form.watch("contentType")

  // Debug form state
  useEffect(() => {
    console.log("Form state:", form.getValues());
    console.log("Form errors:", form.formState.errors);
  }, [form.formState.errors]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true)
      try {
        const categoriesData = await getAllCategories()
        setCategories(categoriesData)
      } catch (error: any) {
        showToast(error.message || "Failed to fetch categories", "error")
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [showToast])

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
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

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true)
    try {
      console.log("Form values:", values); // Debug log
      
      const payload = {
        title: values.title,
        contentType: values.contentType,
        category: values.category,
        contents: values.contents || "",
        link: values.link || "",
        author: values.author,
        publishedDate: values.publishedDate,
        image: values.image,
      }

      console.log("Payload being sent:", payload); // Debug log
      
      await createBlog(payload)
      showToast("Blog created successfully!", "success")
      router.push("/admin/dashboard/blog")
    } catch (error: any) {
      console.error("Error creating blog:", error); // Debug log
      showToast(error.message || "Failed to create blog", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-3 pt-0 sm:gap-6 sm:p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
            Create New Blog
          </CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Add new blog posts, articles, or external links.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 sm:space-y-6"
            >
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Category</FormLabel>
                    <FormControl>
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm sm:text-base">Loading categories...</span>
                        </div>
                      ) : (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="text-sm sm:text-base">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem
                                key={category._id}
                                value={category._id}
                                className="text-sm sm:text-base"
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
                name="contentType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-sm sm:text-base">Content Type</FormLabel>
                    <FormControl>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-6">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="blog"
                            value="blog"
                            checked={field.value === "blog"}
                            onChange={(e) => field.onChange(e.target.value)}
                            className="h-4 w-4"
                          />
                          <Label htmlFor="blog" className="text-sm sm:text-base">Blog Post</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="link"
                            value="link"
                            checked={field.value === "link"}
                            onChange={(e) => field.onChange(e.target.value)}
                            className="h-4 w-4"
                          />
                          <Label htmlFor="link" className="text-sm sm:text-base">External Link</Label>
                        </div>
                      </div>
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
                    <FormLabel className="text-sm sm:text-base">Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter title" {...field} className="text-sm sm:text-base" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm sm:text-base">Author</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter author name" {...field} className="text-sm sm:text-base" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {contentType === "blog" ? (
                <FormField
                  control={form.control}
                  name="contents"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write your blog content here..."
                          className="min-h-[150px] sm:min-h-[200px] text-sm sm:text-base"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="link"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm sm:text-base">Link URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com"
                          className="text-sm sm:text-base"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="publishedDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-sm sm:text-base">Published Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        className="w-full sm:w-[240px] text-sm sm:text-base"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <Label className="text-sm sm:text-base">Featured Image</Label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <DynamicButton 
                    type="button"
                    variant="outline"
                    onClick={triggerFileInput}
                    className="w-full sm:w-auto"
                  >
                    Upload Image
                  </DynamicButton>
                  {previewImage && (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden border">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Upload a featured image for your post
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <DynamicButton 
                  type="submit" 
                  loading={isSubmitting}
                  loadingText="Creating..."
                  className="w-full sm:w-auto"
                >
                  Create Blog
                </DynamicButton>
                <DynamicButton 
                  type="button" 
                  variant="outline"
                  onClick={() => router.push("/admin/dashboard/blog")}
                  className="w-full sm:w-auto"
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
