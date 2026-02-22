import React, { Suspense } from "react";
import ArchiveYearGallery from "@/components/user/Archive/ArchiveYearGallery";

function ArchiveYearGalleryWrapper() {
  return <ArchiveYearGallery />;
}

export default function ArchiveYearPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FFFAEE] flex items-center justify-center">Loading...</div>}>
      <ArchiveYearGalleryWrapper />
    </Suspense>
  );
}
