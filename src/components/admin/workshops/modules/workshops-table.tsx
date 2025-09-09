"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type { Workshop } from "@/types/workshop-Types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Eye, Pencil, Trash2, ExternalLink } from "lucide-react";

interface WorkshopsTableProps {
  items: Workshop[];
  loading: boolean;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  filterEvent: string;
  onFilterChange: (val: string) => void;
  uniqueEvents: string[];
  onView: (workshop: Workshop) => void;
  onEdit: (workshop: Workshop) => void;
  onDelete: (workshop: Workshop) => void;
  canEdit?: boolean;
  canDelete?: boolean;
}

export default function WorkshopsTable({
  items,
  loading,
  searchTerm,
  onSearchChange,
  filterEvent,
  onFilterChange,
  uniqueEvents,
  onView,
  onEdit,
  onDelete,
  canEdit = false,
  canDelete = false,
}: WorkshopsTableProps) {
  return (
    <div className="bg-white rounded-md border shadow-sm">
      <div className="p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search by name, description, or URL"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-56">
          <Select
            value={filterEvent}
            onValueChange={(val) => onFilterChange(val)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter by event" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Events</SelectItem>
              {uniqueEvents.map((eventId) => (
                <SelectItem key={eventId} value={eventId}>
                  Event {eventId.slice(-6)}
                </SelectItem>
              ))}
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
                <TableHead className="whitespace-nowrap">Description</TableHead>
                <TableHead className="whitespace-nowrap">Registration</TableHead>
                <TableHead className="whitespace-nowrap">Created</TableHead>
                <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    Loading workshops...
                  </TableCell>
                </TableRow>
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No workshops found
                  </TableCell>
                </TableRow>
              ) : (
                items.map((w, idx) => (
                  <TableRow key={w._id} className={idx % 2 === 0 ? "" : "bg-gray-50/40"}>
                    <TableCell className="font-medium">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-help">{w.name}</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <span className="text-xs">ID: {w._id.slice(-6)}</span>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <div className="truncate" title={w.about}>
                        {w.about}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8"
                            onClick={() => window.open(w.registrationFormUrl, '_blank')}
                          >
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Register
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <span className="text-xs">Open registration form</span>
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{new Date(w.createdAt).toLocaleString()}</TableCell>
                    <TableCell className="space-x-2 text-right whitespace-nowrap">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            aria-label="View"
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 rounded-full"
                            onClick={() => onView(w)}
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
                            disabled={!canEdit}
                            onClick={() => canEdit && onEdit(w)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{canEdit ? "Edit" : "No permission"}</TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            aria-label="Delete"
                            variant="outline"
                            size="icon"
                            className="h-9 w-9 rounded-full border-red-500 text-red-600 hover:bg-red-50"
                            disabled={!canDelete}
                            onClick={() => canDelete && onDelete(w)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{canDelete ? "Delete" : "No permission"}</TooltipContent>
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