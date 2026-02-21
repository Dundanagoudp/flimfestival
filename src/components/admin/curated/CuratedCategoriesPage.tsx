"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/custom-toast"
import { getCategories } from "@/services/curatedService"
import type { CuratedCategory } from "@/types/curatedTypes"
import { Plus, Edit, Trash2, Search, LayoutGrid, Loader2 } from "lucide-react"
import DynamicPagination from "@/components/common/DynamicPagination"
import { AddCategoryDialog } from "./AddCategoryDialog"
import { EditCategoryDialog } from "./EditCategoryDialog"
import { DeleteCategoryDialog } from "./DeleteCategoryDialog"
import { useAuth } from "@/context/auth-context"

export default function CuratedCategoriesPage() {
  const { userRole } = useAuth()
  const canDelete = userRole === "admin"
  const [categories, setCategories] = useState<CuratedCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<CuratedCategory | null>(null)
  const { showToast } = useToast()

  const fetchCategories = async () => {
    setLoading(true)
    try {
      const data = await getCategories()
      setCategories(Array.isArray(data) ? data : [])
    } catch (error: unknown) {
      const err = error as Error
      showToast(err.message || "Failed to fetch categories", "error")
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const filteredCategories = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cat.slug && cat.slug.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedCategories = filteredCategories.slice(startIndex, startIndex + itemsPerPage)

  const handlePageChange = (page: number) => setCurrentPage(page)

  const handleAddCategory = () => {
    setSelectedCategory(null)
    setAddDialogOpen(true)
  }

  const handleEditCategory = (category: CuratedCategory) => {
    setSelectedCategory(category)
    setEditDialogOpen(true)
  }

  const handleDeleteCategory = (category: CuratedCategory) => {
    if (!canDelete) return
    setSelectedCategory(category)
    setDeleteDialogOpen(true)
  }

  const handleAddSuccess = (newCategory: CuratedCategory) => {
    setCategories((prev) => [...prev, newCategory])
    setAddDialogOpen(false)
    showToast("Category created successfully!", "success")
  }

  const handleEditSuccess = (updatedCategory: CuratedCategory) => {
    setCategories((prev) =>
      prev.map((c) => (c._id === updatedCategory._id ? updatedCategory : c))
    )
    setEditDialogOpen(false)
    showToast("Category updated successfully!", "success")
  }

  const handleDeleteSuccess = () => {
    if (selectedCategory) {
      setCategories((prev) => prev.filter((c) => c._id !== selectedCategory._id))
      setDeleteDialogOpen(false)
      setSelectedCategory(null)
      showToast("Category deleted successfully!", "success")
    }
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "—"
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
      })
    } catch {
      return "—"
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
    <div className="flex flex-1 flex-col gap-4 p-3 pt-0 sm:gap-6 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Curated Categories</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Manage categories for curated image sections
          </p>
        </div>
        <Button onClick={handleAddCategory} className="w-full sm:w-auto">
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Categories</CardTitle>
            <LayoutGrid className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">Categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Visible</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {categories.filter((c) => c.public).length}
            </div>
            <p className="text-xs text-muted-foreground">Public</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Hidden</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {categories.filter((c) => !c.public).length}
            </div>
            <p className="text-xs text-muted-foreground">Not public</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm sm:text-base">Search Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name or slug..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 text-sm sm:text-base"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm sm:text-base">All Categories</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            {filteredCategories.length} categor{filteredCategories.length !== 1 ? "ies" : "y"} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {filteredCategories.length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <LayoutGrid className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-base sm:text-lg font-semibold mb-2">No categories found</h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-4">
                  {searchTerm ? "Try adjusting your search" : "Create your first curated category"}
                </p>
                {!searchTerm && (
                  <Button onClick={handleAddCategory} className="w-full sm:w-auto">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Category
                  </Button>
                )}
              </div>
            ) : (
              <>
                {paginatedCategories.map((category) => (
                  <div
                    key={category._id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-base sm:text-lg font-semibold">{category.name}</h3>
                        {!category.public && (
                          <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
                            Hidden
                          </span>
                        )}
                      </div>
                      {category.slug && (
                        <p className="text-sm text-muted-foreground">{category.slug}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <span>Order: {category.order}</span>
                        <span>Created: {formatDate(category.createdAt)}</span>
                        {category.updatedAt && (
                          <span>Updated: {formatDate(category.updatedAt)}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditCategory(category)}
                        className="flex-1 sm:flex-none"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteCategory(category)}
                        disabled={!canDelete}
                        className="flex-1 sm:flex-none"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <DynamicPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  totalItems={filteredCategories.length}
                  itemsPerPage={itemsPerPage}
                  className="mt-6"
                />
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <AddCategoryDialog open={addDialogOpen} onOpenChange={setAddDialogOpen} onSuccess={handleAddSuccess} />
      <EditCategoryDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        category={selectedCategory}
        onSuccess={handleEditSuccess}
      />
      <DeleteCategoryDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        category={selectedCategory}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  )
}
