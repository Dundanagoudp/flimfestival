"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Nomination } from "@/types/nominationsTypes";

interface ViewNominationModalProps {
  isOpen: boolean;
  onClose: () => void;
  nomination: Nomination | null;
}

export default function ViewNominationModal({ isOpen, onClose, nomination }: ViewNominationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader><DialogTitle>View Nomination</DialogTitle></DialogHeader>
        {nomination && (
          <div className="space-y-3">
            <img src={nomination.image} alt={nomination.title} className="w-full h-56 object-cover rounded" />
            <div>
              <div className="text-sm text-gray-500">Title</div>
              <div className="font-semibold">{nomination.title}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Type</div>
              <div>{nomination.type}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Description</div>
              <div className="whitespace-pre-wrap">{nomination.description}</div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}


