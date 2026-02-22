"use client";

import React, { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight, Clock, MapPin, Film, Users, ArrowRight } from "lucide-react";
import {
  scheduleData,
  sessionPlanToDaySchedules,
  type DaySchedule,
  type ScheduleEvent,
  type VenueSchedule,
} from "@/data/scheduleData";
import { getPlans, getPlan } from "@/services/sessionPlanService";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";

function parseTimeForSort(t: string): number {
  const m = t.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
  if (!m) return 0;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const ampm = (m[3] || "").toUpperCase();
  if (ampm === "PM" && h !== 12) h += 12;
  if (ampm === "AM" && h === 12) h = 0;
  return h * 60 + min;
}

function getEventsForVenue(
  day: DaySchedule | undefined,
  venueIndex: number
): ScheduleEvent[] {
  if (!day?.venues?.[venueIndex]) return [];
  return [...day.venues[venueIndex].events].sort(
    (a, b) => parseTimeForSort(a.time) - parseTimeForSort(b.time)
  );
}

function getEventIcon(event: ScheduleEvent) {
  if (event.director) return <Film className="h-3.5 w-3.5" />;
  if (event.moderator) return <Users className="h-3.5 w-3.5" />;
  return <Clock className="h-3.5 w-3.5" />;
}

export default function ScheduleSection() {
  const [scheduleDays, setScheduleDays] = useState<DaySchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDay, setActiveDay] = useState(1);
  const [activeScreenIndex, setActiveScreenIndex] = useState(0);

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
    return () => {
      cancelled = true;
    };
  }, []);

  const displayDays =
    scheduleDays.length > 0 ? scheduleDays : scheduleData;
  const daysForTabs = displayDays.slice(0, 3);
  const currentDaySchedule = useMemo(
    () => displayDays.find((d) => d.day === activeDay),
    [displayDays, activeDay]
  );

  const screensForDay = useMemo(
    () => currentDaySchedule?.venues ?? [],
    [currentDaySchedule]
  );

  useEffect(() => {
    if (activeScreenIndex >= screensForDay.length) {
      setActiveScreenIndex(0);
    }
  }, [activeDay, screensForDay.length, activeScreenIndex]);

  const eventsForScreen = useMemo(
    () => getEventsForVenue(currentDaySchedule, activeScreenIndex),
    [currentDaySchedule, activeScreenIndex]
  );

  if (loading) {
    return (
      <section className="relative overflow-hidden bg-background pt-12 md:pt-16 pb-0">
        <div className="container relative mx-auto max-w-6xl px-4">
          <div className="flex items-center justify-center gap-2 py-20 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Loading schedule...</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-background pt-12 md:pt-16 pb-0">
      <div className="container relative mx-auto max-w-6xl px-4">
        {/* Header */}
        <div className="mb-12 text-center md:mb-16">
          <p className="mb-3 font-body text-sm font-semibold uppercase tracking-[0.2em] text-accent">
            Arunachal Film Festival
          </p>
          <h2 className="font-display text-4xl font-bold text-foreground md:text-5xl lg:text-6xl">
            Schedule 2026
          </h2>
          <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-accent" />
          <div className="mt-6 flex items-center justify-center gap-2">
            <Link href="/schedules">
              <Button className="rounded-full bg-primary text-black hover:bg-yellow-300 hover:scale-105 hover:shadow-lg transition-all duration-200 ease-out text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2 h-auto">
                View full schedule
              </Button>
            </Link>
            <Link
              href="/schedules"
              className="inline-flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-primary hover:opacity-90 transition-opacity"
            >
              <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 text-black" />
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:flex-row lg:gap-12">
          {/* Day tabs - horizontal scroll on mobile, column on desktop */}
          <div className="-mx-4 px-4 lg:mx-0 lg:px-0">
            <div className="flex flex-row gap-3 overflow-x-auto pb-2 scrollbar-hide lg:flex-col lg:gap-4 lg:overflow-visible lg:pb-0 lg:pt-2">
              {daysForTabs.map((d) => {
                const isActive = activeDay === d.day;
                return (
                  <button
                    key={d.day}
                    onClick={() => {
                      setActiveDay(d.day);
                      setActiveScreenIndex(0);
                    }}
                    className={`group flex min-w-[140px] shrink-0 flex-col items-start rounded-xl px-5 py-4 text-left transition-all duration-300 lg:min-w-[160px] ${
                      isActive
                        ? "bg-primary text-white shadow-elevated"
                        : "border border-border bg-card text-card-foreground shadow-card hover:shadow-elevated"
                    }`}
                  >
                    <div className="flex w-full items-center justify-between gap-2">
                      <span className="font-display text-lg font-bold">
                        Day {d.day}
                      </span>
                      <ChevronRight
                        className={`h-4 w-4 shrink-0 transition-transform duration-300 ${isActive ? "translate-x-0.5 text-white" : "group-hover:translate-x-0.5"}`}
                      />
                    </div>
                    <span
                      className={`mt-1 font-body text-xs ${isActive ? "text-white/90" : "text-muted-foreground"}`}
                    >
                      {d.date}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right content */}
          <div className="flex-1">
            {/* Venue sub-tabs - single row, horizontal scroll on mobile */}
            {screensForDay.length > 0 && (
              <div className="-mx-4 mb-6 flex flex-nowrap gap-2 overflow-x-auto px-4 pb-2 scrollbar-hide sm:mx-0 sm:px-0">
                {screensForDay.map((venue: VenueSchedule, idx: number) => {
                  const isActive = activeScreenIndex === idx;
                  const label = venue.venueSubtitle
                    ? `${venue.venue} — ${venue.venueSubtitle}`
                    : venue.venue;
                  return (
                    <button
                      key={idx}
                      onClick={() => setActiveScreenIndex(idx)}
                      className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 font-body text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? "bg-primary text-white shadow-card"
                          : "border border-border bg-card text-card-foreground hover:border-primary/30"
                      }`}
                    >
                      <MapPin className={`h-3.5 w-3.5 shrink-0 ${isActive ? "text-white" : ""}`} />
                      {label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Events list */}
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {eventsForScreen.length > 0 ? (
                  eventsForScreen.map((event, index) => (
                    <div
                      key={index}
                      className="group flex gap-4 rounded-xl border border-zinc-200 bg-card p-5 shadow-card transition-all duration-300 hover:shadow-elevated dark:border-zinc-700"
                      style={{ animationDelay: `${index * 80}ms` }}
                    >
                      {/* Time pill - cream/yellow box with clock icon */}
                      <div className="flex flex-col items-center">
                        <span className="flex items-center gap-1.5 whitespace-nowrap rounded-lg bg-amber-50 px-3 py-1.5 font-body text-sm font-semibold text-zinc-800 dark:bg-amber-950/30 dark:text-zinc-200">
                          <Clock className="h-3.5 w-3.5 shrink-0 text-zinc-600 dark:text-zinc-400" />
                          {event.time}
                        </span>
                        {index < eventsForScreen.length - 1 && (
                          <div className="mt-2 h-full min-h-[8px] w-px bg-border" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1">
                        <h4 className="font-display text-lg font-semibold text-foreground transition-colors duration-300 group-hover:text-primary">
                          {event.title}
                        </h4>
                        {(event.director || event.moderator) && (
                          <div className="mt-1.5 flex items-center gap-1.5 text-muted-foreground">
                            {getEventIcon(event)}
                            <span className="font-body text-sm">
                              {event.director
                                ? `Director: ${event.director}`
                                : `Speaker: ${event.moderator}`}
                            </span>
                          </div>
                        )}
                        {event.description &&
                          !event.director &&
                          !event.moderator && (
                            <p className="mt-1.5 font-body text-sm text-muted-foreground">
                              {event.description}
                            </p>
                          )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-200 bg-card py-16 text-center shadow-card dark:border-zinc-700">
                    <Film className="mb-3 h-10 w-10 text-muted-foreground/40" />
                    <p className="font-body text-muted-foreground">
                      No events scheduled for this venue
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </section>
  );
}
