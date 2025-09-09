"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { AdminContactItem } from "@/types/adminContactTypes";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Eye, Pencil, Trash2, Mail, Phone } from "lucide-react";

interface ContactsTableProps {
  items: AdminContactItem[];
  loading: boolean;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  filterResolved: string;
  onFilterChange: (val: string) => void;
  onView: (item: AdminContactItem) => void;
  onEdit: (item: AdminContactItem) => void;
  onDelete: (item: AdminContactItem) => void;
}

export default function ContactsTable({
  items,
  loading,
  searchTerm,
  onSearchChange,
  filterResolved,
  onFilterChange,
  onView,
  onEdit,
  onDelete,
}: ContactsTableProps) {
  return (
    <div className="bg-white rounded-md border shadow-sm">
      <div className="p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search name, email, phone, subject, message"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-56">
          <Select
            value={filterResolved}
            onValueChange={(val) => onFilterChange(val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="true">Resolved</SelectItem>
              <SelectItem value="false">Unresolved</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <TooltipProvider>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/70">
                <TableHead className="whitespace-nowrap">Name</TableHead>
                <TableHead className="whitespace-nowrap">Contact</TableHead>
                <TableHead className="whitespace-nowrap">Subject</TableHead>
                <TableHead className="whitespace-nowrap">Message</TableHead>
                <TableHead className="whitespace-nowrap">Resolved</TableHead>
                <TableHead className="whitespace-nowrap">Created</TableHead>
                <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    Loading contacts...
                  </TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No contacts found
                  </TableCell>
                </TableRow>
              ) : (
                items.map((c, idx) => (
                  <TableRow key={c._id} className={idx % 2 === 0 ? "" : "bg-gray-50/40"}>
                    <TableCell className="font-medium">{c.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1 text-sm">
                        <div className="flex items-center gap-2 text-gray-700">
                          <Mail className="h-3.5 w-3.5" />
                          <a className="underline" href={`mailto:${c.email}`}>{c.email}</a>
                        </div>
                        <div className="flex items-center gap-2 text-gray-700">
                          <Phone className="h-3.5 w-3.5" />
                          <a className="underline" href={`tel:${c.phone}`}>{c.phone}</a>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={c.subject}>{c.subject}</div>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <div className="truncate" title={c.message}>{c.message}</div>
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs px-2 py-1 rounded-full ${c.resolved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {c.resolved ? "Resolved" : "Unresolved"}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(c.createdAt).toLocaleString()}</TableCell>
                    <TableCell className="space-x-2 text-right whitespace-nowrap">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            aria-label="View"
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 rounded-full"
                            onClick={() => onView(c)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>View Details</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            aria-label="Edit"
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 rounded-full"
                            onClick={() => onEdit(c)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Edit</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            aria-label="Delete"
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 rounded-full border-red-500 text-red-600 hover:bg-red-50"
                            onClick={() => onDelete(c)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Delete</TooltipContent>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TooltipProvider>
      </div>
    </div>
  );
}

