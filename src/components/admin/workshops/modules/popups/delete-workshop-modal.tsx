"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Workshop } from "@/types/workshop-Types";
import DynamicButton from "@/components/common/DynamicButton";

interface DeleteWorkshopModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  workshop: Workshop | null;
}

export default function DeleteWorkshopModal({ isOpen, onClose, onConfirm, workshop }: DeleteWorkshopModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Delete Workshop</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-600">
          Are you sure you want to delete workshop
          {workshop ? (
            <>
              {" "}
              <span className="font-semibold">{workshop.name}</span>?
            </>
          ) : (
            "?"
          )}
          <br />
          This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <DynamicButton variant="destructive" onClick={onConfirm}>
            Delete
          </DynamicButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}