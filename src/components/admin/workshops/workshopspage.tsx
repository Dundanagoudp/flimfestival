"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus, Calendar, FolderOpen, Pencil, Trash2 } from "lucide-react";
import DynamicPagination from "@/components/common/DynamicPagination";
import DynamicButton from "@/components/common/DynamicButton";
import { useToast } from "@/components/ui/custom-toast";
import type { Workshop, WorkshopCategory } from "@/types/workshop-Types";
import {
  getWorkshopsFlat,
  getCategories,
  deleteWorkshop,
} from "@/services/workshop-Services";
import WorkshopsTable from "./modules/workshops-table";
import AddWorkshopModal from "./modules/popups/add-workshop-modal";
import EditWorkshopModal from "./modules/popups/edit-workshop-modal";
import DeleteWorkshopModal from "./modules/popups/delete-workshop-modal";
import ViewWorkshopModal from "./modules/popups/view-workshop-modal";
import AddCategoryModal from "./modules/popups/add-category-modal";
import EditCategoryModal from "./modules/popups/edit-category-modal";
import DeleteCategoryModal from "./modules/popups/delete-category-modal";
import { useAuth } from "@/context/auth-context";

export default function WorkshopsPage() {
  const { showToast } = useToast();
  const { userRole } = useAuth();
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [categories, setCategories] = useState<WorkshopCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Pagination (client-side)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modals
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Workshop | null>(null);

  const [isAddCatOpen, setIsAddCatOpen] = useState(false);
  const [isEditCatOpen, setIsEditCatOpen] = useState(false);
  const [isDeleteCatOpen, setIsDeleteCatOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<WorkshopCategory | null>(null);

  const canEdit = userRole === "admin" || userRole === "editor";
  const canDelete = userRole === "admin";
  const canAdd = true;

  const loadWorkshops = async () => {
    setLoading(true);
    try {
      const data = await getWorkshopsFlat();
      setWorkshops(data || []);
    } catch (error) {
      console.error("Error loading workshops:", error);
      showToast("Failed to load workshops", "error");
      setWorkshops([]);
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    setLoadingCategories(true);
    try {
      const data = await getCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading categories:", error);
      showToast("Failed to load categories", "error");
      setCategories([]);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    loadWorkshops();
  }, []);

  useEffect(() => {
    loadCategories();
  }, []);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return workshops.filter((w) =>
      term
        ? [w.name, w.about, w.registrationFormUrl]
            .filter(Boolean)
            .some((v) => String(v).toLowerCase().includes(term))
        : true
    );
  }, [workshops, searchTerm]);

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const pageStart = (currentPage - 1) * itemsPerPage;
  const pageItems = filtered.slice(pageStart, pageStart + itemsPerPage);

  // Handlers
  const onView = (workshop: Workshop) => {
    setSelected(workshop);
    setIsViewOpen(true);
  };

  const onEdit = (workshop: Workshop) => {
    if (!canEdit) {
      showToast("You don't have permission to edit workshops", "error");
      return;
    }
    setSelected(workshop);
    setIsEditOpen(true);
  };

  const onDelete = (workshop: Workshop) => {
    if (!canDelete) {
      showToast("You don't have permission to delete workshops", "error");
      return;
    }
    setSelected(workshop);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selected) return;
    try {
      await deleteWorkshop(selected._id);
      showToast("Workshop deleted successfully", "success");
      setIsDeleteOpen(false);
      await loadWorkshops();
    } catch (e) {
      showToast("Failed to delete workshop", "error");
    }
  };

  const handleAddSuccess = () => {
    setIsAddOpen(false);
    loadWorkshops();
  };

  const handleEditSuccess = () => {
    setIsEditOpen(false);
    loadWorkshops();
  };

  const handleAddCategorySuccess = () => {
    setIsAddCatOpen(false);
    loadCategories();
  };

  const handleEditCategorySuccess = () => {
    setIsEditCatOpen(false);
    setSelectedCategory(null);
    loadCategories();
  };

  const handleDeleteCategorySuccess = () => {
    setIsDeleteCatOpen(false);
    setSelectedCategory(null);
    loadCategories();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Workshops Management</h1>
        </div>
        <DynamicButton
          onClick={() => {
            if (!canAdd) {
              showToast("You don't have permission to add workshops", "error");
              return;
            }
            setIsAddOpen(true);
          }}
          icon={<Plus className="h-4 w-4" />}
          iconPosition="left"
        >
          Add Workshop
        </DynamicButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Workshops</p>
                <p className="text-2xl font-semibold text-gray-900">{workshops.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <FolderOpen className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Categories</p>
                <p className="text-2xl font-semibold text-gray-900">{categories.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">This Month</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {workshops.filter((w) => {
                    const created = w.createdAt ? new Date(w.createdAt) : null;
                    if (!created) return false;
                    const now = new Date();
                    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Manage categories */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-lg font-semibold text-gray-900">Manage categories</h2>
            {canEdit && (
              <DynamicButton
                onClick={() => setIsAddCatOpen(true)}
                icon={<Plus className="h-4 w-4" />}
                iconPosition="left"
                variant="outline"
              >
                Add category
              </DynamicButton>
            )}
          </div>
          {loadingCategories ? (
            <p className="text-sm text-gray-500 mt-4">Loading categories...</p>
          ) : categories.length === 0 ? (
            <p className="text-sm text-gray-500 mt-4">No categories yet. Add one to group workshops (e.g. Master Class, Workshop).</p>
          ) : (
            <ul className="mt-4 space-y-2">
              {categories.map((cat) => (
                <li
                  key={cat._id}
                  className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                >
                  <span className="font-medium">{cat.name}</span>
                  <span className="text-sm text-gray-500">Order: {cat.order}</span>
                  {canEdit && (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => {
                          setSelectedCategory(cat);
                          setIsEditCatOpen(true);
                        }}
                        aria-label="Edit category"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-700"
                        onClick={() => {
                          setSelectedCategory(cat);
                          setIsDeleteCatOpen(true);
                        }}
                        aria-label="Delete category"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <WorkshopsTable
        items={pageItems}
        loading={loading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        canEdit={canEdit}
        canDelete={canDelete}
      />

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="text-sm text-gray-600 px-1">
          Rows per page:
          <select
            className="ml-2 border rounded px-2 py-1 text-sm"
            value={itemsPerPage}
            onChange={(e) => {
              setCurrentPage(1);
              setItemsPerPage(parseInt(e.target.value, 10));
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <DynamicPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          className="bg-white rounded-md"
        />
      </div>

      {/* Modals */}
      <AddWorkshopModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={handleAddSuccess}
        categories={categories}
      />

      <ViewWorkshopModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        workshop={selected}
      />

      <EditWorkshopModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSuccess={handleEditSuccess}
        workshop={selected}
        categories={categories}
      />

      <DeleteWorkshopModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        workshop={selected}
      />

      <AddCategoryModal
        isOpen={isAddCatOpen}
        onClose={() => setIsAddCatOpen(false)}
        onSuccess={handleAddCategorySuccess}
      />
      <EditCategoryModal
        isOpen={isEditCatOpen}
        onClose={() => { setIsEditCatOpen(false); setSelectedCategory(null); }}
        onSuccess={handleEditCategorySuccess}
        category={selectedCategory}
      />
      <DeleteCategoryModal
        isOpen={isDeleteCatOpen}
        onClose={() => { setIsDeleteCatOpen(false); setSelectedCategory(null); }}
        onSuccess={handleDeleteCategorySuccess}
        category={selectedCategory}
      />
    </div>
  );
}
