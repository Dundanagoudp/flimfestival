"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DynamicButton from "@/components/common/DynamicButton";
import type { Nomination } from "@/types/nominationsTypes";
import DynamicPagination from "@/components/common/DynamicPagination";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { getMediaUrl } from "@/utils/media";

const TYPES: { label: string; value: string }[] = [
  { label: "All", value: "all" },
  { label: "Short Film", value: "short_film" },
  { label: "Documentary", value: "documentary" },
  { label: "Feature Film", value: "feature_film" },
];

interface NominationsTableProps {
  items: Nomination[];
  loading: boolean;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  filterType: string;
  onFilterChange: (val: string) => void;
  onEdit: (item: Nomination) => void;
  onDelete: (item: Nomination) => void;
  onView: (item: Nomination) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export default function NominationsTable({
  items,
  loading,
  searchTerm,
  onSearchChange,
  filterType,
  onFilterChange,
  onEdit,
  onDelete,
  onView,
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}: NominationsTableProps) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingDelete, setPendingDelete] = useState<Nomination | null>(null);

  const openDeleteConfirm = (item: Nomination) => {
    setPendingDelete(item);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (pendingDelete) {
      onDelete(pendingDelete);
    }
    setIsConfirmOpen(false);
    setPendingDelete(null);
  };
  const getImgsrc = (url: string) => {
 
      return getMediaUrl(url);
    }

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setPendingDelete(null);
  };
  return (
    <div className="space-y-3">
      <div className="flex flex-col sm:flex-row gap-3">
        <Input
          placeholder="Search by title, description, type"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="sm:max-w-sm"
        />
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Type</span>
          <Select value={filterType} onValueChange={onFilterChange}>
            <SelectTrigger className="w-40"><SelectValue placeholder="Filter" /></SelectTrigger>
            <SelectContent>
              {TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((n) => (
              <TableRow key={n._id}>
                <TableCell>
                  <img src={getImgsrc(n.image)} alt={n.title} className="w-16 h-16 object-cover rounded-md" />
                </TableCell>
                <TableCell className="font-medium">{n.title}</TableCell>
                <TableCell>{n.type}</TableCell>
                <TableCell className="max-w-xl truncate">{n.description}</TableCell>
                <TableCell className="text-right space-x-2">
                  <DynamicButton variant="outline" size="sm" onClick={() => onView(n)}>View</DynamicButton>
                  <DynamicButton variant="outline" size="sm" onClick={() => onEdit(n)}>Edit</DynamicButton>
                  <DynamicButton variant="destructive" size="sm" onClick={() => openDeleteConfirm(n)}>Delete</DynamicButton>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-sm text-gray-500 py-8">
                  {loading ? "Loading..." : "No nominations found"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <Dialog open={isConfirmOpen} onOpenChange={handleCancelDelete}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete nomination?</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">This action cannot be undone. Are you sure you want to delete{pendingDelete ? ` "${pendingDelete.title}"` : " this item"}?</p>
            <div className="flex justify-end gap-2">
              <DynamicButton variant="outline" onClick={handleCancelDelete}>Cancel</DynamicButton>
              <DynamicButton variant="destructive" onClick={handleConfirmDelete}>Delete</DynamicButton>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <DynamicPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
      />
    </div>
  );
}


