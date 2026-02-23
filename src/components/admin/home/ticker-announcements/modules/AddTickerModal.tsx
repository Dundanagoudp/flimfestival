"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DynamicButton from "@/components/common/DynamicButton";
import { useToast } from "@/components/ui/custom-toast";
import { createTickerAnnouncement } from "@/services/tickerService";

interface AddTickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddTickerModal({ isOpen, onClose, onSuccess }: AddTickerModalProps) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState("");
  const [order, setOrder] = useState("0");

  useEffect(() => {
    if (isOpen) {
      setText("");
      setOrder("0");
    }
  }, [isOpen]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      showToast("Text is required", "error");
      return;
    }
    setLoading(true);
    try {
      await createTickerAnnouncement({
        text: text.trim(),
        order: Number(order) || 0,
      });
      showToast("Ticker announcement created", "success");
      onSuccess();
      onClose();
    } catch (e) {
      showToast((e as Error)?.message ?? "Create failed", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !loading && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Ticker Announcement</DialogTitle>
        </DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="add-ticker-text">Text</Label>
            <Input
              id="add-ticker-text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. View List of Winning Films..."
              required
              disabled={loading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="add-ticker-order">Order</Label>
            <Input
              id="add-ticker-order"
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
              Create
            </DynamicButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
