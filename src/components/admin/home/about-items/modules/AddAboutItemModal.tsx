"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import DynamicButton from "@/components/common/DynamicButton";
import { useToast } from "@/components/ui/custom-toast";
import { createAboutItem } from "@/services/aboutServices";

const MAX_IMAGES = 10;

interface AddAboutItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddAboutItemModal({ isOpen, onClose, onSuccess }: AddAboutItemModalProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [index, setIndex] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);

  const reset = () => {
    setTitle("");
    setIndex("");
    setSubtitle("");
    setDescription("");
    setImageFiles([]);
  };

  const onFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const combined = [...imageFiles, ...files].slice(0, MAX_IMAGES);
    setImageFiles(combined);
    e.target.value = "";
  };

  const removeFile = (i: number) => {
    setImageFiles((prev) => prev.filter((_, idx) => idx !== i));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast("Title is required", "error");
      return;
    }
    if (imageFiles.length > MAX_IMAGES) {
      showToast(`Maximum ${MAX_IMAGES} images per item`, "error");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      if (index !== "") formData.append("index", String(Number(index) ?? 0));
      if (subtitle.trim()) formData.append("subtitle", subtitle.trim());
      if (description.trim()) formData.append("description", description.trim());
      imageFiles.forEach((file) => formData.append("images", file));
      await createAboutItem(formData);
      showToast("About item created successfully", "success");
      reset();
      onSuccess();
      onClose();
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ?? (e as { message?: string })?.message ?? "Failed to create about item";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add About Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="add-title">Title *</Label>
            <Input
              id="add-title"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="add-index">Index (sort order)</Label>
            <Input
              id="add-index"
              type="number"
              min={0}
              placeholder="0"
              value={index}
              onChange={(e) => setIndex(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="add-subtitle">Subtitle</Label>
            <Input
              id="add-subtitle"
              placeholder="Subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="add-description">Description</Label>
            <Textarea
              id="add-description"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="add-images">Images (optional, max {MAX_IMAGES})</Label>
            <input
              id="add-images"
              type="file"
              accept="image/*"
              multiple
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary file:text-black"
              onChange={onFilesChange}
              disabled={imageFiles.length >= MAX_IMAGES}
            />
            {imageFiles.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {imageFiles.map((file, i) => (
                  <div key={i} className="relative">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${i + 1}`}
                      className="h-16 w-16 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(i)}
                      className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <DynamicButton type="button" variant="outline" onClick={onClose}>
              Cancel
            </DynamicButton>
            <DynamicButton type="submit" loading={loading} loadingText="Saving...">
              Save
            </DynamicButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
