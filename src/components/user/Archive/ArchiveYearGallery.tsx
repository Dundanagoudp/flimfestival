"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Download, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useParams, useSearchParams } from "next/navigation";
import { getAllGalleryByYear } from "@/services/galleryServices";
import type { GalleryImage } from "@/types/galleryTypes";
import { getMediaUrl } from "@/utils/media";

const IMAGES_PER_PAGE = 12;

const ShimmerEffect = ({ className }: { className?: string }) => (
  <div className={`relative overflow-hidden rounded-lg ${className ?? ""}`}>
    <div className="absolute inset-0 shimmer" />
    <div className="invisible">&nbsp;</div>
  </div>
);

const GalleryImageShimmer = () => (
  <div className="aspect-[4/3] w-full h-full">
    <ShimmerEffect className="w-full h-full" />
  </div>
);

const HeaderShimmer = () => (
  <header className="container mx-auto px-4 py-6 flex items-center justify-between relative">
    <ShimmerEffect className="h-6 w-16" />
    <ShimmerEffect className="h-8 w-20" />
    <ShimmerEffect className="h-7 w-7" />
  </header>
);

const TitleShimmer = () => (
  <div className="text-center mb-8">
    <ShimmerEffect className="h-10 w-48 mx-auto mb-4" />
    <ShimmerEffect className="h-8 w-40 mx-auto" />
  </div>
);

function ImageModal({
  isOpen,
  onClose,
  imageSrc,
  imageAlt,
  onDownload,
}: {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  imageAlt: string;
  onDownload: () => void;
}) {
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 md:p-6"
          onClick={onClose}
          aria-modal="true"
          role="dialog"
          aria-label="Image preview"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="relative w-full max-w-4xl max-h-[85vh] sm:max-h-[88vh] bg-white rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl ring-1 ring-black/5 flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top bar: actions */}
            <div className="flex items-center justify-between p-2 sm:p-3 bg-white border-b border-gray-100 shrink-0">
              <button
                type="button"
                className="flex items-center justify-center min-w-[44px] min-h-[44px] sm:min-w-[40px] sm:min-h-[40px] rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 transition-colors touch-manipulation"
                onClick={onDownload}
                aria-label="Download image"
              >
                <Download size={22} className="sm:w-5 sm:h-5" />
              </button>
              <button
                type="button"
                className="flex items-center justify-center min-w-[44px] min-h-[44px] sm:min-w-[40px] sm:min-h-[40px] rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 transition-colors touch-manipulation"
                onClick={onClose}
                aria-label="Close modal"
              >
                <X size={22} className="sm:w-5 sm:h-5" />
              </button>
            </div>
            {/* Image area: scrollable on small screens */}
            <div className="relative flex-1 min-h-0 overflow-auto flex items-center justify-center p-2 sm:p-4">
              <Image
                src={imageSrc || "/placeholder.svg"}
                alt={imageAlt}
                width={800}
                height={600}
                className="object-contain w-full h-auto max-h-[70vh] sm:max-h-[75vh] rounded-lg"
                sizes="(max-width: 768px) 100vw, 896px"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function generatePaginationItems(currentPage: number, totalPages: number): (number | "ellipsis")[] {
  const items: (number | "ellipsis")[] = [];
  const maxVisible = 5;
  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) items.push(i);
  } else {
    if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) items.push(i);
      items.push("ellipsis");
      items.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      items.push(1);
      items.push("ellipsis");
      for (let i = totalPages - 3; i <= totalPages; i++) items.push(i);
    } else {
      items.push(1);
      items.push("ellipsis");
      for (let i = currentPage - 1; i <= currentPage + 1; i++) items.push(i);
      items.push("ellipsis");
      items.push(totalPages);
    }
  }
  return items;
}

export default function ArchiveYearGallery() {
  const params = useParams();
  const year = params.year as string;
  const searchParams = useSearchParams();
  const yearId = searchParams.get("yearId");

  const [selectedImage, setSelectedImage] = useState<{ src: string; alt: string; photo: string } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!yearId) {
      setError("Year ID is required to view this gallery");
      setIsLoading(false);
      return;
    }
    const fetchImages = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const resp = await getAllGalleryByYear(yearId);
        setImages(resp?.images ?? []);
      } catch (err) {
        setError("Failed to load gallery");
        setImages([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchImages();
  }, [yearId]);

  const totalPages = Math.ceil(images.length / IMAGES_PER_PAGE);
  const startIndex = (currentPage - 1) * IMAGES_PER_PAGE;
  const endIndex = startIndex + IMAGES_PER_PAGE;
  const currentImages = images.slice(startIndex, endIndex);

  const handleDownload = async () => {
    if (!selectedImage) return;
    const url = getMediaUrl(selectedImage.photo);
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `gallery-${year}-image.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(objectUrl);
    } catch {
      const link = document.createElement("a");
      link.href = url;
      link.download = `gallery-${year}-image.jpg`;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Gallery</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/archive" className="text-blue-600 hover:underline">
            ← Back to Archive
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {isLoading ? (
        <HeaderShimmer />
      ) : (
        <header className="container mx-auto px-4 py-6 flex items-center justify-between relative">
          <Link
            href="/archive"
            className="flex items-center text-gray-700 hover:text-blue-700"
            aria-label="Back to archive"
          >
            <ArrowLeft size={20} className="mr-1" />
            <span>Back</span>
          </Link>
          <h1 className="text-2xl font-bold text-blue-700 absolute left-1/2 transform -translate-x-1/2">
            {year}
          </h1>
        </header>
      )}

      <main className="container mx-auto px-4 py-8 relative">
        {isLoading ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <TitleShimmer />
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
              variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }}
              initial="hidden"
              animate="show"
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <motion.div key={i} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}>
                  <GalleryImageShimmer />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 bg-clip-text text-transparent mb-8">GALLERY {year}</h2>
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
              variants={{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } }}
              initial="hidden"
              animate="show"
            >
              {currentImages.map((item, index) => (
                <motion.div
                  key={item._id}
                  className="aspect-[4/3] rounded-lg overflow-hidden cursor-pointer border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                  variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  onClick={() =>
                    setSelectedImage({
                      src: getMediaUrl(item.photo),
                      alt: `Gallery image ${startIndex + index + 1}`,
                      photo: item.photo,
                    })
                  }
                >
                  <Image
                    src={getMediaUrl(item.photo) || "/placeholder.svg?height=225&width=300"}
                    alt={`Gallery image ${startIndex + index + 1}`}
                    width={300}
                    height={225}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg?height=225&width=300";
                    }}
                  />
                </motion.div>
              ))}
            </motion.div>

            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="mt-8"
              >
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage((p) => Math.max(1, p - 1));
                        }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                    {generatePaginationItems(currentPage, totalPages).map((item, idx) => (
                      <PaginationItem key={`${item}-${idx}`}>
                        {item === "ellipsis" ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            href="#"
                            isActive={currentPage === item}
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(item as number);
                            }}
                            className="cursor-pointer"
                          >
                            {item}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage((p) => Math.min(totalPages, p + 1));
                        }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
                <p className="text-center mt-4 text-sm text-gray-600">
                  Page {currentPage} of {totalPages} · Showing {startIndex + 1}–
                  {Math.min(endIndex, images.length)} of {images.length} images
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </main>

      <ImageModal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        imageSrc={selectedImage ? getMediaUrl(selectedImage.photo) : ""}
        imageAlt={selectedImage?.alt ?? ""}
        onDownload={handleDownload}
      />
    </div>
  );
}
