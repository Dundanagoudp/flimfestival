"use client"

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import DynamicButton from "@/components/common/DynamicButton";
import { useToast } from "@/components/ui/custom-toast";
import { createHomeVideo } from "@/services/homevideos";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddHomeVideoModal({ isOpen, onClose, onSuccess }: Props) {
  const { showToast } = useToast();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!file) {
      showToast("Select a video file", "error");
      return;
    }
    try {
      setLoading(true);
      await createHomeVideo({ title, description, video: file });
      showToast("Created", "success");
      onSuccess();
      setTitle("");
      setDescription("");
      setFile(null);
    } catch (error: any) {
      showToast("Create failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Homepage Video</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
          <Input type="file" accept="video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <div className="flex justify-end">
            <DynamicButton loading={loading} onClick={handleSubmit}>
              Save
            </DynamicButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}