"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import DynamicButton from "@/components/common/DynamicButton";
import type { AdminContactItem, UpdateAdminContactPayload } from "@/types/adminContactTypes";

interface EditContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: UpdateAdminContactPayload) => void;
  item: AdminContactItem | null;
}

export default function EditContactModal({ isOpen, onClose, onSubmit, item }: EditContactModalProps) {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<UpdateAdminContactPayload>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    resolved: false,
  });

  useEffect(() => {
    if (item) {
      setForm({
        name: item.name,
        email: item.email,
        phone: item.phone,
        subject: item.subject,
        message: item.message,
        resolved: item.resolved,
      });
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(form);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setForm({ name: "", email: "", phone: "", subject: "", message: "", resolved: false });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Edit Contact</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" value={form.subject || ""} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
            </div>
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea id="message" rows={4} value={form.message || ""} onChange={(e) => setForm({ ...form, message: e.target.value })} />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="resolved"
              type="checkbox"
              checked={!!form.resolved}
              onChange={(e) => setForm({ ...form, resolved: e.target.checked })}
            />
            <label htmlFor="resolved" className="text-sm">Mark as resolved</label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <DynamicButton type="submit" loading={loading}>
              Update Contact
            </DynamicButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

