"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import DynamicButton from "@/components/common/DynamicButton";
import { useToast } from "@/components/ui/custom-toast";
import type { TickerAnnouncement } from "@/types/tickerTypes";
import {
  getTickerAnnouncements,
  deleteTickerAnnouncement,
} from "@/services/tickerService";
import TickerAnnouncementsTable from "./modules/TickerAnnouncementsTable";
import AddTickerModal from "./modules/AddTickerModal";
import EditTickerModal from "./modules/EditTickerModal";
import { ListPlus } from "lucide-react";

const ITEMS_PER_PAGE = 10;

export default function TickerAnnouncementsPage() {
  const { showToast } = useToast();
  const [items, setItems] = useState<TickerAnnouncement[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selected, setSelected] = useState<TickerAnnouncement | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getTickerAnnouncements();
      const sorted = [...data].sort((a, b) => a.order - b.order);
      setItems(sorted);
    } catch (e) {
      showToast((e as Error)?.message ?? "Failed to load ticker announcements", "error");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return items.slice(start, start + ITEMS_PER_PAGE);
  }, [items, currentPage]);

  const onDelete = async (item: TickerAnnouncement) => {
    try {
      await deleteTickerAnnouncement(item._id);
      showToast("Ticker announcement deleted", "success");
      await load();
      if (paginatedItems.length === 1 && currentPage > 1) {
        setCurrentPage((p) => p - 1);
      }
    } catch (e) {
      showToast((e as Error)?.message ?? "Delete failed", "error");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mt-4">
        <h2 className="text-xl font-semibold">Ticker Announcements</h2>
        <DynamicButton onClick={() => setIsAddOpen(true)} iconPosition="left">
          <ListPlus style={{ color: "white" }} /> Add
        </DynamicButton>
      </div>

      <Card>
        <CardContent className="p-4 space-y-4">
          <TickerAnnouncementsTable
            items={paginatedItems}
            loading={loading}
            onEdit={(item) => {
              setSelected(item);
              setIsEditOpen(true);
            }}
            onDelete={onDelete}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={totalItems}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </CardContent>
      </Card>

      <AddTickerModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={() => {
          setIsAddOpen(false);
          load();
        }}
      />

      <EditTickerModal
        isOpen={isEditOpen}
        item={selected}
        onClose={() => {
          setIsEditOpen(false);
          setSelected(null);
        }}
        onSuccess={() => {
          setIsEditOpen(false);
          setSelected(null);
          load();
        }}
      />
    </div>
  );
}
