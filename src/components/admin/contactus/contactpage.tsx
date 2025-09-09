"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, CheckCircle2 } from "lucide-react";
import DynamicPagination from "@/components/common/DynamicPagination";
import { useToast } from "@/components/ui/custom-toast";
import type { AdminContactItem, UpdateAdminContactPayload } from "@/types/adminContactTypes";
import { AdminContactService } from "@/services/adminContact";
import ContactsTable from "./modules/contacts-table";
import ViewContactModal from "./modules/popups/view-contact-modal";
import EditContactModal from "./modules/popups/edit-contact-modal";
import DeleteContactModal from "./modules/popups/delete-contact-modal";

export default function ContactPage() {
  const { showToast } = useToast();
  const [contacts, setContacts] = useState<AdminContactItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterResolved, setFilterResolved] = useState<string>("all");

  // Pagination (client-side)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modals
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<AdminContactItem | null>(null);

  const loadContacts = async () => {
    setLoading(true);
    try {
      const data = await AdminContactService.getAllContacts();
      setContacts(data || []);
    } catch (error) {
      console.error("Error loading contacts:", error);
      showToast("Failed to load contacts", "error");
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return contacts.filter((c) => {
      const matchesTerm = term
        ? [c.name, c.email, c.phone, c.subject, c.message]
            .filter(Boolean)
            .some((v) => String(v).toLowerCase().includes(term))
        : true;
      const matchesResolved =
        filterResolved === "all" ? true : String(c.resolved) === filterResolved;
      return matchesTerm && matchesResolved;
    });
  }, [contacts, searchTerm, filterResolved]);

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const pageStart = (currentPage - 1) * itemsPerPage;
  const pageItems = filtered.slice(pageStart, pageStart + itemsPerPage);

  const onView = (item: AdminContactItem) => {
    setSelected(item);
    setIsViewOpen(true);
  };

  const onEdit = (item: AdminContactItem) => {
    setSelected(item);
    setIsEditOpen(true);
  };

  const onDelete = (item: AdminContactItem) => {
    setSelected(item);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selected) return;
    try {
      await AdminContactService.deleteContactById(selected._id);
      showToast("Contact deleted successfully", "success");
      setIsDeleteOpen(false);
      await loadContacts();
    } catch (e) {
      showToast("Failed to delete contact", "error");
    }
  };

  const handleEditSubmit = async (payload: UpdateAdminContactPayload) => {
    if (!selected) return;
    try {
      await AdminContactService.updateContactById(selected._id, payload);
      showToast("Contact updated successfully", "success");
      setIsEditOpen(false);
      await loadContacts();
    } catch (e) {
      showToast("Failed to update contact", "error");
    }
  };

  const resolvedCount = useMemo(() => contacts.filter(c => c.resolved).length, [contacts]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Us Management</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Messages</p>
                <p className="text-2xl font-semibold text-gray-900">{contacts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Resolved</p>
                <p className="text-2xl font-semibold text-gray-900">{resolvedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">This Month</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {contacts.filter(c => {
                    const created = new Date(c.createdAt);
                    const now = new Date();
                    return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear();
                  }).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <ContactsTable
        items={pageItems}
        loading={loading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterResolved={filterResolved}
        onFilterChange={setFilterResolved}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
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
      <ViewContactModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        item={selected}
      />

      <EditContactModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        item={selected}
        onSubmit={handleEditSubmit}
      />

      <DeleteContactModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        item={selected}
      />
    </div>
  );
}


