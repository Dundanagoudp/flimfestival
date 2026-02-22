"use client";

export interface VerticalPosterItem {
  src: string;
  title: string;
}

const FALLBACK_POSTERS: VerticalPosterItem[] = [
  { src: "https://placehold.co/400x230/1a1a2e/eab308?text=Festival+2025", title: "Film Festival 2025" },
  { src: "https://placehold.co/400x230/1a1a2e/eab308?text=Awards", title: "Cinema Festival Awards" },
  { src: "https://placehold.co/400x230/1a1a2e/eab308?text=Goa", title: "Film Festival Goa" },
  { src: "https://placehold.co/400x230/1a1a2e/eab308?text=Celebration", title: "Bollywood Celebration" },
];

interface VerticalPosterCarouselProps {
  items?: VerticalPosterItem[];
}

const VerticalPosterCarousel = ({ items: propItems }: VerticalPosterCarouselProps) => {
  const posters = propItems && propItems.length > 0 ? propItems : FALLBACK_POSTERS;
  const doubled = [...posters, ...posters];

  return (
    <div className="relative h-[500px] overflow-hidden rounded-xl">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-16 bg-gradient-to-b from-background to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-t from-background to-transparent" />

      <div className="animate-scroll-posters flex flex-col gap-4 hover:[animation-play-state:paused]">
        {doubled.map((poster, i) => (
          <div
            key={i}
            className="group relative flex-shrink-0 overflow-hidden rounded-lg shadow-lg transition-transform duration-300 hover:scale-[1.03]"
          >
            <img
              src={poster.src}
              alt={poster.title}
              className="h-[230px] w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-foreground/80 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <p className="font-montserrat text-sm font-semibold text-primary-foreground">
                {poster.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VerticalPosterCarousel;
