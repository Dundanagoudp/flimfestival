"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DynamicButton from "@/components/common/DynamicButton";
import DynamicPagination from "@/components/common/DynamicPagination";
import { RegistrationItem } from "@/types/registartionTypes";
import { 
  Search, 
  Phone, 
  Mail, 
  User, 
  Filter,
  Eye,
  Edit,
  CheckCircle,
  XCircle,
  Trash2,
  Users
} from "lucide-react";

interface RegistrationsTableProps {
  registrations: RegistrationItem[];
  loading: boolean;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  filterStatus: "all" | "contacted" | "not-contacted";
  onFilterChange: (value: "all" | "contacted" | "not-contacted") => void;
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onView: (registration: RegistrationItem) => void;
  onEdit: (registration: RegistrationItem) => void;
  onToggleContact: (registration: RegistrationItem) => void;
  onDelete: (registration: RegistrationItem) => void;
}

export default function RegistrationsTable({
  registrations,
  loading,
  searchTerm,
  onSearchChange,
  filterStatus,
  onFilterChange,
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  onView,
  onEdit,
  onToggleContact,
  onDelete,
}: RegistrationsTableProps) {
  const filteredRegistrations = registrations.filter((registration) => {
    const matchesSearch = 
      registration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      registration.phone.includes(searchTerm);
    
    const matchesStatus = 
      filterStatus === "all" ||
      (filterStatus === "contacted" && registration.contacted) ||
      (filterStatus === "not-contacted" && !registration.contacted);
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <Select value={filterStatus} onValueChange={onFilterChange}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="not-contacted">Not Contacted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Registrations Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Registrations ({filteredRegistrations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">Name</TableHead>
                  <TableHead className="w-[250px]">Email</TableHead>
                  <TableHead className="w-[150px]">Phone</TableHead>
                  <TableHead className="w-[200px]">Message</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="w-[200px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                        <span className="text-gray-500">Loading registrations...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : filteredRegistrations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12">
                      <div className="flex flex-col items-center justify-center space-y-3">
                        <Users className="h-12 w-12 text-gray-300" />
                        <div className="text-center">
                          <p className="text-gray-500 font-medium">No registrations found</p>
                          <p className="text-gray-400 text-sm">
                            {searchTerm || filterStatus !== "all" 
                              ? "Try adjusting your search or filter criteria" 
                              : "No registrations have been submitted yet"}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRegistrations.map((registration) => (
                    <TableRow key={registration._id} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-gray-400" />
                          <span className="truncate">{registration.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="truncate">{registration.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="truncate">{registration.phone}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="truncate text-sm text-gray-600">
                            {registration.message || "No message"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={registration.contacted ? "default" : "secondary"}
                          className={`${
                            registration.contacted 
                              ? "bg-green-100 text-green-800 border-green-200" 
                              : "bg-gray-100 text-gray-800 border-gray-200"
                          }`}
                        >
                          {registration.contacted ? "Contacted" : "Not Contacted"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <DynamicButton
                            variant="ghost"
                            size="sm"
                            icon={<Eye className="h-4 w-4" />}
                            onClick={() => onView(registration)}
                            className="h-8 w-8 p-0"
                          >
                            <span className="sr-only">View</span>
                          </DynamicButton>
                          <DynamicButton
                            variant="ghost"
                            size="sm"
                            icon={<Edit className="h-4 w-4" />}
                            onClick={() => onEdit(registration)}
                            className="h-8 w-8 p-0"
                          >
                            <span className="sr-only">Edit</span>
                          </DynamicButton>
                          <DynamicButton
                            variant="ghost"
                            size="sm"
                            icon={registration.contacted ? <XCircle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
                            onClick={() => onToggleContact(registration)}
                            className={`h-8 w-8 p-0 ${
                              registration.contacted 
                                ? "text-red-600 hover:text-red-700 hover:bg-red-50" 
                                : "text-green-600 hover:text-green-700 hover:bg-green-50"
                            }`}
                          >
                            <span className="sr-only">{registration.contacted ? "Mark as not contacted" : "Mark as contacted"}</span>
                          </DynamicButton>
                          <DynamicButton
                            variant="ghost"
                            size="sm"
                            icon={<Trash2 className="h-4 w-4" />}
                            onClick={() => onDelete(registration)}
                            className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <span className="sr-only">Delete</span>
                          </DynamicButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="p-0">
            <DynamicPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={onPageChange}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              className="border-0"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}