"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import DynamicButton from "@/components/common/DynamicButton";
import { useToast } from "@/components/ui/custom-toast";
import { deleteCategory } from "@/services/workshop-Services";
import type { WorkshopCategory } from "@/types/workshop-Types";

interface DeleteCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  category: WorkshopCategory | null;
}

export default function DeleteCategoryModal({
  isOpen,
  onClose,
  onSuccess,
  category,
}: DeleteCategoryModalProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleConfirm = async () => {
    if (!category) return;

    setLoading(true);
    setErrorMessage(null);
    try {
      await deleteCategory(category._id);
      showToast("Category deleted successfully", "success");
      onSuccess();
      onClose();
    } catch (error: any) {
      const msg = error?.response?.data?.message || error?.message || "Failed to delete category";
      setErrorMessage(msg);
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setErrorMessage(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Delete Category</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-600">
          Are you sure you want to delete category
          {category ? (
            <>
              {" "}
              <span className="font-semibold">{category.name}</span>?
            </>
          ) : (
            "?"
          )}
          <br />
          If this category has workshops, you must remove or reassign them first. This action cannot be undone.
        </p>
        {errorMessage && (
          <p className="text-sm text-red-600 mt-2">{errorMessage}</p>
        )}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <DynamicButton variant="destructive" onClick={handleConfirm} loading={loading}>
            Delete
          </DynamicButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}
