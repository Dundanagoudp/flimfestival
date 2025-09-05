"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import DynamicButton from "@/components/common/DynamicButton";
import { updateRegistrationById } from "@/services/registartionServices";
import { RegistrationItem, RegistrationData } from "@/types/registartionTypes";
import { useToast } from "@/hooks/use-toast";
import { Edit } from "lucide-react";

interface EditRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  registration: RegistrationItem | null;
}

export default function EditRegistrationModal({ 
  isOpen, 
  onClose, 
  onSuccess, 
  registration 
}: EditRegistrationModalProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<RegistrationData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  useEffect(() => {
    if (registration) {
      setFormData({
        name: registration.name,
        email: registration.email,
        phone: registration.phone,
        message: registration.message,
      });
    }
  }, [registration]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registration) return;
    
    setLoading(true);
    try {
      await updateRegistrationById(registration._id, formData);
      showToast("Registration updated successfully", "success");
      onSuccess();
      onClose();
    } catch (error) {
      showToast("Failed to update registration", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit className="h-5 w-5" />
            Edit Registration
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-name">Name *</Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Enter full name"
            />
          </div>
          <div>
            <Label htmlFor="edit-email">Email *</Label>
            <Input
              id="edit-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
              placeholder="Enter email address"
            />
          </div>
          <div>
            <Label htmlFor="edit-phone">Phone *</Label>
            <Input
              id="edit-phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
              placeholder="Enter phone number"
            />
          </div>
          <div>
            <Label htmlFor="edit-message">Message</Label>
            <Textarea
              id="edit-message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              rows={3}
              placeholder="Enter any additional message"
            />
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <DynamicButton type="submit" variant="default" loading={loading}>
              Update Registration
            </DynamicButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}