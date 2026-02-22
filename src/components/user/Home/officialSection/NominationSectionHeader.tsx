"use client"

import React from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface NominationSectionHeaderProps {
  /** e.g. "Nomination for the best short film" or "Nomination for the best documentary film" */
  title: string
  /** When false, hides the View Films button (e.g. on the Films page where we're already there). Default true. */
  showViewAward?: boolean
}

const NominationSectionHeader: React.FC<NominationSectionHeaderProps> = ({
  title,
  showViewAward = true,
}) => {
  return (
    <div className="px-3 sm:px-6 md:px-10 flex flex-row flex-wrap items-center justify-between gap-3 mb-4 md:mb-6">
      <div className="min-w-0 flex-1">
        <h2 className="text-sm md:text-lg font-bold text-primary">
          Arunachal Film Festival
        </h2>
        <p className="text-base md:text-2xl lg:text-4xl font-semibold text-foreground mt-0.5 break-words">
          {title}
        </p>
      </div>
      {showViewAward && (
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <Link href="/films">
            <Button className="rounded-full bg-primary text-black hover:bg-yellow-300 hover:scale-105 hover:shadow-lg transition-all duration-200 ease-out text-sm sm:text-base px-3 sm:px-4 py-1.5 sm:py-2 h-auto">
              View Films
            </Button>
          </Link>
          <Link href="/films" className="inline-flex items-center justify-center h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-primary hover:opacity-90 transition-opacity">
            <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 text-black" />
          </Link>
        </div>
      )}
    </div>
  )
}

export default NominationSectionHeader
