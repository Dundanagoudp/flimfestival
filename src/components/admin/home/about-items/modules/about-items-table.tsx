"use client";

import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DynamicButton from "@/components/common/DynamicButton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { AboutItem } from "@/types/aboutTypes";
import { getMediaUrl } from "@/utils/media";

interface AboutItemsTableProps {
  items: AboutItem[];
  loading: boolean;
  onView: (item: AboutItem) => void;
  onEdit: (item: AboutItem) => void;
  onDelete: (item: AboutItem) => void;
}

export default function AboutItemsTable({ items, loading, onView, onEdit, onDelete }: AboutItemsTableProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pending, setPending] = useState<AboutItem | null>(null);

  const openConfirm = (item: AboutItem) => {
    setPending(item);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (pending) onDelete(pending);
    setConfirmOpen(false);
    setPending(null);
  };

  const getImgSrc = (url: string | undefined) => (url ? getMediaUrl(url) : "/placeholder.svg");
  const firstImage = (item: AboutItem) => item.images?.[0];

  return (
    <div className="space-y-3">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Images</TableHead>
              <TableHead>Index</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Subtitle</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <img
                      src={getImgSrc(firstImage(item))}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-md"
                    />
                    {(item.images?.length ?? 0) > 1 && (
                      <span className="text-xs text-gray-500">+{item.images!.length - 1}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{item.index}</TableCell>
                <TableCell className="font-medium">{item.title}</TableCell>
                <TableCell className="max-w-xs truncate">{item.subtitle ?? "—"}</TableCell>
                <TableCell className="text-right space-x-2">
                  <DynamicButton variant="outline" size="sm" onClick={() => onView(item)}>
                    View
                  </DynamicButton>
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
                <TableCell colSpan={5} className="text-center text-sm text-gray-500 py-8">
                  {loading ? "Loading..." : "No about items yet. Add one to get started."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={confirmOpen} onOpenChange={() => setConfirmOpen(false)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete about item?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-gray-600">
            This action cannot be undone. Are you sure you want to delete
            {pending ? ` "${pending.title}"` : " this item"}?
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
