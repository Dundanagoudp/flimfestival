"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import DynamicButton from "@/components/common/DynamicButton";
import type { Submission } from "@/types/submission";

interface ToggleContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  submission: Submission | null;
  targetStatus: boolean; // true => mark contacted
  loading?: boolean;
}

export default function ToggleContactModal({
  isOpen,
  onClose,
  onConfirm,
  submission,
  targetStatus,
  loading = false,
}: ToggleContactModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle>
            {targetStatus ? "Mark as Contacted" : "Mark as Not Contacted"}
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-600">
          Are you sure you want to mark
          {" "}
          <span className="font-semibold">
            {submission ? submission.fullName : "this submission"}
          </span>
          {" "}
          as {targetStatus ? "contacted" : "not contacted"}?
        </p>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <DynamicButton variant={targetStatus ? "success" : "warning"} onClick={onConfirm} loading={loading}>
            Confirm
          </DynamicButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}

