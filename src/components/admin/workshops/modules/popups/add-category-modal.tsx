"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import DynamicButton from "@/components/common/DynamicButton";
import { useToast } from "@/components/ui/custom-toast";
import { addCategory } from "@/services/workshop-Services";
import type { CreateCategoryPayload } from "@/types/workshop-Types";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddCategoryModal({ isOpen, onClose, onSuccess }: AddCategoryModalProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<CreateCategoryPayload>({
    name: "",
    order: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      showToast("Category name is required", "error");
      return;
    }

    setLoading(true);
    try {
      await addCategory({ name: form.name.trim(), order: Number(form.order) ?? 0 });
      showToast("Category created successfully", "success");
      onSuccess();
      handleClose();
    } catch (error: any) {
      showToast(error?.message || "Failed to create category", "error");
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
          <DialogTitle>Add Category</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="cat-name">Name *</Label>
            <Input
              id="cat-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Master Class, Workshop"
              required
            />
          </div>
          <div>
            <Label htmlFor="cat-order">Order</Label>
            <Input
              id="cat-order"
              type="number"
              min={0}
              value={form.order}
              onChange={(e) => setForm({ ...form, order: Number(e.target.value) || 0 })}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <DynamicButton type="submit" loading={loading}>
              Create
            </DynamicButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
