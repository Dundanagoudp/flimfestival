'use client'

import { Spinner } from "@/components/ui/spinner";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fff8ed]">
      <Spinner size={64} />
    </div>
  );
}

