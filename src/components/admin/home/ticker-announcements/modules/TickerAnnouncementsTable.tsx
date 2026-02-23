"use client";

import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DynamicButton from "@/components/common/DynamicButton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DynamicPagination from "@/components/common/DynamicPagination";
import type { TickerAnnouncement } from "@/types/tickerTypes";

interface TickerAnnouncementsTableProps {
  items: TickerAnnouncement[];
  loading: boolean;
  onEdit: (item: TickerAnnouncement) => void;
  onDelete: (item: TickerAnnouncement) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export default function TickerAnnouncementsTable({
  items,
  loading,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}: TickerAnnouncementsTableProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, setPending] = useState<TickerAnnouncement | null>(null);

  const openConfirm = (item: TickerAnnouncement) => {
    setPending(item);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (pending) onDelete(pending);
    setConfirmOpen(false);
    setPending(null);
  };

  return (
    <div className="space-y-3">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Text</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item._id}>
                <TableCell className="max-w-md truncate">{item.text}</TableCell>
                <TableCell>{item.order}</TableCell>
                <TableCell className="text-right space-x-2">
                  <DynamicButton variant="outline" size="sm" onClick={() => onEdit(item)}>
                    Edit
                  </DynamicButton>
                  <DynamicButton variant="destructive" size="sm" onClick={() => openConfirm(item)}>
                    Delete
                  </DynamicButton>
                </TableCell>
              </TableRow>
            ))}
            {items.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-sm text-gray-500 py-8">
                  {loading ? "Loading..." : "No ticker announcements yet. Add one to get started."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <DynamicPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
      />

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete ticker announcement?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            This will remove &quot;{pending?.text ?? ""}&quot;. This cannot be undone.
          </p>
          <div className="flex justify-end gap-2 pt-2">
            <DynamicButton variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </DynamicButton>
            <DynamicButton variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </DynamicButton>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
