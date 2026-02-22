"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { AboutItem } from "@/types/aboutTypes";
import { getMediaUrl } from "@/utils/media";

interface ViewAboutItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: AboutItem | null;
}

export default function ViewAboutItemModal({ isOpen, onClose, item }: ViewAboutItemModalProps) {
  const images = item?.images ?? [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>View About Item</DialogTitle>
        </DialogHeader>
        {item && (
          <div className="space-y-4">
            {images.length > 0 && (
              <div>
                <div className="text-sm text-gray-500 mb-2">Images ({images.length})</div>
                <div className="flex flex-wrap gap-2">
                  {images.map((url, i) => (
                    <img
                      key={i}
                      src={getMediaUrl(url)}
                      alt={`${item.title} ${i + 1}`}
                      className="h-28 w-28 object-cover rounded border"
                    />
                  ))}
                </div>
              </div>
            )}
            <div>
              <div className="text-sm text-gray-500">Index</div>
              <div className="font-medium">{item.index}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500">Title</div>
              <div className="font-semibold">{item.title}</div>
            </div>
            {item.subtitle != null && item.subtitle !== "" && (
              <div>
                <div className="text-sm text-gray-500">Subtitle</div>
                <div className="whitespace-pre-wrap">{item.subtitle}</div>
              </div>
            )}
            {item.description != null && item.description !== "" && (
              <div>
                <div className="text-sm text-gray-500">Description</div>
                <div className="whitespace-pre-wrap text-sm">{item.description}</div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
