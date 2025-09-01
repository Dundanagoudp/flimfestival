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
    <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-2xl font-bold mb-6">
            Create New Blog
          </CardTitle>
          <CardDescription>
            Add new blog posts, articles, or external links.
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
                name="contentType"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Content Type</FormLabel>
                    <FormControl>
                      <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-2">
                          <input
                            type="radio"
                            id="blog"
                            value="blog"
                            checked={field.value === "blog"}
                            onChange={(e) => field.onChange(e.target.value)}
                            className="h-4 w-4"
                          />
                          <Label htmlFor="blog">Blog Post</Label>
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
                          <Label htmlFor="link">External Link</Label>
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
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter title" {...field} />
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
                    <FormLabel>Author</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter author name" {...field} />
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
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write your blog content here..."
                          className="min-h-[200px]"
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
                      <FormLabel>Link URL</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://example.com"
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
                    <FormLabel>Published Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        className="w-[240px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <Label>Featured Image</Label>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={triggerFileInput}
                  >
                    Upload Image
                  </Button>
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
                  Upload a featured image for your post
                </p>
              </div>

              <div className="flex gap-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="w-full sm:w-auto"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> 
                      Creating...
                    </>
                  ) : (
                    "Create Blog"
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => {
                    const isValid = form.trigger();
                    console.log("Form validation result:", isValid);
                    console.log("Current form values:", form.getValues());
                    console.log("Form errors:", form.formState.errors);
                  }}
                >
                  Test Validation
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => router.push("/admin/dashboard/blog")}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
