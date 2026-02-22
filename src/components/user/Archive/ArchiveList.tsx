"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { getAllYears, getGalleryYearwise } from "@/services/galleryServices";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { getMediaUrl } from "@/utils/media";

interface YearData {
  year: number;
  yearId: string;
  imagePaths: string[];
  totalCount: number;
}

const ShimmerEffect = ({ className }: { className?: string }) => (
  <div className={`relative overflow-hidden rounded-lg ${className ?? ""}`}>
    <div className="absolute inset-0 shimmer" />
    <div className="invisible">&nbsp;</div>
  </div>
);

const YearCardShimmer = () => (
  <div className="rounded-xl p-[2px] bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-400 relative overflow-hidden">
    <div className="rounded-[10px] bg-[#FFFAEE] p-4">
    <div className="grid grid-cols-2 gap-2 mb-4">
      <ShimmerEffect className="aspect-[4/3] rounded-lg" />
      <ShimmerEffect className="aspect-[4/3] rounded-lg" />
      <ShimmerEffect className="aspect-[4/3] rounded-lg" />
      <ShimmerEffect className="aspect-[4/3] rounded-lg" />
    </div>
    <div className="flex justify-between items-center">
      <ShimmerEffect className="h-8 w-16" />
      <div className="flex items-center">
        <ShimmerEffect className="h-4 w-16" />
        <ShimmerEffect className="h-4 w-4 ml-1 rounded-full" />
      </div>
    </div>
    </div>
  </div>
);

const HeaderShimmer = () => (
  <header className="flex justify-center pt-8 pb-4 relative">
    <ShimmerEffect className="h-10 w-32 rounded-lg" />
  </header>
);

const CARDS_PER_PAGE = 4;

export default function ArchiveList() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [yearData, setYearData] = useState<YearData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [activeYearId, setActiveYearId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchArchiveData = async () => {
      try {
        setIsLoading(true);
        const [years, yearwise] = await Promise.all([
          getAllYears(),
          getGalleryYearwise(),
        ]);
        const yearIdMap = new Map<number, string>();
        years.forEach((y) => yearIdMap.set(y.value, y._id));
        const transformed: YearData[] = yearwise.map((item) => ({
          year: item.year,
          yearId: yearIdMap.get(item.year) ?? item.year.toString(),
          imagePaths: item.images.slice(0, 4).map((img) => img.photo),
          totalCount: item.images.length,
        }));
        setYearData(transformed.sort((a, b) => b.year - a.year));
      } catch (err) {
        setError("An error occurred while fetching data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchArchiveData();
  }, []);

  const handleYearClick = (data: YearData) => {
    setActiveYearId(data.yearId);
    router.push(`/archive/${data.year}?yearId=${data.yearId}`);
  };

  const totalPages = Math.ceil(yearData.length / CARDS_PER_PAGE);
  const paginatedData = yearData.slice(
    (currentPage - 1) * CARDS_PER_PAGE,
    currentPage * CARDS_PER_PAGE
  );

  if (error) {
    return (
      <div className="min-h-screen bg-[#FFFAEE] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Archive</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#ffffff]">
      {isLoading ? (
        <HeaderShimmer />
      ) : (
        <header className="flex justify-center pt-8 pb-4 relative">
          <h1 className="text-4xl font-bold text-blue-700 tracking-wider">Gallery</h1>
        </header>
      )}

      <main className="container mx-auto px-4 py-8 lg:max-w-7xl lg:px-8 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          {isLoading ? (
            <>
              <YearCardShimmer />
              <YearCardShimmer />
              <YearCardShimmer />
              <YearCardShimmer />
            </>
          ) : (
            paginatedData.map((data) => (
              <motion.div
                key={data.year}
                className={`group rounded-xl p-[2px] relative overflow-hidden cursor-pointer transition-colors ${
                  activeYearId === data.yearId
                    ? "bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600"
                    : "bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-400"
                }`}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                onClick={() => handleYearClick(data)}
                tabIndex={0}
                role="button"
                aria-label={`View gallery for year ${data.year}`}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleYearClick(data);
                  }
                }}
              >
                <div className="rounded-[10px] bg-[#FFFAEE] p-4">
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {data.imagePaths.map((path, index) => (
                    <div key={index} className="aspect-[4/3] rounded-lg overflow-hidden">
                      <Image
                        src={getMediaUrl(path) || "/placeholder.svg?height=150&width=200"}
                        alt={`Preview ${index + 1} for year ${data.year}`}
                        width={200}
                        height={150}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "/placeholder.svg?height=150&width=200";
                        }}
                      />
                    </div>
                  ))}
                  {Array.from({ length: Math.max(0, 4 - data.imagePaths.length) }).map((_, i) => (
                    <div key={`ph-${i}`} className="aspect-[4/3] rounded-lg overflow-hidden bg-gray-200">
                      <Image
                        src="/placeholder.svg?height=150&width=200"
                        alt="Placeholder"
                        width={200}
                        height={150}
                        className="w-full h-full object-cover opacity-50"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-600 via-yellow-600 to-amber-700 bg-clip-text text-transparent">{data.year}</h2>
                  <div
                    className={`flex items-center text-sm font-medium transition-colors ${
                      activeYearId === data.yearId ? "text-amber-600" : "text-gray-700"
                    } group-hover:text-amber-600`}
                  >
                    View All ({data.totalCount} images) <ArrowRight size={16} className="ml-1" />
                  </div>
                </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
        {!isLoading && totalPages > 1 && (
          <div className="flex justify-center mt-8">
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
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <PaginationItem key={idx + 1}>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === idx + 1}
                      onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(idx + 1);
                      }}
                      className="cursor-pointer"
                    >
                      {idx + 1}
                    </PaginationLink>
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
          </div>
        )}
      </main>
    </div>
  );
}
