"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DynamicButton from "@/components/common/DynamicButton";
import { useToast } from "@/components/ui/custom-toast";
import { updateTickerAnnouncement } from "@/services/tickerService";
import type { TickerAnnouncement } from "@/types/tickerTypes";

interface EditTickerModalProps {
  isOpen: boolean;
  item: TickerAnnouncement | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditTickerModal({ isOpen, item, onClose, onSuccess }: EditTickerModalProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [order, setOrder] = useState("0");

  useEffect(() => {
    if (item) {
      setText(item.text);
      setOrder(String(item.order));
    }
  }, [item, isOpen]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;
    if (!text.trim()) {
      showToast("Text is required", "error");
      return;
    }
    setLoading(true);
    try {
      await updateTickerAnnouncement(item._id, {
        text: text.trim(),
        order: Number(order) || 0,
      });
      showToast("Ticker announcement updated", "success");
      onSuccess();
      onClose();
    } catch (e) {
      showToast((e as Error)?.message ?? "Update failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !loading && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Ticker Announcement</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-ticker-text">Text</Label>
            <Input
              id="edit-ticker-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-ticker-order">Order</Label>
            <Input
              id="edit-ticker-order"
              type="number"
              value={order}
              onChange={(e) => setOrder(e.target.value)}
              disabled={loading}
            />
          </div>
          <div className="flex justify-end gap-2">
            <DynamicButton type="button" variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </DynamicButton>
            <DynamicButton type="submit" loading={loading}>
              Save
            </DynamicButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
