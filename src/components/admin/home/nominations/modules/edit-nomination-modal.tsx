"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DynamicButton from "@/components/common/DynamicButton";
import { useToast } from "@/components/ui/custom-toast";
import { updateNomination } from "@/services/nominationsServices";
import type { Nomination, UpdateNominationPayload } from "@/types/nominationsTypes";

const TYPES: { label: string; value: string }[] = [
  { label: "Short Film", value: "short_film" },
  { label: "Documentary", value: "documentary" },
  { label: "Feature Film", value: "feature_film" },
];

interface EditNominationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  nomination: Nomination | null;
}

export default function EditNominationModal({ isOpen, onClose, onSuccess, nomination }: EditNominationModalProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<UpdateNominationPayload>({ title: "", description: "", type: "short_film", imageFile: null });

  useEffect(() => {
    if (nomination) {
      setForm({ title: nomination.title, description: nomination.description, type: nomination.type, imageFile: null });
    }
  }, [nomination]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomination) return;
    setLoading(true);
    try {
      await updateNomination(nomination._id, form);
      showToast("Nomination updated successfully", "success");
      onSuccess();
    } catch (e) {
      showToast("Failed to update nomination", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader><DialogTitle>Edit Nomination</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <Input placeholder="Title" value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <Textarea placeholder="Description" value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Type</span>
            <Select value={form.type || "short_film"} onValueChange={(v) => setForm({ ...form, type: v })}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                {TYPES.map((t) => (<SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, imageFile: e.target.files?.[0] || null })} />
          <div className="flex justify-end gap-2">
            <DynamicButton type="button" variant="outline" onClick={onClose}>Cancel</DynamicButton>
            <DynamicButton type="submit" loading={loading} loadingText="Saving...">Update</DynamicButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}


