"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DynamicButton from "@/components/common/DynamicButton";
import { useToast } from "@/components/ui/custom-toast";
import { updateWorkshop } from "@/services/workshop-Services";
import type { Workshop, UpdateWorkshopPayload, WorkshopCategory } from "@/types/workshop-Types";

interface EditWorkshopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  workshop: Workshop | null;
  categories?: WorkshopCategory[];
}

export default function EditWorkshopModal({ isOpen, onClose, onSuccess, workshop, categories = [] }: EditWorkshopModalProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<UpdateWorkshopPayload>({
    name: "",
    about: "",
    registrationFormUrl: "",
    imageFile: null,
    categoryId: null,
  });

  useEffect(() => {
    if (workshop) {
      setForm({
        name: workshop.name,
        about: workshop.about,
        registrationFormUrl: workshop.registrationFormUrl,
        imageFile: null,
        categoryId: workshop.categoryRef ?? null,
      });
    }
  }, [workshop]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!workshop) return;
    
    setLoading(true);
    try {
      await updateWorkshop(workshop._id, form);
      showToast("Workshop updated successfully", "success");
      onSuccess();
      handleClose();
    } catch (error: any) {
      showToast(error?.message || "Failed to update workshop", "error");
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
      categoryId: null,
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
          <DialogTitle>Edit Workshop</DialogTitle>
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
            <Label>Category</Label>
            <Select
              value={form.categoryId ?? "none"}
              onValueChange={(v) => setForm({ ...form, categoryId: v === "none" ? null : v })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Uncategorized" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Uncategorized</SelectItem>
                {categories.map((c) => (
                  <SelectItem key={c._id} value={c._id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="imageFile">New Workshop Image (optional)</Label>
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
            {workshop?.imageUrl && !form.imageFile && (
              <p className="text-sm text-gray-500 mt-1">
                Current image will be kept
              </p>
            )}
          </div>
          
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <DynamicButton type="submit" loading={loading}>
              Update Workshop
            </DynamicButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}