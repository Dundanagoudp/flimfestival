"use client"

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import DynamicButton from "@/components/common/DynamicButton";
import { useToast } from "@/components/ui/custom-toast";
import { updateHomeVideo } from "@/services/homevideos";
import type { HomeVideo } from "@/types/homevideosTypes";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  item: HomeVideo | null;
}

export default function EditHomeVideoModal({ isOpen, onClose, onSuccess, item }: Props) {
  const { showToast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTitle(item?.title || "");
    setDescription(item?.description || "");
    setFile(null);
  }, [item]);

  const handleSubmit = async () => {
    if (!item) return;
    try {
      setLoading(true);
      await updateHomeVideo(item._id, {
        title,
        description,
        video: file || undefined,
      });
      showToast("Updated", "success");
      onSuccess();
    } catch (error: any) {
      showToast("Update failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Homepage Video</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <Input type="file" accept="video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <div className="flex justify-end">
            <DynamicButton loading={loading} onClick={handleSubmit}>
              Save Changes
            </DynamicButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}