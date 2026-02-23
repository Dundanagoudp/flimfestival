"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DynamicButton from "@/components/common/DynamicButton";
import { useToast } from "@/components/ui/custom-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getHeroBanner, createHeroBanner, updateHeroBanner, deleteHeroBanner } from "@/services/heroBannerService";
import type { HeroBanner } from "@/types/heroBannerTypes";
import { getMediaUrl } from "@/utils/media";
import { Loader2, Trash2 } from "lucide-react";

export default function HeroBannerPage() {
  const { showToast } = useToast();
  const [hero, setHero] = useState<HeroBanner | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getHeroBanner();
      setHero(data ?? null);
      if (data) {
        setTitle(data.title);
        setSubtitle(data.subtitle);
      } else {
        setTitle("");
        setSubtitle("");
      }
      setVideoFile(null);
    } catch (e) {
      showToast((e as Error)?.message ?? "Failed to load hero banner", "error");
      setHero(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (hero) {
        const updated = await updateHeroBanner({
          _id: hero._id,
          title,
          subtitle,
          video: videoFile ?? undefined,
        });
        setHero(updated);
        showToast("Hero banner updated", "success");
      } else {
        const created = await createHeroBanner({
          title,
          subtitle,
          video: videoFile ?? undefined,
        });
        setHero(created);
        showToast("Hero banner created", "success");
      }
      setVideoFile(null);
      await load();
    } catch (e) {
      showToast((e as Error)?.message ?? "Save failed", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteHeroBanner();
      setHero(null);
      setTitle("");
      setSubtitle("");
      setVideoFile(null);
      showToast("Hero banner deleted", "success");
      setDeleteConfirmOpen(false);
    } catch (e) {
      showToast((e as Error)?.message ?? "Delete failed", "error");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Hero Banner</h2>
        {hero && (
          <DynamicButton variant="destructive" size="sm" onClick={() => setDeleteConfirmOpen(true)}>
            <Trash2 className="h-4 w-4" /> Delete
          </DynamicButton>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{hero ? "Edit Hero Banner" : "Create Hero Banner"}</CardTitle>
          <CardDescription>
            Set the main hero title, subtitle (e.g. date line), and optional background video for the home page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="hero-title">Title</Label>
              <Input
                id="hero-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. 11th ARUNACHAL FILM FESTIVAL"
                required
                disabled={saving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-subtitle">Subtitle</Label>
              <Input
                id="hero-subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                placeholder="e.g. 6TH – 8TH FEBRUARY, 2026"
                required
                disabled={saving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hero-video">Video (optional)</Label>
              <Input
                id="hero-video"
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
                disabled={saving}
              />
              {hero?.video && !videoFile && (
                <p className="text-sm text-muted-foreground">
                  Current video: {hero.video}
                  <br />
                  <video
                    src={getMediaUrl(hero.video)}
                    className="mt-2 max-h-40 rounded-md border"
                    controls
                    muted
                    playsInline
                  />
                </p>
              )}
              {videoFile && <p className="text-sm text-muted-foreground">New file: {videoFile.name}</p>}
            </div>
            <DynamicButton type="submit" loading={saving}>
              {hero ? "Update" : "Create"}
            </DynamicButton>
          </form>
        </CardContent>
      </Card>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete hero banner?</DialogTitle>
            <DialogDescription>
              The home page will fall back to default hero content. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DynamicButton variant="outline" onClick={() => setDeleteConfirmOpen(false)} disabled={deleting}>
              Cancel
            </DynamicButton>
            <DynamicButton variant="destructive" onClick={handleDelete} loading={deleting}>
              Delete
            </DynamicButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
