"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import DynamicButton from "@/components/common/DynamicButton";
import { RegistrationItem } from "@/types/registartionTypes";
import { CheckCircle, XCircle, User, Mail, Phone } from "lucide-react";

interface ToggleContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  registration: RegistrationItem | null;
  targetStatus: boolean; // true => mark as contacted, false => mark as not contacted
  loading?: boolean;
}

export default function ToggleContactModal({
  isOpen,
  onClose,
  onConfirm,
  registration,
  targetStatus,
  loading = false,
}: ToggleContactModalProps) {
  if (!registration) return null;

  const title = targetStatus ? "Mark as Contacted" : "Mark as Not Contacted";
  const Icon = targetStatus ? CheckCircle : XCircle;
  const iconColor = targetStatus ? "text-green-600" : "text-red-600";
  const chipBg = targetStatus ? "bg-green-100" : "bg-red-100";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[420px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon className={`h-5 w-5 ${iconColor}`} />
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className={`flex items-start gap-3 p-4 ${chipBg} rounded-md`}>
            <Icon className={`h-5 w-5 mt-0.5 ${iconColor}`} />
            <div className="text-sm text-gray-800">
              Are you sure you want to mark this registration as
              {" "}
              <span className="font-medium">
                {targetStatus ? "Contacted" : "Not Contacted"}
              </span>
              ?
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-md space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-gray-400" />
              <span className="font-medium text-gray-900">{registration.name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="text-gray-700">{registration.email}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-gray-400" />
              <span className="text-gray-700">{registration.phone}</span>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <DynamicButton
              variant={targetStatus ? "default" : "destructive"}
              onClick={onConfirm}
              loading={loading}
              icon={<Icon className="h-4 w-4" />}
              iconPosition="left"
            >
              {targetStatus ? "Mark as Contacted" : "Mark as Not Contacted"}
            </DynamicButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

