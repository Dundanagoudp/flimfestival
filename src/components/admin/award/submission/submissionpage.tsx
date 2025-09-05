"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Users, CheckCircle2, Clock } from "lucide-react";
import DynamicPagination from "@/components/common/DynamicPagination";
import { useToast } from "@/hooks/use-toast";
import type { Submission } from "@/types/submission";
import {
  getAllSubmissions,
  deleteSubmissionById,
  markSubmissionContacted,
} from "@/services/submisionService";
import SubmissionsTable from "./submissions-table";
import ViewSubmissionModal from "./popups/view-submission-modal";
import EditSubmissionModal from "./popups/edit-submission-modal";
import DeleteSubmissionModal from "./popups/delete-submission-modal";
import ToggleContactModal from "./popups/toggle-contact-modal";


export default function Submissionpage() {
  const { showToast } = useToast();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "contacted" | "not-contacted">("all");

  // Pagination (client-side)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Modals
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<Submission | null>(null);
  const [isToggleOpen, setIsToggleOpen] = useState(false);
  const [toggleTarget, setToggleTarget] = useState<boolean>(false);
  const [toggleLoading, setToggleLoading] = useState(false);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const data = await getAllSubmissions();
      setSubmissions(data);
    } catch (error) {
      showToast("Failed to load submissions", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return submissions.filter((s) => {
      const matchesTerm = term
        ? [s.fullName, s.email, s.phone, s.videoType, s.message]
            .filter(Boolean)
            .some((v) => String(v).toLowerCase().includes(term))
        : true;
      const matchesStatus =
        filterStatus === "all" ? true : filterStatus === "contacted" ? s.contacted : !s.contacted;
      return matchesTerm && matchesStatus;
    });
  }, [submissions, searchTerm, filterStatus]);

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const pageStart = (currentPage - 1) * itemsPerPage;
  const pageItems = filtered.slice(pageStart, pageStart + itemsPerPage);

  // Stats
  const contactedCount = submissions.filter((s) => s.contacted).length;
  const notContactedCount = submissions.length - contactedCount;

  // Handlers
  const onView = (submission: Submission) => {
    setSelected(submission);
    setIsViewOpen(true);
  };

  const onEdit = (submission: Submission) => {
    setSelected(submission);
    setIsEditOpen(true);
  };

  const onDelete = (submission: Submission) => {
    setSelected(submission);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    if (!selected) return;
    try {
      await deleteSubmissionById(selected._id);
      showToast("Submission deleted", "success");
      setIsDeleteOpen(false);
      await loadSubmissions();
    } catch (e) {
      showToast("Failed to delete submission", "error");
    }
  };

  const openToggle = (submission: Submission) => {
    setSelected(submission);
    setToggleTarget(!submission.contacted);
    setIsToggleOpen(true);
  };

  const confirmToggle = async () => {
    if (!selected) return;
    setToggleLoading(true);
    try {
      await markSubmissionContacted(selected._id, toggleTarget);
      showToast(`Marked as ${toggleTarget ? "contacted" : "not contacted"}`, "success");
      setIsToggleOpen(false);
      await loadSubmissions();
    } catch (e) {
      showToast("Failed to update contact status", "error");
    } finally {
      setToggleLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Film Submissions</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Submissions</p>
                <p className="text-2xl font-semibold text-gray-900">{submissions.length}</p>
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
                <p className="text-sm font-medium text-gray-500">Contacted</p>
                <p className="text-2xl font-semibold text-gray-900">{contactedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Contact</p>
                <p className="text-2xl font-semibold text-gray-900">{notContactedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <SubmissionsTable
        items={pageItems}
        loading={loading}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
        onView={onView}
        onEdit={onEdit}
        onDelete={onDelete}
        onToggleContact={openToggle}
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

      <ViewSubmissionModal
        isOpen={isViewOpen}
        onClose={() => setIsViewOpen(false)}
        submission={selected}
      />

      <EditSubmissionModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        submission={selected}
        onSuccess={loadSubmissions}
      />

      <DeleteSubmissionModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDelete}
        submission={selected}
      />

      <ToggleContactModal
        isOpen={isToggleOpen}
        onClose={() => setIsToggleOpen(false)}
        onConfirm={confirmToggle}
        submission={selected}
        targetStatus={toggleTarget}
        loading={toggleLoading}
      />
    </div>
  );
}
