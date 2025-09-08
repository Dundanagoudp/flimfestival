"use client"

import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import DynamicButton from "@/components/common/DynamicButton";
import { useToast } from "@/components/ui/custom-toast";
import type { HomeVideo } from "@/types/homevideosTypes";
import { deleteHomeVideo, getHomeVideos } from "@/services/homevideos";
import { Video } from "lucide-react";
import HomeVideosTable from "./modules/homevideos-table";
import AddHomeVideoModal from "./modules/add-homevideo-modal";
import EditHomeVideoModal from "./modules/edit-homevideo-modal";
import ViewHomeVideoModal from "./modules/view-homevideo-modal";
import DeleteHomeVideoModal from "./modules/delete-homevideo-modal";

export default function HomepageVideosAdmin() {
  const { showToast } = useToast();
  const [items, setItems] = useState<HomeVideo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);

  const [addOpen, setAddOpen] = useState<boolean>(false);
  const [editOpen, setEditOpen] = useState<boolean>(false);
  const [viewOpen, setViewOpen] = useState<boolean>(false);
  const [deleteOpen, setDeleteOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<HomeVideo | null>(null);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return items;
    return items.filter((it) =>
      [it.title, it.description].some((f) => (f || "").toLowerCase().includes(term)),
    );
  }, [items, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
  }, [filtered, currentPage, itemsPerPage]);

  async function load() {
    try {
      setLoading(true);
      const data = await getHomeVideos();
      setItems(Array.isArray(data) ? data : []);
    } catch (error: any) {
      showToast("Failed to load homepage videos", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onAddSuccess = () => {
    setAddOpen(false);
    load();
  };

  const onEdit = (item: HomeVideo) => {
    setSelected(item);
    setEditOpen(true);
  };

  const onView = (item: HomeVideo) => {
    setSelected(item);
    setViewOpen(true);
  };

  const onEditSuccess = () => {
    setEditOpen(false);
    setSelected(null);
    load();
  };

  const onDelete = async (item: HomeVideo) => {
    setSelected(item);
    setDeleteOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mt-4">
        <h2 className="text-xl font-semibold flex items-center gap-2"><Video className="w-5 h-5" /> Homepage Videos</h2>
        <DynamicButton icon={<Video className="w-4 h-4" />} onClick={() => setAddOpen(true)}>
          Add Video
        </DynamicButton>
      </div>

      <Card>
        <CardContent className="p-4">
          <HomeVideosTable
            items={paginated}
            loading={loading}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filtered.length}
            itemsPerPage={itemsPerPage}
          />
        </CardContent>
      </Card>

      <AddHomeVideoModal isOpen={addOpen} onClose={() => setAddOpen(false)} onSuccess={onAddSuccess} />
      <EditHomeVideoModal isOpen={editOpen} onClose={() => setEditOpen(false)} onSuccess={onEditSuccess} item={selected} />
      <ViewHomeVideoModal isOpen={viewOpen} onClose={() => setViewOpen(false)} item={selected} />
      <DeleteHomeVideoModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        item={selected}
        onSuccess={() => {
          setDeleteOpen(false);
          setSelected(null);
          load();
        }}
      />
    </div>
  );
}
