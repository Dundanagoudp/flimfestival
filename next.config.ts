import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== 'production';
const isVercel = !!process.env.VERCEL;

const nextConfig: NextConfig = {
  // Do NOT use standalone on Vercel; enable it only for self-host/Docker
  ...(isVercel ? {} : { output: 'standalone' as const }),
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
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '7000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '7000',
        pathname: '/api/v1/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;