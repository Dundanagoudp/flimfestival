"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DynamicButton from "@/components/common/DynamicButton";
import { 
  getAllRegistrations, 
  markAsContacted,
  markAsNotContacted
} from "@/services/registartionServices";
import { RegistrationItem } from "@/types/registartionTypes";
import { useToast } from "@/hooks/use-toast";
import { Plus, Users, TrendingUp, Clock } from "lucide-react";

// Import modal components
import AddRegistrationModal from "./modalpopups/add-registration-modal";
import EditRegistrationModal from "./modalpopups/edit-registration-modal";
import ViewRegistrationModal from "./modalpopups/view-registration-modal";
import DeleteRegistrationModal from "./modalpopups/delete-registration-modal";
import RegistrationsTable from "./registrations-table";

export default function Registrationspage() {
  const { showToast } = useToast();
  const [registrations, setRegistrations] = useState<RegistrationItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "contacted" | "not-contacted">("all");
  
  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRegistration, setSelectedRegistration] = useState<RegistrationItem | null>(null);

  // Load registrations
  const loadRegistrations = async () => {
    setLoading(true);
    try {
      const data = await getAllRegistrations(currentPage, itemsPerPage);
      setRegistrations(data);
      // For now, we'll estimate total pages based on data length
      // In a real app, the API should return pagination metadata
      setTotalPages(Math.ceil(data.length / itemsPerPage));
      setTotalItems(data.length);
    } catch (error) {
      showToast("Failed to load registrations", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRegistrations();
  }, [currentPage]);

  // Handle contact status toggle
  const handleContactToggle = async (registration: RegistrationItem) => {
    try {
      if (registration.contacted) {
        await markAsNotContacted(registration._id);
      } else {
        await markAsContacted(registration._id);
      }
      showToast(`Registration marked as ${registration.contacted ? "not contacted" : "contacted"}`, "success");
      loadRegistrations();
    } catch (error) {
      showToast("Failed to update contact status", "error");
    }
  };

  // Modal handlers
  const openEditModal = (registration: RegistrationItem) => {
    setSelectedRegistration(registration);
    setIsEditModalOpen(true);
  };

  const openViewModal = (registration: RegistrationItem) => {
    setSelectedRegistration(registration);
    setIsViewModalOpen(true);
  };

  const openDeleteModal = (registration: RegistrationItem) => {
    setSelectedRegistration(registration);
    setIsDeleteModalOpen(true);
  };

  // Calculate statistics
  const contactedCount = registrations.filter(r => r.contacted).length;
  const notContactedCount = registrations.length - contactedCount;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Event Registrations</h1>
          <p className="text-gray-600 mt-1">Manage all event registrations and track contact status</p>
        </div>
        <DynamicButton
          variant="default"
          icon={<Plus className="h-4 w-4" />}
          iconPosition="left"
          onClick={() => setIsAddModalOpen(true)}
        >
          Add Registration
        </DynamicButton>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Registrations</p>
                <p className="text-2xl font-semibold text-gray-900">{totalItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Contacted</p>
                <p className="text-2xl font-semibold text-gray-900">{contactedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Contact</p>
                <p className="text-2xl font-semibold text-gray-900">{notContactedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Table Component */}
      <RegistrationsTable
        registrations={registrations}
        loading={loading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onView={openViewModal}
        onEdit={openEditModal}
        onToggleContact={handleContactToggle}
        onDelete={openDeleteModal}
      />

      {/* Modal Components */}
      <AddRegistrationModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={loadRegistrations}
      />

      <EditRegistrationModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={loadRegistrations}
        registration={selectedRegistration}
      />

      <ViewRegistrationModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        registration={selectedRegistration}
      />

      <DeleteRegistrationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSuccess={loadRegistrations}
        registration={selectedRegistration}
      />
    </div>
  );
}