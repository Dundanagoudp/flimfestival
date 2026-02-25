"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import DynamicButton from "@/components/common/DynamicButton";
import { useToast } from "@/components/ui/custom-toast";
import { updateCategory } from "@/services/workshop-Services";
import type { WorkshopCategory, UpdateCategoryPayload } from "@/types/workshop-Types";

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category: WorkshopCategory | null;
}

export default function EditCategoryModal({
  isOpen,
  onClose,
  onSuccess,
  category,
}: EditCategoryModalProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<UpdateCategoryPayload>({ name: "", order: 0 });

  useEffect(() => {
    if (category) {
      setForm({
        name: category.name,
        order: category.order ?? 0,
      });
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) return;
    if (!form.name?.trim()) {
      showToast("Category name is required", "error");
      return;
    }

    setLoading(true);
    try {
      await updateCategory(category._id, {
        name: form.name.trim(),
        order: Number(form.order) ?? 0,
      });
      showToast("Category updated successfully", "success");
      onSuccess();
      onClose();
    } catch (error: any) {
      showToast(error?.message || "Failed to update category", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm({ name: "", order: 0 });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="edit-cat-name">Name *</Label>
            <Input
              id="edit-cat-name"
              value={form.name ?? ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="edit-cat-order">Order</Label>
            <Input
              id="edit-cat-order"
              type="number"
              min={0}
              value={form.order ?? 0}
              onChange={(e) => setForm({ ...form, order: Number(e.target.value) || 0 })}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <DynamicButton type="submit" loading={loading}>
              Update
            </DynamicButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
