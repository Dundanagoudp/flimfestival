"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useMemo, useState } from "react";
import { getGuestsYearwise } from "@/services/guestService";
import type { Guest } from "@/types/guestTypes";

type YearNum = number;
type GuestRole = "Judge" | "Guest" | "Speaker";

interface UIItem {
  id: string;
  name: string;
  role: GuestRole | string;
  photo: string;
  year: YearNum;
}

export default function GuestContent() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [yearwise, setYearwise] = useState<any[]>([]);
  const [activeYear, setActiveYear] = useState<YearNum | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getGuestsYearwise();

        const payload = Array.isArray(res)
          ? res
          : Array.isArray((res as any)?.data)
          ? (res as any).data
          : [];

        if (!mounted) return;
        setYearwise(payload);

        const ys = payload
          .map((b: any) =>
            Number(b?.year?.yearNumber ?? b?.year?.value ?? b?.year?.name ?? b?.year ?? NaN)
          )
          .filter((n: number) => !Number.isNaN(n))
          .sort((a: number, b: number) => b - a);

        setActiveYear(ys[0] ?? new Date().getFullYear());
      } catch (e: any) {
        setError(e?.message || "Failed to load guests");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const years: YearNum[] = useMemo(() => {
    const ys = yearwise
      .map((b) => Number(b?.year?.yearNumber ?? b?.year?.value ?? b?.year?.name ?? b?.year ?? NaN))
      .filter((n: number) => !Number.isNaN(n));
    return Array.from(new Set(ys)).sort((a, b) => b - a);
  }, [yearwise]);

  const allGuests: UIItem[] = useMemo(() => {
    const out: UIItem[] = [];
    for (const block of yearwise) {
      const y = Number(
        block?.year?.yearNumber ?? block?.year?.value ?? block?.year?.name ?? block?.year ?? NaN
      );
      if (Number.isNaN(y)) continue;

      const guests: Guest[] = block?.guests ?? [];
      for (const g of guests) {
        out.push({
          id: (g as any)._id ?? (g as any).id ?? crypto.randomUUID(),
          name: (g as any).name ?? "",
          role: (g as any).role ?? "Guest",
          photo:
            typeof (g as any).photo === "string"
              ? (g as any).photo
              : (g as any).photo?.url ?? "",
          year: y,
        });
      }
    }
    return out;
  }, [yearwise]);

  const filtered = useMemo(
    () => (activeYear ? allGuests.filter((g) => g.year === activeYear) : []),
    [allGuests, activeYear]
  );

  return (
    <section className="bg-[oklch(0.97_0_0)]">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        {error && (
          <div className="mb-6 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
            {error}
          </div>
        )}

        {/* Year chips */}
        <div className="flex flex-wrap items-center gap-3">
          {loading && !years.length ? (
            Array.from({ length: 5 }).map((_, i) => (
              <span key={i} className="h-8 w-16 animate-pulse rounded-full bg-muted" />
            ))
          ) : years.length ? (
            years.map((y) => {
              const active = y === activeYear;
              return (
                <button
                  key={y}
                  type="button"
                  onClick={() => setActiveYear(y)}
                  className={`rounded-full border px-4 py-1.5 text-sm transition ${
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-secondary text-foreground hover:bg-muted"
                  }`}
                  aria-pressed={active}
                >
                  {y}
                </button>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground">No years found.</p>
          )}
        </div>

        {/* Guest grid (each card links to /guests/[id]) */}
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {loading && !filtered.length
            ? Array.from({ length: 8 }).map((_, i) => (
                <article
                  key={i}
                  className="relative overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border/70"
                >
                  <div className="relative aspect-[4/5] w-full bg-muted animate-pulse" />
                </article>
              ))
            : filtered.map((g) => (
                <Link
                  key={g.id}
                  href={`/guest/guests/${g.id}`}
                  className="group relative overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border/70 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <div className="relative aspect-[4/5] w-full">
                    <Image
                      src={g.photo || "/placeholder.png"}
                      alt={g.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      sizes="(min-width:1024px) 25vw, (min-width:640px) 50vw, 100vw"
                    />
                  </div>
                  <div className="pointer-events-none absolute bottom-3 left-4">
                    <span className="rounded-md bg-black/55 px-2.5 py-1 text-sm font-semibold text-white backdrop-blur-sm">
                      {g.role}
                    </span>
                  </div>
                </Link>
              ))}
        </div>

        {!loading && activeYear && !filtered.length && (
          <p className="mt-6 text-sm text-muted-foreground">
            No guests found for {activeYear}.
          </p>
        )}
      </div>
    </section>
  );
}
