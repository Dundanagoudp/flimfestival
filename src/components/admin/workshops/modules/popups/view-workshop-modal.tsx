"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Workshop } from "@/types/workshop-Types";
import { ExternalLink, Calendar, User, FileText } from "lucide-react";

interface ViewWorkshopModalProps {
  isOpen: boolean;
  onClose: () => void;
  workshop: Workshop | null;
}

export default function ViewWorkshopModal({ isOpen, onClose, workshop }: ViewWorkshopModalProps) {
  if (!workshop) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Workshop Details</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Workshop Image */}
          {workshop.imageUrl && (
            <div className="w-full">
              <img 
                src={workshop.imageUrl} 
                alt={workshop.name}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Workshop Info */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{workshop.name}</h3>
              <Badge variant="secondary" className="mt-1">
                Event {workshop.eventRef.slice(-6)}
              </Badge>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
              <p className="text-gray-600 text-sm leading-relaxed">{workshop.about}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Created</p>
                  <p className="text-sm font-medium">
                    {new Date(workshop.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-xs text-gray-500">Last Updated</p>
                  <p className="text-sm font-medium">
                    {new Date(workshop.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Registration</h4>
              <div className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-gray-500" />
                <a 
                  href={workshop.registrationFormUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 text-sm underline"
                >
                  Open Registration Form
                </a>
              </div>
            </div>

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