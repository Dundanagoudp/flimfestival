"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import DynamicButton from "@/components/common/DynamicButton";
import { useToast } from "@/components/ui/custom-toast";
import { updateAboutItem } from "@/services/aboutServices";
import type { AboutItem } from "@/types/aboutTypes";
import { getMediaUrl } from "@/utils/media";

const MAX_IMAGES = 10;

interface EditAboutItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  item: AboutItem | null;
}

export default function EditAboutItemModal({ isOpen, onClose, onSuccess, item }: EditAboutItemModalProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [index, setIndex] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [description, setDescription] = useState("");
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [removeIndices, setRemoveIndices] = useState<number[]>([]);

  const currentImages = item?.images ?? [];

  useEffect(() => {
    if (item) {
      setTitle(item.title);
      setIndex(String(item.index));
      setSubtitle(item.subtitle ?? "");
      setDescription(item.description ?? "");
      setNewFiles([]);
      setRemoveIndices([]);
    }
  }, [item]);

  const onAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    const kept = currentImages.filter((_, i) => !removeIndices.includes(i));
    const total = kept.length + newFiles.length + files.length;
    const toAdd = files.slice(0, Math.max(0, MAX_IMAGES - total));
    setNewFiles((prev) => [...prev, ...toAdd].slice(0, MAX_IMAGES));
    e.target.value = "";
  };

  const removeNewFile = (i: number) => {
    setNewFiles((prev) => prev.filter((_, idx) => idx !== i));
  };

  const toggleRemoveCurrent = (i: number) => {
    setRemoveIndices((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i].sort((a, b) => a - b)));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;
    if (!title.trim()) {
      showToast("Title is required", "error");
      return;
    }
    const keptCount = currentImages.length - removeIndices.length;
    if (keptCount + newFiles.length > MAX_IMAGES) {
      showToast(`Maximum ${MAX_IMAGES} images per item`, "error");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("index", String(Number(index) ?? 0));
      if (subtitle.trim()) formData.append("subtitle", subtitle.trim());
      formData.append("description", description);
      removeIndices.forEach((i) => formData.append("removeImageIndex", String(i)));
      newFiles.forEach((file) => formData.append("images", file));
      await updateAboutItem(item.id, formData);
      showToast("About item updated successfully", "success");
      onSuccess();
      onClose();
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ?? (e as { message?: string })?.message ?? "Failed to update about item";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const keptCount = currentImages.length - removeIndices.length;
  const canAddMore = keptCount + newFiles.length < MAX_IMAGES;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit About Item</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <Label htmlFor="edit-title">Title *</Label>
            <Input
              id="edit-title"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <Label htmlFor="edit-index">Index (sort order)</Label>
            <Input
              id="edit-index"
              type="number"
              min={0}
              placeholder="0"
              value={index}
              onChange={(e) => setIndex(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="edit-subtitle">Subtitle</Label>
            <Input
              id="edit-subtitle"
              placeholder="Subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div>
            <Label>Images (max {MAX_IMAGES} total)</Label>
            <p className="text-xs text-gray-500 mb-2">Current images — click to mark for removal</p>
            {currentImages.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-2">
                {currentImages.map((url, i) => {
                  const marked = removeIndices.includes(i);
                  return (
                    <div key={i} className="relative">
                      <button
                        type="button"
                        onClick={() => toggleRemoveCurrent(i)}
                        className={`block border-2 rounded overflow-hidden ${marked ? "border-red-500 opacity-60" : "border-gray-200"}`}
                      >
                        <img
                          src={getMediaUrl(url)}
                          alt={`Current ${i + 1}`}
                          className="h-20 w-20 object-cover"
                        />
                      </button>
                      {marked && (
                        <span className="absolute bottom-0 left-0 right-0 bg-red-500 text-white text-xs text-center py-0.5">
                          Remove
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-gray-500 mb-2">No images yet.</p>
            )}
            {newFiles.length > 0 && (
              <>
                <p className="text-xs text-gray-500 mb-1">New images (will be added)</p>
                <div className="flex flex-wrap gap-2 mb-2">
                  {newFiles.map((file, i) => (
                    <div key={`new-${i}`} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`New ${i + 1}`}
                        className="h-20 w-20 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewFile(i)}
                        className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
            <Label htmlFor="edit-add-images" className="text-primary cursor-pointer">
              Add more images
            </Label>
            <input
              id="edit-add-images"
              type="file"
              accept="image/*"
              multiple
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary file:text-black mt-1"
              onChange={onAddFiles}
              disabled={!canAddMore}
            />
          </div>
          <div className="flex justify-end gap-2">
            <DynamicButton type="button" variant="outline" onClick={onClose}>
              Cancel
            </DynamicButton>
            <DynamicButton type="submit" loading={loading} loadingText="Saving...">
              Update
            </DynamicButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
