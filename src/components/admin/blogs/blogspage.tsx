"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/custom-toast"
import { BlogPost, BlogCategory } from "@/types/blogsTypes"
import { getAllBlogs, deleteBlog, getAllCategories } from "@/services/blogsServices"
import { Plus, Edit, Trash2, Eye, Search, FileText, Link as LinkIcon, Calendar, ExternalLink, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import { DeleteBlogDialog } from "./module/popups/delete-blog-dialog"
import DynamicButton from "@/components/common/DynamicButton"
import { sanitizeUrl } from "@/lib/sanitize"
import DynamicPagination from "@/components/common/DynamicPagination"
import { getMediaUrl } from "@/utils/media"

export default function BlogsPage() {
  const { userRole } = useAuth()
  const canDelete = userRole === "admin"
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [contentTypeFilter, setContentTypeFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const { showToast } = useToast()
  const router = useRouter()

  const fetchData = async () => {
    setLoading(true)
    try {
      const [blogsData, categoriesData] = await Promise.all([
        getAllBlogs(),
        getAllCategories()
      ])
      setBlogs(blogsData)
      setCategories(categoriesData)
    } catch (error: any) {
      showToast(error.message || "Failed to fetch data", "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredBlogs = blogs.filter((blog) => {
    const matchesSearch = blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (blog.contents && blog.contents.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesType = contentTypeFilter === "all" || blog.contentType === contentTypeFilter
    
    const matchesCategory = categoryFilter === "all" || 
      (typeof blog.category === 'string' ? blog.category === categoryFilter : blog.category._id === categoryFilter)
    
    return matchesSearch && matchesType && matchesCategory
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedBlogs = filteredBlogs.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleDeleteClick = (blog: BlogPost) => {
    if (!canDelete) return
    setSelectedBlog(blog)
    setDeleteDialogOpen(true)
  }

  const handleDeleteSuccess = () => {
    if (selectedBlog) {
      setBlogs(blogs.filter(blog => blog._id !== selectedBlog._id))
      setSelectedBlog(null)
    }
  }

  const getCategoryName = (category: string | BlogCategory) => {
    if (typeof category === 'string') {
      const foundCategory = categories.find(cat => cat._id === category)
      return foundCategory?.name || 'Unknown'
    }
    return category.name
  }
  const getImageSrc = (url: string) => {
    console.log("url", url)
    console.log("getMediaUrl result:", getMediaUrl(url))
    return getMediaUrl(url)
  }
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: '2-digit', 
        year: 'numeric' 
      })
    } catch {
      return "Invalid date"
    }
  }

  if (loading) {
    return (
      <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="flex flex-1 flex-col gap-6 p-6 pt-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Blog Management</h1>
          </div>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/admin/dashboard/blog/add">
              <Plus className="mr-2 h-4 w-4" />
              Create Blog
            </Link>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Blogs</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{blogs.length}</div>
              <p className="text-xs text-muted-foreground">All content pieces</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {blogs.filter((b) => b.contentType === "blog").length}
              </div>
              <p className="text-xs text-muted-foreground">Full articles</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Link Posts</CardTitle>
              <LinkIcon className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {blogs.filter((b) => b.contentType === "link").length}
              </div>
              <p className="text-xs text-muted-foreground">External links</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <FileText className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{categories.length}</div>
              <p className="text-xs text-muted-foreground">Active categories</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardHeader>
            <CardTitle>Filters & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1 min-w-0">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by title or content..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="min-w-0">
                <select
                  value={contentTypeFilter}
                  onChange={(e) => setContentTypeFilter(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="all">All Types</option>
                  <option value="blog">Blog Posts</option>
                  <option value="link">Link Posts</option>
                </select>
              </div>
              <div className="min-w-0">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category._id} value={category._id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Blogs List */}
        <Card>
          <CardHeader>
            <CardTitle>All Blogs</CardTitle>
            <CardDescription>
              {filteredBlogs.length} blog{filteredBlogs.length !== 1 ? "s" : ""} found
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredBlogs.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No blogs found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || contentTypeFilter !== "all" || categoryFilter !== "all"
                      ? "Try adjusting your filters or search terms"
                      : "Get started by creating your first blog post"}
                  </p>
                  {!searchTerm && contentTypeFilter === "all" && categoryFilter === "all" && (
                    <Button asChild>
                      <Link href="/admin/dashboard/blog/add">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Blog
                      </Link>
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  {paginatedBlogs.map((blog) => (
                    <div
                      key={blog._id}
                      className="flex flex-col sm:flex-row items-start gap-4 p-4 border rounded-lg"
                    >
                      <div className="w-full sm:w-24 h-32 sm:h-16 bg-muted rounded-md overflow-hidden flex-shrink-0 mb-2 sm:mb-0">
                        <img
                          src={getImageSrc(blog.imageUrl) || "/placeholder.svg"}
                          alt={blog.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 space-y-2 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                          <h3 className="text-lg font-semibold line-clamp-1">
                            {blog.title}
                          </h3>
                          <Badge
                            variant={
                              blog.contentType === "blog" ? "default" : "secondary"
                            }
                          >
                            <div className="flex items-center gap-1">
                              {blog.contentType === "blog" ? (
                                <FileText className="h-3 w-3" />
                              ) : (
                                <LinkIcon className="h-3 w-3" />
                              )}
                              {blog.contentType}
                            </div>
                          </Badge>
                          <Badge variant="outline">
                            {getCategoryName(blog.category)}
                          </Badge>
                        </div>
                        {blog.contentType === "blog" && blog.contents && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {blog.contents}
                          </p>
                        )}
                        {blog.contentType === "link" && blog.link && (
                          <div className="flex items-center gap-2 text-sm text-blue-600">
                            <ExternalLink className="h-4 w-4" />
                            <span className="truncate">{blog.link}</span>
                          </div>
                        )}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Published: {formatDate(blog.publishedDate)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span>Author: {blog.author}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-row sm:flex-col items-center gap-2 mt-2 sm:mt-0">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => router.push(`/admin/dashboard/blog/edit/${blog._id}`)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            {blog.contentType === "link" && blog.link && sanitizeUrl(blog.link) && (
                              <DropdownMenuItem asChild>
                                <a
                                  href={sanitizeUrl(blog.link)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  Open Link
                                </a>
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem 
                              className={`text-red-600 ${!canDelete ? 'opacity-50 cursor-not-allowed' : ''}`}
                              onClick={() => canDelete && handleDeleteClick(blog)}
                              disabled={!canDelete}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> 
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                  
                  {/* Pagination */}
                  <DynamicPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    totalItems={filteredBlogs.length}
                    itemsPerPage={itemsPerPage}
                    className="mt-6"
                  />
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <DeleteBlogDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        blog={selectedBlog}
        onSuccess={handleDeleteSuccess}
      />
    </>
  )
}
