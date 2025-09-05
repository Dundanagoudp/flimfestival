"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import DynamicButton from "@/components/common/DynamicButton";
import { deleteRegistrationById } from "@/services/registartionServices";
import { RegistrationItem } from "@/types/registartionTypes";
import { useToast } from "@/hooks/use-toast";
import { Trash2, AlertTriangle, User, Mail } from "lucide-react";

interface DeleteRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  registration: RegistrationItem | null;
}

export default function DeleteRegistrationModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  registration 
}: DeleteRegistrationModalProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!registration) return;
    
    setLoading(true);
    try {
      await deleteRegistrationById(registration._id);
      showToast("Registration deleted successfully", "success");
      onSuccess();
      onClose();
    } catch (error) {
      showToast("Failed to delete registration", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!registration) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Delete Registration
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">
                Are you sure you want to delete this registration?
              </p>
              <p className="text-xs text-red-600 mt-1">
                This action cannot be undone and will permanently remove the registration data.
              </p>
            </div>
          </div>

          {/* Registration Details */}
          <div className="bg-gray-50 p-4 rounded-md space-y-3">
            <h4 className="text-sm font-medium text-gray-900">Registration Details:</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-900">{registration.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">{registration.email}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <DynamicButton 
              variant="destructive" 
              onClick={handleDelete}
              loading={loading}
              icon={<Trash2 className="h-4 w-4" />}
              iconPosition="left"
            >
              Delete Registration
            </DynamicButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}