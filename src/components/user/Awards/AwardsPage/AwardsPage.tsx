"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { getAllAwards, getCategoryNameMap } from "@/services/awardService";
import type { Award } from "@/types/awardTypes";
import { LoadingSpinner } from "@/components/common/LoaderSpinner";
import { getMediaUrl } from "@/utils/media";

/** A single "Short Documentary Rules & Regulations" block */
function RulesSection({
  award,
  categoryName,
}: {
  award: Award;
  categoryName?: string;
}) {
  const thumbs = useMemo(() => {
    const arr = award.array_images?.slice(0, 4) ?? [];
    return [...arr, ...Array(Math.max(0, 4 - arr.length)).fill("")].slice(0, 4);
  }, [award.array_images]);

  return (
    <div className="space-y-8">
      {/* Top row: image (left) + copy (right) */}
      <div className="grid items-start gap-8 lg:grid-cols-12">
        {/* Image */}
        {/* Image (taller) */}
        <div className="lg:col-span-5">
          <div className="relative h-[420px] sm:h-[380px] lg:h-[400px] xl:h-[500px] overflow-hidden rounded-3xl ring-1 ring-border/70 shadow-sm bg-card">
            <Image
              src={getMediaUrl(award.image) || "/placeholder.svg"}
              alt={award.title}
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Copy */}
        <div className="lg:col-span-7">
          <div className="space-y-3">
            <p className="font-montserrat text-[16px] font-semibold uppercase tracking-wide text-primary">
              Short Documentary Rules & Regulations
              {categoryName ? ` • ${categoryName}` : ""}
            </p>

            <h2 className="font-montserrat text-3xl font-extrabold leading-tight text-foreground sm:text-[34px]">
              {award.title}
            </h2>

            <p className="text-[15px] leading-7 text-muted-foreground">
              {award.description}
            </p>
          </div>
        </div>
      </div>

      {/* Rules cards */}
      <div className="grid gap-6 sm:grid-cols-3">
        {[
          { title: "Rule 1", text: award.rule1 },
          { title: "Rule 2", text: award.rule2 },
          { title: "Rule 3", text: award.rule3 },
        ].map((r) => (
          <div key={r.title} className="  p-6 ">
            <div className="h-[2px] w-full bg-border/80 -mt-2 mb-4" />
            <p className="font-montserrat text-base font-semibold text-foreground">
              {r.title}
            </p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {r.text}
            </p>
          </div>
        ))}
      </div>

      {/* Thumbnails strip */}
      <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
        {thumbs.map((src, i) =>
          src ? (
            <div
              key={i}
              className="overflow-hidden rounded-xl border border-border/70 bg-muted shadow-sm"
            >
              <Image
                src={getMediaUrl(src)}
                alt={`thumbnail-${i + 1}`}
                width={600}
                height={450}
                className="h-66 w-full object-cover"
              />
            </div>
          ) : (
            <div
              key={i}
              //   className="h-36 rounded-xl border border-border/70 bg-muted shadow-sm"
            />
          )
        )}
      </div>
    </div>
  );
}

export default function AwardsPage() {
  const [awards, setAwards] = useState<Award[] | null>(null);
  const [catMap, setCatMap] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const getImageUrl = (image: string) => {
    return getMediaUrl(image);
  };
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      try {
        const [awardsRes, cats] = await Promise.all([
          getAllAwards(),
          getCategoryNameMap(),
        ]);
        if (!mounted) return;
        setAwards(awardsRes);
        console.log("awardsRes", awardsRes);
        setCatMap(cats);
      } catch (e: any) {
        if (!mounted) return;
        setError(e?.message || "Failed to load awards");
      } finally {
        setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  if (error) {
    return (
      <section className="bg-[oklch(0.97_0_0)]">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        </div>
      </section>
    );
  }
  if (loading) {
    return <LoadingSpinner />;
  }
  if (!awards) {
    // Skeleton
    return (
      <section className="bg-[oklch(0.97_0_0)]">
        <div className="mx-auto max-w-7xl space-y-12 px-6 py-16 lg:px-8">
          {Array.from({ length: 2 }).map((_, idx) => (
            <div key={idx} className="space-y-6">
              <div className="grid items-start gap-8 lg:grid-cols-12">
                <div className="h-72 rounded-3xl bg-muted lg:col-span-5 animate-pulse" />
                <div className="space-y-4 lg:col-span-7">
                  <div className="h-4 w-60 rounded bg-muted animate-pulse" />
                  <div className="h-8 w-3/4 rounded bg-muted animate-pulse" />
                  <div className="h-20 w-full rounded bg-muted animate-pulse" />
                </div>
              </div>
              <div className="grid gap-6 sm:grid-cols-3">
                {Array.from({ length: 3 }).map((__, i) => (
                  <div
                    key={i}
                    className="h-28 rounded-2xl bg-muted animate-pulse"
                  />
                ))}
              </div>
              <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
                {Array.from({ length: 4 }).map((__, i) => (
                  <div
                    key={i}
                    className="h-36 rounded-xl bg-muted animate-pulse"
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Always show two sections (like the mock). If only one award, duplicate visually.
  const a1 = awards[0];
  const a2 = awards[1] ?? awards[0];

  const catName1 =
    typeof a1.category === "string" ? catMap[a1.category] : a1.category?.name;
  const catName2 =
    typeof a2.category === "string" ? catMap[a2.category] : a2.category?.name;

  return (
    <section className="bg-[oklch(0.97_0_0)]">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        {/* Section 1 */}
        <RulesSection award={a1} categoryName={catName1} />

        {/* Divider */}
        <div className="my-16 h-px w-full bg-border/70" />

        {/* Section 2 (same orientation to match your screenshot) */}
        <RulesSection award={a2} categoryName={catName2} />
      </div>
    </section>
  );
}
