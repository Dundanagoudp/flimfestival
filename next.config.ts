import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== 'production';

const nextConfig: NextConfig = {
  eslint: {
    // Skip ESLint during production builds (e.g., on Vercel)
    ignoreDuringBuilds: true,
  },
  // Build a serverless/standalone output rather than attempting static export
  output: 'standalone',
  // poweredByHeader: false,
  // async headers() {
  //   return [
  //     {
  //       source: "/(.*)",
  //       headers: [
  //         { key: "X-Frame-Options", value: "DENY" },
  //         { key: "X-Content-Type-Options", value: "nosniff" },
  //         { key: "Referrer-Policy", value: "no-referrer" },
  //         { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), usb=(), payment=(), clipboard-read=(), clipboard-write=(), accelerometer=(), autoplay=(), encrypted-media=(), fullscreen=(self), gyroscope=(), magnetometer=(), midi=(), picture-in-picture=()" },
  //         { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
  //         { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  //         // COEP can break external resources; leave unset unless you operate in a COOP/COEP isolated environment
  //         { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  //         { key: "X-DNS-Prefetch-Control", value: isDev ? "on" : "off" },
  //         { key: "X-XSS-Protection", value: "1; mode=block" },
  //       ],
  //     },
  //   ];
  // },
  images: {
    domains: [
      'images.unsplash.com',
      'hebbkx1anhila5yf.public.blob.vercel-storage.com',
      'storage.googleapis.com',
      'img.youtube.com',
    ],
  },
};

export default nextConfig;
