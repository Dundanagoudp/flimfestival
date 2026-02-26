"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { getWorkshopsGrouped } from "@/services/workshop-Services";
import type { GroupedWorkshopsResponse } from "@/types/workshop-Types";
import { getMediaUrl } from "@/utils/media";
import { sanitizeUrl } from "@/lib/sanitize";
import { LoadingSpinner } from "@/components/common/LoaderSpinner";
import { Button } from "@/components/ui/button";

type TabItem = { id: string; name: string };

const WorksSection = () => {
  const [grouped, setGrouped] = useState<GroupedWorkshopsResponse>([]);
  const [loading, setLoading] = useState(true);
  const [activeTabId, setActiveTabId] = useState<string>("");
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;
    getWorkshopsGrouped()
      .then((data) => {
        if (!cancelled) {
          const list = Array.isArray(data) ? data : [];
          setGrouped(list);
          setActiveIndex(0);
          const firstId = list[0]
            ? (list[0].category?._id ?? "uncategorized")
            : "";
          setActiveTabId(firstId);
        }
      })
      .catch(() => {
        if (!cancelled) setGrouped([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const tabs: TabItem[] = useMemo(() => {
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

  const works = workshopsForTab.map((w) => {
    const regUrl = sanitizeUrl(w.registrationFormUrl || "") || "";
    return {
      image: getMediaUrl(w.imageUrl) || "/placeholder.svg",
      title: w.name || "Workshop",
      id: w._id,
      href: regUrl || "/workshop",
    };
  });

  const prev = () => setActiveIndex((i) => (i - 1 + works.length) % Math.max(works.length, 1));
  const next = () => setActiveIndex((i) => (i + 1) % Math.max(works.length, 1));

  const onTabChange = (tabId: string) => {
    setActiveTabId(tabId);
    setActiveIndex(0);
  };

  const getOffset = (index: number) => {
    if (works.length === 0) return 0;
    let diff = index - activeIndex;
    if (diff > Math.floor(works.length / 2)) diff -= works.length;
    if (diff < -Math.floor(works.length / 2)) diff += works.length;
    return diff;
  };

  if (loading) {
    return (
      <section className="w-full px-4 sm:px-6 py-12 sm:py-16 bg-background overflow-hidden">
        <div className="text-center mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary">
            Workshop and Master Class
          </h2>
          <div className="mx-auto mt-2 h-0.5 w-16 bg-accent rounded-full" />
        </div>
        <div className="flex items-center justify-center min-h-[320px] sm:min-h-[420px]">
          <LoadingSpinner />
        </div>
      </section>
    );
  }

  if (works.length === 0 && tabs.length <= 1) {
    return null;
  }

  return (
    <section className="w-full px-4 sm:px-6 py-12 sm:py-16 bg-background overflow-hidden">
      <div className="text-center mb-8 sm:mb-10 max-w-4xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary leading-tight">
          Workshop and Master Class
        </h2>
        <div className="mx-auto mt-2 h-0.5 w-16 bg-accent rounded-full" />
        <div className="flex justify-center mt-4 sm:mt-6">
          <Button asChild variant="default" className="rounded-full gap-2 text-sm sm:text-base">
            <Link href="/workshop">
              View all
              <ArrowRight className="w-4 h-4 shrink-0" />
            </Link>
          </Button>
        </div>
      </div>

      {tabs.length > 1 && (
        <div className="flex justify-center gap-3 mb-6 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`min-h-[52px] px-5 py-3.5 rounded-full text-sm font-semibold transition-all flex items-center justify-center ${
                activeTabId === tab.id
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground border border-border hover:bg-muted/80"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      )}

      <div className="relative flex items-center justify-center min-h-[420px] md:min-h-[500px]">
        {works.length === 0 ? (
          <p className="text-muted-foreground text-sm">No workshops in this category.</p>
        ) : (
          <>
            {works.map((work, index) => {
              const offset = getOffset(index);
              const isActive = offset === 0;
              const absOffset = Math.abs(offset);

              if (absOffset > 2) return null;

              return (
                <div
                  key={work.id}
                  className="absolute transition-all duration-500 ease-out"
                  style={{
                    transform: `translateX(${offset * 260}px) scale(${isActive ? 1 : 0.8 - absOffset * 0.05})`,
                    zIndex: 10 - absOffset,
                    opacity: absOffset > 1 ? 0.5 : 1,
                    filter: isActive ? "none" : "brightness(0.7)",
                  }}
                >
                  <Link
                    href={work.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block cursor-pointer rounded-xl overflow-hidden shadow-2xl transition-shadow duration-500 hover:shadow-[0_20px_60px_-10px_hsl(var(--primary)/0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    style={{ width: isActive ? 340 : 280, height: isActive ? 400 : 350 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div
                      className={`relative w-full h-full rounded-xl ${
                        isActive ? "shadow-[0_20px_60px_-10px_hsl(var(--primary)/0.3)]" : ""
                      }`}
                    >
                        <img
                          src={work.image}
                          alt={work.title}
                          className="w-full h-full object-cover object-center"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                          }}
                        />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                        <h3 className="text-lg font-semibold text-white">{work.title}</h3>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
            <button
              onClick={prev}
              className="absolute left-4 md:left-12 z-20 flex items-center justify-center h-12 w-12 min-h-[48px] min-w-[48px] rounded-full bg-card/80 backdrop-blur border border-border hover:bg-card transition-colors"
              aria-label="Previous"
            >
              <ChevronLeft className="w-6 h-6 text-foreground shrink-0" />
            </button>
            <button
              onClick={next}
              className="absolute right-4 md:right-12 z-20 flex items-center justify-center h-12 w-12 min-h-[48px] min-w-[48px] rounded-full bg-card/80 backdrop-blur border border-border hover:bg-card transition-colors"
              aria-label="Next"
            >
              <ChevronRight className="w-6 h-6 text-foreground shrink-0" />
            </button>
          </>
        )}
      </div>

      {works.length > 0 && (
      <div className="flex justify-center gap-2 mt-6">
        {works.map((_, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === activeIndex ? "bg-primary w-6" : "bg-muted-foreground/30"
            }`}
          />
        ))}
      </div>
      )}
    </section>
  );
};

export default WorksSection;
