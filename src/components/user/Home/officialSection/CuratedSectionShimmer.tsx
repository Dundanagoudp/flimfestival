"use client"

interface CuratedSectionShimmerProps {
  /** Optional label for the heading placeholder (e.g. "Jury" or "Official Selections") */
  title?: string
}

export default function CuratedSectionShimmer({ title }: CuratedSectionShimmerProps) {
  return (
    <section className="w-full px-4 py-4 md:py-6 bg-white">
      <div className="text-center mb-5 md:mb-6">
        <div
          className="inline-block h-9 w-48 rounded-md shimmer mx-auto"
          style={{ maxWidth: "min(100%, 280px)" }}
          aria-hidden
        />
        {title && (
          <p className="sr-only">
            Loading {title}
          </p>
        )}
      </div>

      <div className="relative px-10">
        <div className="overflow-hidden rounded-xl">
          <div className="flex gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="min-w-0 flex flex-col rounded-xl overflow-hidden flex-[0_0_100%] sm:flex-[0_0_calc((100%-24px)/2)] lg:flex-[0_0_calc((100%-72px)/4)] shadow-md"
              >
                <div className="flex-shrink-0 h-[380px] w-full rounded-t-xl shimmer" />
                <div className="w-full h-11 rounded-b-xl bg-muted shimmer flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-3 mt-4 mb-4 sm:mt-5 sm:mb-5">
          <div className="w-10 h-10 rounded-full shimmer" aria-hidden />
          <div className="w-10 h-10 rounded-full shimmer" aria-hidden />
        </div>
      </div>
    </section>
  )
}
