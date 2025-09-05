"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { RegistrationItem } from "@/types/registartionTypes";
import { Eye, Mail, Phone, User, MessageSquare, Calendar } from "lucide-react";

interface ViewRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  registration: RegistrationItem | null;
}

export default function ViewRegistrationModal({ 
  isOpen, 
  onClose, 
  registration 
}: ViewRegistrationModalProps) {
  if (!registration) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Registration Details
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Full Name</Label>
                <p className="text-sm font-medium text-gray-900">{registration.name}</p>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-500">Phone Number</Label>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <p className="text-sm text-gray-900">{registration.phone}</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-500">Email Address</Label>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <p className="text-sm text-gray-900">{registration.email}</p>
              </div>
            </div>
          </div>

          {/* Message Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Message
            </h3>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-500">Additional Message</Label>
              <div className="bg-gray-50 p-3 rounded-md min-h-[80px]">
                <p className="text-sm text-gray-900">
                  {registration.message || "No message provided"}
                </p>
              </div>
            </div>
          </div>

          {/* Status Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Status & Information
            </h3>
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-500">Contact Status</Label>
              <Badge 
                variant={registration.contacted ? "default" : "secondary"}
                className={registration.contacted ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}
              >
                {registration.contacted ? "Contacted" : "Not Contacted"}
              </Badge>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}