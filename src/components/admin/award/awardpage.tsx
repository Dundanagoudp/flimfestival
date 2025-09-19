"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/custom-toast"
import { Award, AwardCategory } from "@/types/awardTypes"
import { getAllAwards, deleteAward, getAllAwardCategories } from "@/services/awardService"
import { Plus, Edit, Trash2, Eye, Search, Trophy, Calendar, Loader2, Image as ImageIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal } from "lucide-react"
import DynamicButton from "@/components/common/DynamicButton"
import DynamicPagination from "@/components/common/DynamicPagination"
import { DeleteAwardDialog } from "./modules/popups/delete-award-dialog"
import { useAuth } from "@/context/auth-context"

export default function AwardPage() {
  const { userRole } = useAuth()
  const canDelete = userRole === "admin"
  const [awards, setAwards] = useState<Award[]>([])
  const [categories, setCategories] = useState<AwardCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedAward, setSelectedAward] = useState<Award | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(10)
  const { showToast } = useToast()
  const router = useRouter()

  const fetchData = async () => {
    setLoading(true)
    try {
      const [awardsData, categoriesData] = await Promise.all([
        getAllAwards(),
        getAllAwardCategories()
      ])
      
      // Ensure we have valid data
      if (Array.isArray(awardsData)) {
        setAwards(awardsData)
      } else {
        console.error('Invalid awards data:', awardsData)
        setAwards([])
      }
      
      if (Array.isArray(categoriesData)) {
        setCategories(categoriesData)
      } else {
        console.error('Invalid categories data:', categoriesData)
        setCategories([])
      }
    } catch (error: any) {
      console.error('Error fetching data:', error)
      showToast(error.message || "Failed to fetch data", "error")
      setAwards([])
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filteredAwards = awards.filter((award) => {
    const matchesSearch = award.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      award.description.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesCategory = categoryFilter === "all" || 
      (award.category && typeof award.category === 'string' ? award.category === categoryFilter : 
       award.category && typeof award.category === 'object' ? award.category._id === categoryFilter : false)
    
    return matchesSearch && matchesCategory
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredAwards.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedAwards = filteredAwards.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleDeleteClick = (award: Award) => {
    if (!canDelete) return
    setSelectedAward(award)
    setDeleteDialogOpen(true)
  }

  const handleDeleteSuccess = () => {
    if (selectedAward) {
      setAwards(awards.filter(award => award._id !== selectedAward._id))
      setSelectedAward(null)
    }
  }

  const getCategoryName = (category: string | AwardCategory | undefined | null) => {
    if (!category) {
      return 'Unknown'
    }
    
    if (typeof category === 'string') {
      const foundCategory = categories.find(cat => cat._id === category)
      return foundCategory?.name || 'Unknown'
    }
    
    return category.name || 'Unknown'
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
    <div className="flex flex-1 flex-col gap-4 p-3 pt-0 sm:gap-6 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Award Management</h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/admin/dashboard/award/categories">
              <Trophy className="mr-2 h-4 w-4" />
              Manage Categories
            </Link>
          </Button>
          <Button asChild className="w-full sm:w-auto">
            <Link href="/admin/dashboard/award/add">
              <Plus className="mr-2 h-4 w-4" />
              Create Award
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Total Awards</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{awards.length}</div>
            <p className="text-xs text-muted-foreground">All awards</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Categories</CardTitle>
            <Trophy className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{categories.length}</div>
            <p className="text-xs text-muted-foreground">Active categories</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">With Images</CardTitle>
            <ImageIcon className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {awards.filter((a) => a.image).length}
            </div>
            <p className="text-xs text-muted-foreground">Awards with images</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs sm:text-sm font-medium">Recent</CardTitle>
            <Calendar className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">
              {awards.filter((a) => {
                const date = new Date(a.createdAt)
                const now = new Date()
                const diffTime = Math.abs(now.getTime() - date.getTime())
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                return diffDays <= 7
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">Last 7 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm sm:text-base">Filters & Search</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row">
            <div className="flex-1 min-w-0">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 text-sm sm:text-base"
                />
              </div>
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

      {/* Awards List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm sm:text-base">All Awards</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            {filteredAwards.length} award{filteredAwards.length !== 1 ? "s" : ""} found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 sm:space-y-4">
            {filteredAwards.length === 0 ? (
              <div className="text-center py-6 sm:py-8">
                <Trophy className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-base sm:text-lg font-semibold mb-2">No awards found</h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-4">
                  {searchTerm || categoryFilter !== "all"
                    ? "Try adjusting your filters or search terms"
                    : "Get started by creating your first award"}
                </p>
                {!searchTerm && categoryFilter === "all" && (
                  <Button asChild className="w-full sm:w-auto">
                    <Link href="/admin/dashboard/award/add">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Award
                    </Link>
                  </Button>
                )}
              </div>
            ) : (
              <>
                {paginatedAwards.filter(award => award && award._id && award.title).map((award) => (
                  <div
                    key={award._id}
                    className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4 p-3 sm:p-4 border rounded-lg"
                  >
                    <div className="w-full sm:w-24 h-24 sm:h-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
                      <img
                        src={award.image || "/placeholder.svg"}
                        alt={award.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 space-y-2 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                        <h3 className="text-base sm:text-lg font-semibold line-clamp-1">
                          {award.title}
                        </h3>
                        {award.category && (
                          <Badge variant="outline" className="text-xs">
                            {getCategoryName(award.category)}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">
                        {award.description}
                      </p>
                      <div className="flex flex-wrap gap-1 sm:gap-2">
                        <Badge variant="secondary" className="text-xs">
                          Rule 1: {award.rule1}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          Rule 2: {award.rule2}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          Rule 3: {award.rule3}
                        </Badge>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>Created: {formatDate(award.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <ImageIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>{award.array_images?.length || 0} additional images</span>
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
                          <DropdownMenuLabel className="text-xs sm:text-sm">Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-xs sm:text-sm">
                            <Eye className="mr-2 h-4 w-4" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => router.push(`/admin/dashboard/award/edit/${award._id}`)}
                            className="text-xs sm:text-sm"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className={`text-red-600 text-xs sm:text-sm ${!canDelete ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={() => canDelete && handleDeleteClick(award)}
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
                  totalItems={filteredAwards.length}
                  itemsPerPage={itemsPerPage}
                  className="mt-6"
                />
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <DeleteAwardDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        award={selectedAward}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  )
}
