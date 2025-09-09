"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { AdminContactItem } from "@/types/adminContactTypes";
import DynamicButton from "@/components/common/DynamicButton";

interface DeleteContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  item: AdminContactItem | null;
}

export default function DeleteContactModal({ isOpen, onClose, onConfirm, item }: DeleteContactModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Delete Contact</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-600">
          Are you sure you want to delete this contact
          {item ? (
            <>
              {" "}
              <span className="font-semibold">{item.name}</span>?
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

