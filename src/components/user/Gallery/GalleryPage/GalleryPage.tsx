"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { getAllYears, getAllGalleryByYear } from "@/services/galleryServices"; // <- adjust path if different
import type {
  GalleryYear,
  GetAllGalleryResponse,
  GalleryImage,
} from "@/types/galleryTypes";
import { Skeleton } from "@/components/ui/skeleton";
import { LoadingSpinner } from "@/components/common/LoaderSpinner";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

type YearId = string;

export default function GalleryPage() {
  const [years, setYears] = useState<GalleryYear[]>([]);
  const [activeYearId, setActiveYearId] = useState<YearId | null>(null);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loadingYears, setLoadingYears] = useState(true);
  const [loadingImages, setLoadingImages] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // 1) Load all years
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        setLoadingYears(true);
        setError(null);
        const yrs = await getAllYears(); // YearsResponse
        // sort by value desc (e.g., 2025, 2024, ...)
        const sorted = [...yrs].sort((a, b) => b.value - a.value);
        setYears(sorted);

        // default active: first in sorted list
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

  // 2) Load images for selected year
  useEffect(() => {
    if (!activeYearId) return;
    (async () => {
      setLoading(true);
      try {
        setLoadingImages(true);
        setError(null);
        const resp: GetAllGalleryResponse = await getAllGalleryByYear(
          activeYearId
        );
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

  // Derived “chip” data from years (value displayed, id used)
  const yearChips = useMemo(
    () =>
      years.map((y) => ({
        id: y._id,
        value: y.value,
      })),
    [years]
  );

  // Find the active year value for display (optional)
  const activeYearValue = useMemo(() => {
    const y = years.find((yy) => yy._id === activeYearId);
    return y?.value;
  }, [years, activeYearId]);

  // Image modal handlers
  const openImageModal = (image: GalleryImage, index: number) => {
    setSelectedImage(image);
    setCurrentImageIndex(index);
    document.body.style.overflow = 'hidden';
    // Prevent zoom on iOS
    document.addEventListener('touchmove', preventDefault, { passive: false });
  };

  const closeImageModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
    document.removeEventListener('touchmove', preventDefault);
  };

  const preventDefault = (e: Event) => {
    e.preventDefault();
  };

  const navigateImage = (direction: 'prev' | 'next') => {
    if (images.length === 0) return;

    let newIndex;
    if (direction === 'prev') {
      newIndex = currentImageIndex > 0 ? currentImageIndex - 1 : images.length - 1;
    } else {
      newIndex = currentImageIndex < images.length - 1 ? currentImageIndex + 1 : 0;
    }

    setCurrentImageIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  // Robust close handler
  const handleCloseModal = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    closeImageModal();
  };

  // Touch gesture handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && images.length > 1) {
      navigateImage('next');
    }
    if (isRightSwipe && images.length > 1) {
      navigateImage('prev');
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage) return;

      switch (e.key) {
        case 'Escape':
          closeImageModal();
          break;
        case 'ArrowLeft':
          navigateImage('prev');
          break;
        case 'ArrowRight':
          navigateImage('next');
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, currentImageIndex, images]);
  if (loading && loadingYears) {
    return <LoadingSpinner />;
  }

  return (
    <section className="bg-[oklch(0.97_0_0)]">
      <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        {/* Errors (if any) */}
        {error && (
          <div className="mb-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Year chips */}
        <div className="flex flex-wrap items-center gap-3">
          {loadingYears ? (
            <>
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-16 rounded-full bg-gray-300" />
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
                  className={`rounded-full border px-4 py-1.5 text-sm transition ${active
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

        {/* Grid */}
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
                    className={`group relative overflow-hidden rounded-2xl bg-card shadow-sm ring-1 ring-border/70 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] ${span} ${heightClass}`}
                    onClick={() => openImageModal(item, idx)}
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
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg">
                        <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>
                  </figure>
                );
              })}
            </div>
          )}
        </div>

        {/* Premium Image Modal - Optimized for All Devices */}
        {selectedImage && (
          <div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300"
            onClick={handleCloseModal}
            onTouchEnd={handleCloseModal}
          >
            {/* Modal Container */}
            <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-6 lg:p-8">

              {/* Close Button - Fixed Position, Always Accessible */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  closeImageModal();
                }}
                onTouchEnd={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  closeImageModal();
                }}
                className="fixed top-4 right-4 z-50 bg-red-600 hover:bg-red-700 active:bg-red-800 backdrop-blur-md rounded-full p-3 sm:p-4 transition-all duration-200 shadow-lg border-2 border-white/20"
                aria-label="Close image viewer"
                type="button"
                style={{ touchAction: 'manipulation' }}
              >
                <X className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={2.5} />
              </button>

              {/* Top Controls Bar */}
              <div className="absolute top-4 left-4 right-20 z-20 flex items-center">
                {/* Image Counter */}
                {images.length > 1 && (
                  <div className="bg-black/60 backdrop-blur-md rounded-full px-4 py-2 sm:px-5 sm:py-2.5">
                    <span className="text-white text-sm sm:text-base font-medium">
                      {currentImageIndex + 1} / {images.length}
                    </span>
                  </div>
                )}
              </div>

              {/* Navigation Buttons - Desktop & Tablet */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateImage('prev');
                    }}
                    className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-full p-2 sm:p-3 transition-all duration-200 touch-manipulation hidden sm:block"
                    aria-label="Previous image"
                    type="button"
                  >
                    <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateImage('next');
                    }}
                    className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 backdrop-blur-md rounded-full p-2 sm:p-3 transition-all duration-200 touch-manipulation hidden sm:block"
                    aria-label="Next image"
                    type="button"
                  >
                    <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </button>
                </>
              )}

              {/* Mobile Navigation - Bottom Controls */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-6 sm:hidden">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateImage('prev');
                    }}
                    className="bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-full p-4 transition-all duration-200 shadow-lg"
                    aria-label="Previous image"
                    type="button"
                    style={{ touchAction: 'manipulation' }}
                  >
                    <ChevronLeft className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </button>

                  {/* Mobile Close Button */}
                  <button
                    onClick={handleCloseModal}
                    onTouchEnd={handleCloseModal}
                    className="bg-red-600 hover:bg-red-700 active:bg-red-800 backdrop-blur-md rounded-full p-4 transition-all duration-200 shadow-lg border-2 border-white/20"
                    aria-label="Close image viewer"
                    type="button"
                    style={{ touchAction: 'manipulation' }}
                  >
                    <X className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateImage('next');
                    }}
                    className="bg-black/60 hover:bg-black/80 backdrop-blur-md rounded-full p-4 transition-all duration-200 shadow-lg"
                    aria-label="Next image"
                    type="button"
                    style={{ touchAction: 'manipulation' }}
                  >
                    <ChevronRight className="w-6 h-6 text-white" strokeWidth={2.5} />
                  </button>
                </div>
              )}

              {/* Image Container - Responsive with Touch Support */}
              <div
                className="relative w-full h-full flex items-center justify-center touch-pan-y"
                onClick={(e) => e.stopPropagation()}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div className="relative max-w-full max-h-full animate-in zoom-in-95 duration-300">
                  <Image
                    src={selectedImage.photo}
                    alt={`Gallery image ${currentImageIndex + 1}`}
                    width={1200}
                    height={800}
                    className="max-w-full max-h-[calc(100vh-8rem)] sm:max-h-[calc(100vh-6rem)] object-contain rounded-lg shadow-2xl select-none"
                    priority
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 80vw"
                    draggable={false}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
