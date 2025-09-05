"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Submission } from "@/types/submission";
import DynamicButton from "@/components/common/DynamicButton";

interface DeleteSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  submission: Submission | null;
}

export default function DeleteSubmissionModal({ isOpen, onClose, onConfirm, submission }: DeleteSubmissionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[440px]">
        <DialogHeader>
          <DialogTitle>Delete Submission</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-600">
          Are you sure you want to delete submission
          {submission ? (
            <>
              {" "}
              <span className="font-semibold">{submission.fullName}</span>?
            </>
          ) : (
            "?"
          )}
          This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <DynamicButton variant="destructive" onClick={onConfirm}>Delete</DynamicButton>
        </div>
      </DialogContent>
    </Dialog>
  );
}

