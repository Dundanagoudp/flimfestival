import { Play } from "lucide-react";

const GlimpsesPage = () => {
  return (
    <div className="min-h-[30vh] md:min-h-screen bg-white pt-20 pb-0 md:pt-12 md:pb-12 lg:pt-16 lg:pb-16">
      {/* Hero Section - more top on mobile */}
      <div className="relative pt-10 pb-6 md:py-16 lg:py-24 text-center overflow-hidden bg-white">
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground tracking-tight leading-tight">
            Glimpses of{" "}
            <span className="bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-600 bg-clip-text text-transparent">
              AFF
            </span>
          </h1>
        </div>
      </div>

      {/* Video Section - minimal bottom on mobile, more on desktop */}
      <div className="max-w-5xl mx-auto px-4 pb-2 md:pb-24 lg:pb-28 bg-white">
        <div className="group relative">
          <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-white shadow-md">
            {/* Top bar */}
            <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border-b border-gray-200">
              <Play className="w-3.5 h-3.5 text-primary fill-primary" />
              <span className="text-xs font-medium text-foreground">Now Playing</span>
              <span className="text-xs text-muted-foreground ml-1">— Glimpses of AFF</span>
            </div>

            {/* Video */}
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.youtube.com/embed/9zFyhszmJVQ?rel=0"
                title="Glimpses of AFF"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          </div>
        </div>

        {/* Decorative footer */}
        <div className="mt-3 md:mt-12 flex items-center justify-center gap-2">
          <div className="w-8 h-px bg-gray-200 rounded-full" />
          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
          <div className="w-8 h-px bg-gray-200 rounded-full" />
        </div>

        <p className="text-center text-xs text-muted-foreground mt-1 md:mt-4">
          © 2025 AFF • All rights reserved
        </p>
      </div>
    </div>
  );
};

export default GlimpsesPage;
