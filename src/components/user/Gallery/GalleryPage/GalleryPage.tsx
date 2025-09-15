"use client";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { getAllYears, getAllGalleryByYear } from "@/services/galleryServices";
import type {
  GalleryYear,
  GetAllGalleryResponse,
  GalleryImage,
} from "@/types/galleryTypes";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingSpinner } from "@/components/common/LoaderSpinner";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import Zoom from "yet-another-react-lightbox/plugins/zoom";

type YearId = string;

export default function GalleryPage() {
  const [years, setYears] = useState<GalleryYear[]>([]);
  const [activeYearId, setActiveYearId] = useState<YearId | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loadingYears, setLoadingYears] = useState(true);
  const [loadingImages, setLoadingImages] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openLightbox, setOpenLightbox] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        setLoadingYears(true);
        setError(null);
        const yrs = await getAllYears();
        const sorted = [...yrs].sort((a, b) => b.value - a.value);
        setYears(sorted);
        if (sorted.length > 0) {
          setActiveYearId(sorted[0]._id);
        }
      } catch (e: any) {
        setError(e?.message || "Failed to load years");
      } finally {
        setLoadingYears(false);
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!activeYearId) return;
    (async () => {
      setLoading(true);
      try {
        setLoadingImages(true);
        setError(null);
        const resp: GetAllGalleryResponse = await getAllGalleryByYear(activeYearId);
        setImages(resp?.images ?? []);
      } catch (e: any) {
        setError(e?.message || "Failed to load gallery");
        setImages([]);
      } finally {
        setLoadingImages(false);
        setLoading(false);
      }
    })();
  }, [activeYearId]);

  const yearChips = useMemo(
    () =>
      years.map((y) => ({
        id: y._id,
        value: y.value,
      })),
    [years]
  );

  const activeYearValue = useMemo(() => {
    const y = years.find((yy) => yy._id === activeYearId);
    return y?.value;
  }, [years, activeYearId]);

  const slides = images.map((item) => ({
    src: item.photo,
    alt: `gallery-${item._id}`,
    width: 1920,
    height: 1080,
    srcSet: [
      { src: item.photo, width: 320, height: 213 },
    ],
  }));

  if (loading && loadingYears) {
    return <LoadingSpinner />;
  }

  return (
    <section className="bg-[oklch(0.97_0_0)]">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        {error && (
          <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}
        <div className="flex flex-wrap items-center gap-3">
          {loadingYears ? (
            <>
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton
                  key={i}
                  className="h-8 w-16 rounded-full bg-gray-300"
                />
              ))}
            </>
          ) : yearChips.length > 0 ? (
            yearChips.map((y) => {
              const active = y.id === activeYearId;
              return (
                <button
                  key={y.id}
                  type="button"
                  onClick={() => setActiveYearId(y.id)}
                  className={`rounded-full border px-4 py-1.5 text-sm transition ${
                    active
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-secondary text-foreground hover:bg-muted"
                  }`}
                  aria-pressed={active}
                >
                  {y.value}
                </button>
              );
            })
          ) : (
            <p className="text-sm text-muted-foreground">No years found.</p>
          )}
        </div>
        <div className="mt-8">
          {loadingImages ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 8 }).map((_, idx) => {
                const span = idx === 0 || idx === 7 ? "lg:col-span-2" : "";
                const heightClass =
                  idx === 0
                    ? "h-[230px] sm:h-[280px] md:h-[320px] lg:h-[300px] xl:h-[340px]"
                    : idx === 1 || idx === 2
                    ? "h-[230px] sm:h-[260px] md:h-[280px]"
                    : idx >= 3 && idx <= 6
                    ? "h-[210px] sm:h-[230px] md:h-[240px]"
                    : idx === 7
                    ? "h-[230px] sm:h-[260px] md:h-[300px]"
                    : "h-[210px] sm:h-[230px] md:h-[240px]";
                return (
                  <Skeleton
                    key={idx}
                    className={`rounded-2xl ${span} ${heightClass} bg-gray-100`}
                  />
                );
              })}
            </div>
          ) : images.length === 0 ? (
            <div className="rounded-2xl border border-border/70 bg-card p-8 text-center text-sm text-muted-foreground">
              {activeYearValue
                ? `No images found for ${activeYearValue}.`
                : "No images found."}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((item, idx) => {
                const span = idx === 0 || idx === 7 ? "lg:col-span-2" : "";
                const heightClass =
                  idx === 0
                    ? "h-[230px] sm:h-[280px] md:h-[320px] lg:h-[300px] xl:h-[340px]"
                    : idx === 1 || idx === 2
                    ? "h-[230px] sm:h-[260px] md:h-[280px]"
                    : idx >= 3 && idx <= 6
                    ? "h-[210px] sm:h-[230px] md:h-[240px]"
                    : idx === 7
                    ? "h-[230px] sm:h-[260px] md:h-[300px]"
                    : "h-[210px] sm:h-[230px] md:h-[240px]";
                return (
                  <figure
                    key={item._id}
                    className={`group relative overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border/70 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${span} ${heightClass}`}
                    onClick={() => {
                      const index = images.findIndex((img) => img._id === item._id);
                      setCurrentImageIndex(index);
                      setOpenLightbox(true);
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <Image
                      src={item.photo}
                      alt={`gallery-${item._id}`}
                      fill
                      sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      priority={idx < 3}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    </div>
                  </figure>
                );
              })}
            </div>
          )}
        </div>

        <Lightbox
          open={openLightbox}
          close={() => setOpenLightbox(false)}
          slides={slides}
          index={currentImageIndex}
          plugins={[Zoom]}
          zoom={{ scrollToZoom: true, maxZoomPixelRatio: 3, zoomInMultiplier: 2 }}
        />
      </div>
    </section>
  );
}
