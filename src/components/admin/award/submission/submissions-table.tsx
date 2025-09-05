"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import DynamicButton from "@/components/common/DynamicButton";
import type { Submission } from "@/types/submission";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Eye, Pencil, UserCheck, UserX, Trash2 } from "lucide-react";

interface SubmissionsTableProps {
  items: Submission[];
  loading: boolean;
  searchTerm: string;
  onSearchChange: (val: string) => void;
  filterStatus: "all" | "contacted" | "not-contacted";
  onFilterChange: (val: "all" | "contacted" | "not-contacted") => void;
  onView: (submission: Submission) => void;
  onEdit: (submission: Submission) => void;
  onDelete: (submission: Submission) => void;
  onToggleContact: (submission: Submission) => void;
}

export default function SubmissionsTable({
  items,
  loading,
  searchTerm,
  onSearchChange,
  filterStatus,
  onFilterChange,
  onView,
  onEdit,
  onDelete,
  onToggleContact,
}: SubmissionsTableProps) {
  return (
    <div className="bg-white rounded-md border shadow-sm">
      <div className="p-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:w-72">
          <Input
            placeholder="Search by name, email, phone, message"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="w-full sm:w-56">
          <Select
            value={filterStatus}
            onValueChange={(val) => onFilterChange(val as any)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Filter status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="contacted">Contacted</SelectItem>
              <SelectItem value="not-contacted">Not contacted</SelectItem>
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
              <TableHead className="whitespace-nowrap">Email</TableHead>
              <TableHead className="whitespace-nowrap">Phone</TableHead>
              <TableHead className="whitespace-nowrap">Type</TableHead>
              <TableHead className="whitespace-nowrap">Contacted</TableHead>
              <TableHead className="whitespace-nowrap">Created</TableHead>
              <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  Loading submissions...
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No submissions found
                </TableCell>
              </TableRow>
            ) : (
              items.map((s, idx) => (
                <TableRow key={s._id} className={idx % 2 === 0 ? "" : "bg-gray-50/40"}>
                  <TableCell className="font-medium">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="cursor-help">{s.fullName}</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <span className="text-xs">ID: {s._id.slice(-6)}</span>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{s.email}</TableCell>
                  <TableCell>{s.phone}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        s.videoType === "Short Film"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {s.videoType}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                        s.contacted ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {s.contacted ? "Yes" : "No"}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(s.createdAt).toLocaleString()}</TableCell>
                  <TableCell className="space-x-2 text-right whitespace-nowrap">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          aria-label="View"
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 rounded-full"
                          onClick={() => onView(s)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>View</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          aria-label="Edit"
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 rounded-full"
                          onClick={() => onEdit(s)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Edit</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          aria-label={s.contacted ? "Mark Not Contacted" : "Mark Contacted"}
                          variant="outline"
                          size="icon"
                          className={`h-9 w-9 rounded-full ${
                            s.contacted
                              ? "border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                              : "border-green-600 text-green-600 hover:bg-green-50"
                          }`}
                          onClick={() => onToggleContact(s)}
                        >
                          {s.contacted ? (
                            <UserX className="h-4 w-4" />
                          ) : (
                            <UserCheck className="h-4 w-4" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {s.contacted ? "Mark Not Contacted" : "Mark Contacted"}
                      </TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          aria-label="Delete"
                          variant="outline"
                          size="icon"
                          className="h-9 w-9 rounded-full border-red-500 text-red-600 hover:bg-red-50"
                          onClick={() => onDelete(s)}
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

