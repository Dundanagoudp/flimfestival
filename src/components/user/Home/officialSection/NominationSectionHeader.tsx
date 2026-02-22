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
    <div className="px-6 sm:px-10 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-5 md:mb-6">
      <div>
        <h2 className="md:text-lg text-xl font-bold text-primary">
          Arunachal Film Festival
        </h2>
        <p className="md:text-4xl text-2xl font-semibold text-foreground mt-0.5">
          {title}
        </p>
        {showViewAward && (
          <div className="flex items-center gap-2 mt-4 sm:hidden">
            <Link href="/films">
              <Button className="rounded-full bg-primary text-black hover:bg-yellow-300 hover:scale-105 hover:shadow-lg transition-all duration-200 ease-out">
                View Films
              </Button>
            </Link>
            <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary">
              <ArrowRight className="h-3 w-3 text-black" />
            </span>
          </div>
        )}
      </div>
      {showViewAward && (
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <Link href="/films">
            <Button className="rounded-full bg-primary text-black hover:bg-yellow-300 hover:scale-105 hover:shadow-lg transition-all duration-200 ease-out">
              View Films
            </Button>
          </Link>
          <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-primary">
            <ArrowRight className="h-3 w-3 text-black" />
          </span>
        </div>
      )}
    </div>
  )
}

export default NominationSectionHeader
