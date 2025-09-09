import React from "react";
import { Button } from "@/components/ui/button";

interface DynamicPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
  className?: string;
  showItemsInfo?: boolean;
  maxVisiblePages?: number;
}

export default function DynamicPagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  className = "",
  showItemsInfo = true,
  maxVisiblePages = 5,
}: DynamicPaginationProps) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getVisiblePages = () => {
    const pages: number[] = [];
    const maxVisible = Math.max(1, maxVisiblePages);

    if (totalPages <= maxVisible) {
      // Show all pages if total is 5 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else if (currentPage <= 3) {
      // Show first 5 pages
      for (let i = 1; i <= Math.min(maxVisible, totalPages); i++) {
        pages.push(i);
      }
    } else if (currentPage >= totalPages - 2) {
      // Show last 5 pages
      for (let i = Math.max(1, totalPages - 4); i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show current page and neighbors
      for (let i = currentPage - 2; i <= currentPage + 2; i++) {
        if (i >= 1 && i <= totalPages) {
          pages.push(i);
        }
      }
    }

    return pages;
  };

  return (
    <div className={`flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0 px-4 py-3 ${className}`}>
      {/* Items info - Left side */}
      {showItemsInfo && (
        <div className="text-sm text-gray-600 text-center sm:text-left">
          {`Showing ${startItem}-${endItem} of ${totalItems} items`}
        </div>
      )}

      {/* Pagination Controls - Right side */}
      <div className={`flex items-center gap-2 ${showItemsInfo ? 'justify-center sm:justify-end' : 'justify-center'}`}>
        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm"
        >
          &lt; Previous
        </Button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {getVisiblePages().map((pageNum) => (
            <Button
              key={pageNum}
              variant={currentPage === pageNum ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(pageNum)}
              className={`min-w-[32px] h-8 px-2 text-sm ${
                currentPage === pageNum
                  ? "bg-gray-900 text-white hover:bg-gray-800"
                  : "bg-white border-gray-200 hover:bg-gray-50"
              }`}
            >
              {pageNum}
            </Button>
          ))}
        </div>

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm"
        >
          Next &gt;
        </Button>
      </div>
    </div>
  );
}