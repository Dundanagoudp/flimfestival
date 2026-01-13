"use client"

import React from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DynamicButton from "@/components/common/DynamicButton";
import DynamicPagination from "@/components/common/DynamicPagination";
import type { HomeVideo } from "@/types/homevideosTypes";
import { getMediaUrl } from "@/utils/media";

interface Props {
  items: HomeVideo[];
  loading: boolean;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  onView: (item: HomeVideo) => void;
  onEdit: (item: HomeVideo) => void;
  onDelete: (item: HomeVideo) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
}

export default function HomeVideosTable({
  items,
  loading,
  searchTerm,
  onSearchChange,
  onView,
  onEdit,
  onDelete,
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
}: Props)
 {
 const getImageSrc = (url: string) => {
  if (!url) return "";
  return getMediaUrl(url);
 };
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Input
          placeholder="Search by title or description"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Video</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4}>Loading...</TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4}>No items</TableCell>
              </TableRow>
            ) : (
              items.map((it) => (
                <TableRow key={it._id}>
                  <TableCell className="font-medium">{it.title}</TableCell>
                  <TableCell className="max-w-[420px] truncate">{it.description}</TableCell>
                  <TableCell>
                    <a href={getMediaUrl(it.video)} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                      View
                    </a>
                  </TableCell>
                  <TableCell className="space-x-2 text-right">
                    <DynamicButton size="sm" variant="outline" onClick={() => onView(it)}>View</DynamicButton>
                    <DynamicButton size="sm" variant="outline" onClick={() => onEdit(it)}>Edit</DynamicButton>
                    <DynamicButton size="sm" variant="destructive" onClick={() => onDelete(it)}>Delete</DynamicButton>
                  </TableCell>
                </TableRow>
              ))
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
    </div>
  );
}