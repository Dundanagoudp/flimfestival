"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { AdminContactItem } from "@/types/adminContactTypes";

interface ViewContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: AdminContactItem | null;
}

export default function ViewContactModal({ isOpen, onClose, item }: ViewContactModalProps) {
  if (!item) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Contact Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Name</p>
            <p className="text-base font-medium">{item.name}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Email</p>
              <a href={`mailto:${item.email}`} className="text-blue-600 underline text-sm">{item.email}</a>
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <a href={`tel:${item.phone}`} className="text-blue-600 underline text-sm">{item.phone}</a>
            </div>
          </div>
          {item.subject && (
            <div>
              <p className="text-sm text-gray-500">Subject</p>
              <p className="text-base">{item.subject}</p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-500">Message</p>
            <p className="text-base whitespace-pre-wrap leading-relaxed">{item.message}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Created</p>
              <p className="text-sm">{new Date(item.createdAt).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Updated</p>
              <p className="text-sm">{new Date(item.updatedAt).toLocaleString()}</p>
            </div>
          </div>

          <div>
            <span className={`text-xs px-2 py-1 rounded-full ${item.resolved ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
              {item.resolved ? "Resolved" : "Unresolved"}
            </span>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

