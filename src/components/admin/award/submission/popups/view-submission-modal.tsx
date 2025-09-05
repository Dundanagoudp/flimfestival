"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Submission } from "@/types/submission";

interface ViewSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  submission: Submission | null;
}

export default function ViewSubmissionModal({ isOpen, onClose, submission }: ViewSubmissionModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Submission Details</DialogTitle>
        </DialogHeader>
        {submission ? (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="text-gray-500">Full Name</div>
              <div className="font-medium">{submission.fullName}</div>
              <div className="text-gray-500">Email</div>
              <div className="font-medium">{submission.email}</div>
              <div className="text-gray-500">Phone</div>
              <div className="font-medium">{submission.phone}</div>
              <div className="text-gray-500">Video Type</div>
              <div className="font-medium">{submission.videoType}</div>
              <div className="text-gray-500">Contacted</div>
              <div className="font-medium">{submission.contacted ? "Yes" : "No"}</div>
              <div className="text-gray-500">Created At</div>
              <div className="font-medium">{new Date(submission.createdAt).toLocaleString()}</div>
            </div>
            <div>
              <div className="text-gray-500 text-sm mb-1">Message</div>
              <div className="p-3 rounded bg-gray-50 text-sm whitespace-pre-wrap">
                {submission.message || "—"}
              </div>
            </div>
            <div>
              <div className="text-gray-500 text-sm mb-1">Video File</div>
              {submission.videoFile ? (
                <a
                  href={submission.videoFile}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 underline break-all"
                >
                  {submission.videoFile}
                </a>
              ) : (
                <span className="text-sm text-gray-600">No file</span>
              )}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

