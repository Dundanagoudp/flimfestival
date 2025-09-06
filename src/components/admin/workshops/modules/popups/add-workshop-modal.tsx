"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import DynamicButton from "@/components/common/DynamicButton";
import { useToast } from "@/components/ui/custom-toast";
import { addWorkshop } from "@/services/workshop-Services";
import type { CreateWorkshopPayload } from "@/types/workshop-Types";

interface AddWorkshopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddWorkshopModal({ isOpen, onClose, onSuccess }: AddWorkshopModalProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<CreateWorkshopPayload>({
    name: "",
    about: "",
    registrationFormUrl: "",
    imageFile: null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.about || !form.registrationFormUrl) {
      showToast("Please fill in all required fields", "error");
      return;
    }

    setLoading(true);
    try {
      // You'll need to get the event ID from context or props
      // For now, using a placeholder - you should pass this as a prop
      const eventId = "68b6c9fd1ca206fb0e2ce9f0"; // This should come from props or context
      
      await addWorkshop(eventId, form);
      showToast("Workshop created successfully", "success");
      onSuccess();
      handleClose();
    } catch (error) {
      showToast("Failed to create workshop", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm({
      name: "",
      about: "",
      registrationFormUrl: "",
      imageFile: null,
    });
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({ ...form, imageFile: file });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Add New Workshop</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Workshop Name *</Label>
            <Input 
              id="name" 
              value={form.name} 
              onChange={(e) => setForm({ ...form, name: e.target.value })} 
              required 
            />
          </div>
          
          <div>
            <Label htmlFor="about">Description *</Label>
            <Textarea 
              id="about" 
              rows={3}
              value={form.about} 
              onChange={(e) => setForm({ ...form, about: e.target.value })} 
              required 
            />
          </div>
          
          <div>
            <Label htmlFor="registrationFormUrl">Registration Form URL *</Label>
            <Input 
              id="registrationFormUrl" 
              type="url"
              value={form.registrationFormUrl} 
              onChange={(e) => setForm({ ...form, registrationFormUrl: e.target.value })} 
              placeholder="https://forms.gle/..."
              required 
            />
          </div>
          
          <div>
            <Label htmlFor="imageFile">Workshop Image</Label>
            <Input 
              id="imageFile" 
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
            {form.imageFile && (
              <p className="text-sm text-gray-600 mt-1">
                Selected: {form.imageFile.name}
              </p>
            )}
          </div>
          
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <DynamicButton type="submit" loading={loading}>
              Create Workshop
            </DynamicButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}