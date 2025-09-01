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
import { 
  getSingleBlog, 
  updateBlog, 
  getAllCategories 
} from "@/services/blogsServices"
import { BlogPost, BlogCategory } from "@/types/blogsTypes"
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
  link: z.string().url().optional(),
  author: z.string().min(1, "Author is required"),
  publishedDate: z.string().min(1, "Published date is required"),
  image: z.instanceof(File).optional(),
})

type FormValues = z.infer<typeof formSchema>

interface EditBlogFormProps {
  blogId: string
}

export function EditBlogForm({ blogId }: EditBlogFormProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [existingImage, setExistingImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [blogLoading, setBlogLoading] = useState(true)
  const [blog, setBlog] = useState<BlogPost | null>(null)
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
      publishedDate: new Date().toISOString().split('T')[0],
    },
  })

  const contentType = form.watch("contentType")

  // Fetch blog data and categories
  useEffect(() => {
    const fetchData = async () => {
      if (!blogId) return

      setBlogLoading(true)
      try {
        // Fetch blog data
        const blogData = await getSingleBlog(blogId)
        setBlog(blogData)

        // Update form with existing data
        form.reset({
          title: blogData.title || "",
          contentType: blogData.contentType || "blog",
          category: typeof blogData.category === 'string' ? blogData.category : blogData.category._id,
          contents: blogData.contents || "",
          link: blogData.link || "",
          author: blogData.author || "",
          publishedDate: blogData.publishedDate ? new Date(blogData.publishedDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        })

        // Set existing image
        if (blogData.imageUrl) {
          setExistingImage(blogData.imageUrl)
        }

        // Fetch categories
        const categoriesData = await getAllCategories()
        setCategories(categoriesData)
      } catch (error: any) {
        showToast(error.message || "Failed to fetch blog data", "error")
      } finally {
        setBlogLoading(false)
      }
    }

    fetchData()
  }, [blogId, form, showToast])

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

  const handleRemoveImage = () => {
    setPreviewImage(null)
    form.setValue("image", undefined)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true)
    try {
      // Validate that either contents or link is provided based on contentType
      if (values.contentType === "blog" && !values.contents) {
        showToast("Content is required for blog posts", "error")
        return
      }
      if (values.contentType === "link" && !values.link) {
        showToast("Link URL is required for link posts", "error")
        return
      }

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

      await updateBlog(blogId, payload)
      showToast("Blog updated successfully!", "success")
      router.push("/admin/dashboard/blog")
    } catch (error: any) {
      showToast(error.message || "Failed to update blog", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (blogLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading blog data...</span>
        </div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Blog not found</h3>
          <p className="text-muted-foreground mb-4">The blog you're looking for doesn't exist.</p>
          <Button onClick={() => router.push("/admin/dashboard/blog")}>
            Back to Blogs
          </Button>
        </div>
      </div>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold mb-6">
          Edit Blog
        </CardTitle>
        <CardDescription>
          Update your blog post, article, or external link.
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
                  {blog.category && (
                    <div className="text-sm text-muted-foreground mb-2">
                      Current:{" "}
                      {typeof blog.category === 'string' 
                        ? categories.find(cat => cat._id === blog.category)?.name || "Unknown"
                        : blog.category.name
                      }
                    </div>
                  )}
                  <FormControl>
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
                  {blog.contentType && (
                    <div className="text-sm text-muted-foreground mb-2">
                      Current:{" "}
                      {blog.contentType === "blog" ? "📝 Blog Post" : "🔗 External Link"}
                    </div>
                  )}
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
                  {blog.title && (
                    <div className="text-sm text-muted-foreground mb-2">
                      Current: {blog.title}
                    </div>
                  )}
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
                  {blog.author && (
                    <div className="text-sm text-muted-foreground mb-2">
                      Current: {blog.author}
                    </div>
                  )}
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
                    {blog.contents && (
                      <div className="text-sm text-muted-foreground mb-2">
                        Current content: {blog.contents.substring(0, 100)}...
                      </div>
                    )}
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
                    {blog.link && (
                      <div className="text-sm text-muted-foreground mb-2">
                        Current: {blog.link}
                      </div>
                    )}
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
                  {blog.publishedDate && (
                    <div className="text-sm text-muted-foreground mb-2">
                      Current: {new Date(blog.publishedDate).toLocaleDateString()}
                    </div>
                  )}
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
              {existingImage && !previewImage && (
                <div className="text-sm text-muted-foreground mb-2">
                  Current image is set. Upload a new one to replace it.
                </div>
              )}
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
                  {previewImage || existingImage ? "Change Image" : "Upload Image"}
                </Button>
                {(previewImage || existingImage) && (
                  <div className="w-20 h-20 rounded-md overflow-hidden border">
                    <img
                      src={previewImage || existingImage || ""}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {(previewImage || existingImage) && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveImage}
                  >
                    Remove
                  </Button>
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
                    Updating...
                  </>
                ) : (
                  "Update Blog"
                )}
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
  )
}
