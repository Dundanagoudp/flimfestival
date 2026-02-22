"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import DynamicButton from "@/components/common/DynamicButton";
import { useToast } from "@/components/ui/custom-toast";
import type { AboutItem } from "@/types/aboutTypes";
import { deleteAboutItem, getAboutItems } from "@/services/aboutServices";
import AboutItemsTable from "./modules/about-items-table";
import AddAboutItemModal from "./modules/AddAboutItemModal";
import EditAboutItemModal from "./modules/EditAboutItemModal";
import ViewAboutItemModal from "./modules/ViewAboutItemModal";
import { ListPlus } from "lucide-react";

const MAX_ITEMS = 10;

export default function AboutItemsPage() {
  const { showToast } = useToast();
  const [items, setItems] = useState<AboutItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selected, setSelected] = useState<AboutItem | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getAboutItems();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      showToast("Failed to load about items", "error");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onDelete = async (item: AboutItem) => {
    try {
      await deleteAboutItem(item.id);
      showToast("About item deleted", "success");
      await load();
    } catch (e: unknown) {
      const msg = (e as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ?? (e as { message?: string })?.message ?? "Failed to delete";
      showToast(msg, "error");
    }
  };

  const canAdd = items.length < MAX_ITEMS;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mt-4">
        <h2 className="text-xl font-semibold">About Items</h2>
        <DynamicButton
          onClick={() => setIsAddOpen(true)}
          disabled={!canAdd}
          iconPosition="left"
          title={!canAdd ? `Maximum ${MAX_ITEMS} items allowed` : undefined}
        >
          <ListPlus style={{ color: "white" }} /> Add
        </DynamicButton>
      </div>
      {!canAdd && (
        <p className="text-sm text-amber-600">Maximum {MAX_ITEMS} about items allowed. Delete one to add more.</p>
      )}

      <Card>
        <CardContent className="p-4 space-y-4">
          <AboutItemsTable
            items={items}
            loading={loading}
            onView={(item) => {
              setSelected(item);
              setIsViewOpen(true);
            }}
            onEdit={(item) => {
              setSelected(item);
              setIsEditOpen(true);
            }}
            onDelete={onDelete}
          />
        </CardContent>
      </Card>

      <AddAboutItemModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={() => {
          setIsAddOpen(false);
          load();
        }}
      />

      <EditAboutItemModal
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

      <ViewAboutItemModal
        isOpen={isViewOpen}
        item={selected}
        onClose={() => {
          setIsViewOpen(false);
          setSelected(null);
        }}
      />
    </div>
  );
}
