"use client";

import React, { useEffect, useMemo, useState } from "react";
import { scheduleData, sessionPlanToDaySchedules } from "@/data/scheduleData";
import type { ScheduleEvent, VenueSchedule } from "@/data/scheduleData";
import { getPlans, getPlan } from "@/services/sessionPlanService";
import { getPdfs, getPreviewUrl, getDownloadUrl } from "@/services/pdfService";
import type { PdfItem } from "@/types/pdfTypes";
import DayTabs from "./DayTabs";
import SearchBox from "./SearchBox";
import VenueColumn from "./VenueColumn";
import ScheduleHero from "./ScheduleHero";
import { Download, FileText, Loader2 } from "lucide-react";

const VENUE_HEADER_COLORS = [
  "bg-[#5c4033] text-white",
  "bg-[#7d5e4a] text-white",
  "bg-[#2d5016] text-white",
];

function filterEventsBySearch(events: ScheduleEvent[], query: string): ScheduleEvent[] {
  if (!query.trim()) return events;
  const q = query.trim().toLowerCase();
  return events.filter((event) => {
    if (event.title?.toLowerCase().includes(q)) return true;
    if (event.director?.toLowerCase().includes(q)) return true;
    if (event.moderator?.toLowerCase().includes(q)) return true;
    if (event.description?.toLowerCase().includes(q)) return true;
    if (event.panelists?.some((p) => p.toLowerCase().includes(q))) return true;
    return false;
  });
}

function filterVenueBySearch(venue: VenueSchedule, query: string): VenueSchedule {
  return {
    ...venue,
    events: filterEventsBySearch(venue.events, query),
  };
}

export default function Schedulepage() {
  const [activeDay, setActiveDay] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [scheduleDays, setScheduleDays] = useState<typeof scheduleData>([]);
  const [loading, setLoading] = useState(true);
  const [schedulePdf, setSchedulePdf] = useState<PdfItem | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const plans = await getPlans(true);
        const planId = plans?.[0]?.id ?? plans?.[0]?._id;
        if (cancelled) return;
        if (planId) {
          const plan = await getPlan(planId);
          if (cancelled) return;
          setScheduleDays(sessionPlanToDaySchedules(plan));
        } else {
          setScheduleDays([]);
        }
      } catch {
        if (!cancelled) setScheduleDays([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    let cancelled = false;
    getPdfs()
      .then((list) => {
        if (cancelled) return;
        const schedule = list?.find((p) =>
          (p.name ?? "").toLowerCase().includes("schedule")
        ) ?? list?.[0] ?? null;
        setSchedulePdf(schedule ?? null);
      })
      .catch(() => {
        if (!cancelled) setSchedulePdf(null);
      });
    return () => { cancelled = true; };
  }, []);

  const displayDays = scheduleDays.length > 0 ? scheduleDays : scheduleData;
  const daysForTabs = displayDays.map((d) => d.day);
  const currentDaySchedule = useMemo(
    () => displayDays.find((d) => d.day === activeDay),
    [displayDays, activeDay]
  );

  const venuesWithSearch = useMemo(() => {
    if (!currentDaySchedule) return [];
    return currentDaySchedule.venues.map((venue) =>
      filterVenueBySearch(venue, searchQuery)
    );
  }, [currentDaySchedule, searchQuery]);

  return (
    <div className="min-h-screen bg-background">
      <ScheduleHero />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              SCHEDULE
            </h1>
            <div className="w-full sm:max-w-xs">
              <SearchBox value={searchQuery} onChange={setSearchQuery} />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
            {schedulePdf ? (
              <>
                <a
                  href={getDownloadUrl(schedulePdf._id)}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-foreground hover:text-primary"
                >
                  <Download className="h-4 w-4" />
                  Download Schedule
                </a>
                <a
                  href={getPreviewUrl(schedulePdf._id)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-destructive hover:underline"
                >
                  <FileText className="h-4 w-4" />
                  View PDF Schedule (PDF)
                </a>
              </>
            ) : (
              <>
                <span className="flex items-center gap-2 text-muted-foreground">
                  <Download className="h-4 w-4" />
                  Download Schedule
                </span>
                <span className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  View PDF Schedule (PDF)
                </span>
              </>
            )}
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading schedule...</span>
          </div>
        ) : (
          <>
            <div className="mb-8 flex justify-center">
              <DayTabs
                days={daysForTabs.length > 0 ? daysForTabs : [1, 2, 3]}
                activeDay={activeDay}
                onDayChange={setActiveDay}
              />
            </div>

            {currentDaySchedule && venuesWithSearch.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-3">
                {venuesWithSearch.map((venue, index) => (
                  <VenueColumn
                    key={venue.venue}
                    venue={venue}
                    colorClass={VENUE_HEADER_COLORS[index] ?? "bg-primary text-primary-foreground"}
                  />
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center py-16 text-muted-foreground">
                <p className="text-center">No data here</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
