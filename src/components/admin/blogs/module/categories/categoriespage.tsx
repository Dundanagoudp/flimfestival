"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/components/ui/custom-toast"
import { BlogCategory, CreateCategoryPayload, UpdateCategoryPayload } from "@/types/blogsTypes"
import { createCategory, getAllCategories, updateCategory, deleteCategory } from "@/services/blogsServices"
import { Plus, Edit, Trash2, Loader2, Calendar, Hash, RefreshCw } from "lucide-react"
import { AddCategoryDialog } from "@/components/admin/blogs/module/popups/add-category-dialog"
import { EditCategoryDialog } from "@/components/admin/blogs/module/popups/edit-category-dialog"
import { DeleteCategoryDialog } from "@/components/admin/blogs/module/popups/delete-category-dialog"
import DynamicButton from "@/components/common/DynamicButton"

export default function CategoriesPage() {
  const [categories, setCategories] = useState<BlogCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<BlogCategory | null>(null)
  const { showToast } = useToast()

  const fetchCategories = async (showRefreshing = false) => {
    if (showRefreshing) setRefreshing(true)
    else setLoading(true)

    try {
      const data = await getAllCategories()
      setCategories(data)
    } catch (error: any) {
      showToast(error.message || "Failed to fetch categories", "error")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleAddCategory = () => {
    setSelectedCategory(null)
    setAddDialogOpen(true)
  }

  const handleEditCategory = (category: BlogCategory) => {
    setSelectedCategory(category)
    setEditDialogOpen(true)
  }

  const handleDeleteCategory = (category: BlogCategory) => {
    setSelectedCategory(category)
    setDeleteDialogOpen(true)
  }

  const handleSuccess = () => {
    fetchCategories()
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
      <div className="flex flex-1 flex-col gap-4 p-4">
        <Card className="w-full">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="h-5 w-5" />
                  Blog Categories
                </CardTitle>
                <CardDescription>Manage your blog categories</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <DynamicButton 
                  variant="outline" 
                  size="sm" 
                  onClick={() => fetchCategories(true)} 
                  loading={refreshing}
                  loadingText="Refreshing..."
                  icon={<RefreshCw className="h-4 w-4" />}
                >
                  Refresh
                </DynamicButton>
                <DynamicButton onClick={handleAddCategory} size="sm" icon={<Plus className="h-4 w-4 mr-2" />}>
                  Add Category
                </DynamicButton>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {categories.length === 0 ? (
              <div className="text-center py-8">
                <Hash className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No categories found</h3>
                <p className="text-muted-foreground mb-4">Get started by creating your first category</p>
                <DynamicButton onClick={handleAddCategory} icon={<Plus className="h-4 w-4 mr-2" />}>
                  Add Category
                </DynamicButton>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead>Updated</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categories.map((category) => (
                        <TableRow key={category._id}>
                          <TableCell className="font-medium">{category.name}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              {category.createdAt ? formatDate(category.createdAt) : "N/A"}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              {category.updatedAt ? formatDate(category.updatedAt) : "N/A"}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <DynamicButton variant="outline" size="sm" onClick={() => handleEditCategory(category)} icon={<Edit className="h-4 w-4" />}>
                                Edit
                              </DynamicButton>
                              <DynamicButton
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteCategory(category)}
                                className="text-destructive hover:text-destructive"
                                icon={<Trash2 className="h-4 w-4" />}
                              >
                                Delete
                              </DynamicButton>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-4">
                  {categories.map((category) => (
                    <Card key={category._id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <h3 className="font-semibold">{category.name}</h3>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>Created: {category.createdAt ? formatDate(category.createdAt) : "N/A"}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>Updated: {category.updatedAt ? formatDate(category.updatedAt) : "N/A"}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <DynamicButton variant="outline" size="sm" onClick={() => handleEditCategory(category)} icon={<Edit className="h-4 w-4" />}>
                              Edit
                            </DynamicButton>
                            <DynamicButton
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteCategory(category)}
                              className="text-destructive hover:text-destructive"
                              icon={<Trash2 className="h-4 w-4" />}
                            >
                              Delete
                            </DynamicButton>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <AddCategoryDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSuccess={handleSuccess}
      />

      <EditCategoryDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        category={selectedCategory}
        onSuccess={handleSuccess}
      />

      <DeleteCategoryDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        category={selectedCategory}
        onSuccess={handleSuccess}
      />
    </>
  )
}
