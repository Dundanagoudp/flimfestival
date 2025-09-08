"use client"

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import DynamicButton from "@/components/common/DynamicButton";
import type { HomeVideo } from "@/types/homevideosTypes";
import { deleteHomeVideo } from "@/services/homevideos";
import { useToast } from "@/components/ui/custom-toast";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  item: HomeVideo | null;
  onSuccess: () => void;
}

export default function DeleteHomeVideoModal({ isOpen, onClose, item, onSuccess }: Props) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!item) return;
    try {
      setLoading(true);
      await deleteHomeVideo(item._id);
      showToast("Deleted", "success");
      onSuccess();
    } catch (error: any) {
      showToast("Delete failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete video?</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">This action cannot be undone. It will permanently delete "{item?.title}".</p>
        <DialogFooter className="gap-2 sm:gap-2">
          <DynamicButton variant="outline" onClick={onClose}>Cancel</DynamicButton>
          <DynamicButton variant="destructive" loading={loading} onClick={handleDelete}>Delete</DynamicButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}