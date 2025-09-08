"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import DynamicButton from "@/components/common/DynamicButton";
import { useToast } from "@/components/ui/custom-toast";
import { createNomination } from "@/services/nominationsServices";
import type { CreateNominationPayload } from "@/types/nominationsTypes";

const TYPES: { label: string; value: string }[] = [
  { label: "Short Film", value: "short_film" },
  { label: "Documentary", value: "documentary" },
  { label: "Feature Film", value: "feature_film" },
];

interface AddNominationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddNominationModal({ isOpen, onClose, onSuccess }: AddNominationModalProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<CreateNominationPayload>({ title: "", description: "", type: "short_film", imageFile: null });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createNomination(form);
      showToast("Nomination created successfully", "success");
      onSuccess();
      setForm({ title: "", description: "", type: "short_film", imageFile: null });
    } catch (e) {
      showToast("Failed to create nomination", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader><DialogTitle>Add Nomination</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <Textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Type</span>
            <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
              <SelectTrigger className="w-40"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                {TYPES.map((t) => (<SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>))}
              </SelectContent>
            </Select>
          </div>
          <input type="file" accept="image/*" onChange={(e) => setForm({ ...form, imageFile: e.target.files?.[0] || null })} />
          <div className="flex justify-end gap-2">
            <DynamicButton type="button" variant="outline" onClick={onClose}>Cancel</DynamicButton>
            <DynamicButton type="submit" loading={loading} loadingText="Saving...">Save</DynamicButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}


