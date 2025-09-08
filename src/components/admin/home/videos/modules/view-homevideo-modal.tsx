"use client"

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { HomeVideo } from "@/types/homevideosTypes";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  item: HomeVideo | null;
}

export default function ViewHomeVideoModal({ isOpen, onClose, item }: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{item?.title || "Preview"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">{item?.description}</p>
          {item?.video ? (
            <video src={item.video} controls className="w-full rounded-md" />
          ) : (
            <div className="text-sm">No video URL</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}