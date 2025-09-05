"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import DynamicButton from "@/components/common/DynamicButton";
import type { Submission } from "@/types/submission";
import { updateSubmissionById } from "@/services/submisionService";
import { useToast } from "@/hooks/use-toast";

interface EditSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  submission: Submission | null;
}

export default function EditSubmissionModal({ isOpen, onClose, onSuccess, submission }: EditSubmissionModalProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    videoType: "Short Film" as "Short Film" | "Documentary",
    message: "",
  });

  useEffect(() => {
    if (submission) {
      setForm({
        fullName: submission.fullName,
        email: submission.email,
        phone: submission.phone,
        videoType: submission.videoType,
        message: submission.message,
      });
    }
  }, [submission]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submission) return;
    setLoading(true);
    try {
      await updateSubmissionById(submission._id, form);
      showToast("Submission updated", "success");
      onSuccess();
      onClose();
    } catch (e) {
      showToast("Failed to update submission", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle>Edit Submission</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="fullName">Full Name *</Label>
            <Input id="fullName" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="phone">Phone *</Label>
              <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            </div>
          </div>
          <div>
            <Label htmlFor="videoType">Video Type *</Label>
            <Input id="videoType" value={form.videoType} onChange={(e) => setForm({ ...form, videoType: e.target.value as any })} required />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
            <DynamicButton type="submit" loading={loading}>Update</DynamicButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

