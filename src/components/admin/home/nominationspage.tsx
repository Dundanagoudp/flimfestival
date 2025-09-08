"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import NominationsTable from "./nominations/modules/nominations-table";
import DynamicPagination from "@/components/common/DynamicPagination";
import DynamicButton from "@/components/common/DynamicButton";
import { useToast } from "@/components/ui/custom-toast";
import type { Nomination } from "@/types/nominationsTypes";
import { deleteNomination, getNominations } from "@/services/nominationsServices";
import AddNominationModal from "./nominations/modules/add-nomination-modal";
import EditNominationModal from "./nominations/modules/edit-nomination-modal";
import ViewNominationModal from "./nominations/modules/view-nomination-modal";

const TYPES: { label: string; value: string }[] = [
  { label: "Short Film", value: "short_film" },
  { label: "Documentary", value: "documentary" },
  { label: "Feature Film", value: "feature_film" },
];

export default function NominationsPage() {
  const { showToast } = useToast();
  const [items, setItems] = useState<Nomination[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selected, setSelected] = useState<Nomination | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getNominations();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      showToast("Failed to load nominations", "error");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return items.filter((n) => {
      const matchesTerm = term
        ? [n.title, n.description, n.type].some((v) => String(v || "").toLowerCase().includes(term))
        : true;
      const matchesType = filterType === "all" ? true : n.type === filterType;
      return matchesTerm && matchesType;
    });
  }, [items, search, filterType]);

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const pageStart = (currentPage - 1) * itemsPerPage;
  const pageItems = filtered.slice(pageStart, pageStart + itemsPerPage);

  const onDelete = async (n: Nomination) => {
    try {
      await deleteNomination(n._id);
      showToast("Nomination deleted", "success");
      await load();
    } catch {
      showToast("Failed to delete nomination", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Nominations</h2>
        <DynamicButton onClick={() => setIsAddOpen(true)} iconPosition="left">+ Add</DynamicButton>
      </div>

      <Card>
        <CardContent className="p-4 space-y-4">
          <NominationsTable
            items={pageItems}
            loading={loading}
            searchTerm={search}
            onSearchChange={setSearch}
            filterType={filterType}
            onFilterChange={setFilterType}
            onEdit={(n) => { setSelected(n); setIsEditOpen(true); }}
            onDelete={onDelete}
            onView={(n) => { setSelected(n); setIsViewOpen(true); }}
          />

          <DynamicPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
          />
        </CardContent>
      </Card>

      {/* Add Modal */}
      <AddNominationModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={() => { setIsAddOpen(false); load(); }}
      />

      {/* Edit Modal */}
      <EditNominationModal
        isOpen={isEditOpen}
        nomination={selected}
        onClose={() => { setIsEditOpen(false); setSelected(null); }}
        onSuccess={() => { setIsEditOpen(false); setSelected(null); load(); }}
      />
      {/* View Modal */}
      <ViewNominationModal
        isOpen={isViewOpen}
        nomination={selected}
        onClose={() => { setIsViewOpen(false); setSelected(null); }}
      />
    </div>
  );
}
