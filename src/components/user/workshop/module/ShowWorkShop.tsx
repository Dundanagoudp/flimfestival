"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { Workshop } from "@/types/workshop-Types";
import type { GroupedWorkshopsResponse } from "@/types/workshop-Types";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { getWorkshopsGrouped } from "@/services/workshop-Services";
import Link from "next/link";
import Image from "next/image";
import Reveal from "@/components/common/Reveal";
import { LoadingSpinner } from "@/components/common/LoaderSpinner";
import { getMediaUrl } from "@/utils/media";
import { sanitizeUrl } from "@/lib/sanitize";

const ITEMS_PER_PAGE = 5;
const SHOW_PAGINATION_WHEN_MORE_THAN = 5;

export default function ShowWorkShop() {
  const [grouped, setGrouped] = useState<GroupedWorkshopsResponse>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTabId, setActiveTabId] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    getWorkshopsGrouped()
      .then((res) => {
        if (!cancelled) {
          const list = Array.isArray(res) ? res : [];
          setGrouped(list);
          const firstId = list[0] ? (list[0].category?._id ?? "uncategorized") : "";
          setActiveTabId(firstId);
          setCurrentPage(1);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err?.message || "Failed to load workshops");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const tabs = useMemo(() => {
    return grouped.map((g) => ({
      id: g.category?._id ?? "uncategorized",
      name: g.category?.name ?? "Uncategorized",
    }));
  }, [grouped]);

  const workshopsForTab = useMemo(() => {
    const group = grouped.find(
      (g) => (g.category?._id ?? "uncategorized") === activeTabId
    );
    return group?.workshops ?? [];
  }, [grouped, activeTabId]);

  const totalPages = Math.max(1, Math.ceil(workshopsForTab.length / ITEMS_PER_PAGE));
  const pageStart = (currentPage - 1) * ITEMS_PER_PAGE;
  const pageWorkshops = workshopsForTab.slice(pageStart, pageStart + ITEMS_PER_PAGE);

  const onTabChange = (tabId: string) => {
    setActiveTabId(tabId);
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    setCurrentPage(page);
    gridRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (loading) {
    return (
      <main className="w-full min-h-[400px] flex items-center justify-center bg-[#EEEEEE]">
        <LoadingSpinner />
      </main>
    );
  }

  if (error) {
    return (
      <main className="w-full px-4 py-12 bg-[#EEEEEE]">
        <div className="max-w-4xl mx-auto text-center text-red-600">{error}</div>
      </main>
    );
  }

  const hasAny = grouped.some((g) => g.workshops.length > 0);
  if (!hasAny) {
    return (
      <main className="w-full px-4 py-12 bg-[#EEEEEE]">
        <div className="max-w-4xl mx-auto text-center text-gray-600">No workshops available</div>
      </main>
    );
  }

  return (
    <main className="w-full bg-[#EEEEEE]">
      {/* Category tabs */}
      {tabs.length > 0 && (
        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex flex-wrap justify-center gap-3">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`min-h-[52px] px-6 py-3.5 rounded-full text-sm font-semibold transition-all flex items-center justify-center ${
                    activeTabId === tab.id
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-gray-200 text-gray-800 border border-gray-300 hover:bg-gray-300 hover:border-gray-400"
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Workshop grid with cover-image cards – scrollable when many items */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 md:py-12 overflow-auto">
        {pageWorkshops.length === 0 ? (
          <p className="text-center text-gray-600 py-12">No workshops in this category.</p>
        ) : (
          <div ref={gridRef} className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 scroll-mt-4">
            {pageWorkshops.map((workshop: Workshop) => (
              <Reveal
                key={workshop._id}
                delay={0.05}
                y={12}
                transition={{ type: "spring", stiffness: 90, damping: 18, mass: 0.8 }}
              >
                <Card className="overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 bg-white border-0">
                  {/* Cover image – fills container, object-cover so image always covers area */}
                  <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100 min-h-[200px]">
                    <Image
                      src={getMediaUrl(workshop?.imageUrl) || "/event.png"}
                      alt={workshop?.name || "Workshop"}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover object-center"
                      unoptimized
                    />
                  </div>
                  <CardContent className="p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                      {workshop?.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">{workshop?.about}</p>
                    <Link
                      href={sanitizeUrl(workshop?.registrationFormUrl || "") || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full"
                    >
                      <Button className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
                        Register
                        <ArrowRight className="h-4 w-4 shrink-0" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        )}

        {/* Pagination – only when more than 5 items */}
        {workshopsForTab.length > SHOW_PAGINATION_WHEN_MORE_THAN && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10 flex-wrap">
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(Math.max(1, currentPage - 1))}
              disabled={currentPage <= 1}
              className="h-10 w-10 rounded-full shrink-0"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <span className="text-sm font-medium text-gray-700 px-4">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage >= totalPages}
              className="h-10 w-10 rounded-full shrink-0"
              aria-label="Next page"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
