import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV !== 'production';
const isVercel = !!process.env.VERCEL;
// Set USE_HTTPS=1 only when the app is served over HTTPS (domain + nginx/TLS).
// For IP-only (public/private IP, no domain, no TLS), leave USE_HTTPS unset.
const useHttps = process.env.USE_HTTPS === '1';

const nextConfig: NextConfig = {
  // Do NOT use standalone on Vercel; enable it only for self-host/Docker
  ...(isVercel ? {} : { output: 'standalone' as const }),
  poweredByHeader: false,

  // CVE-2025-55182 Protection: restrict server actions
  experimental: {
    serverActions: {
      bodySizeLimit: '1mb',
      allowedOrigins: [],
    },
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), usb=(), payment=(), clipboard-read=(), clipboard-write=(), accelerometer=(), autoplay=(self \"https://www.youtube.com\" \"https://www.youtube-nocookie.com\"), encrypted-media=(self \"https://www.youtube.com\" \"https://www.youtube-nocookie.com\"), fullscreen=(self), gyroscope=(), magnetometer=(), midi=(), picture-in-picture=(self \"https://www.youtube.com\" \"https://www.youtube-nocookie.com\")",
          },
          ...(useHttps
            ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" }]
            : []),
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "worker-src 'self'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "font-src 'self' data: https://fonts.gstatic.com",
              "img-src 'self' data: https: http: blob:",
              "media-src 'self' https: http: blob:",
              "connect-src 'self' data: https: http: ws: wss:",
              "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              ...(useHttps ? ["upgrade-insecure-requests"] : []),
            ].join("; "),
          },
          { key: "X-DNS-Prefetch-Control", value: isDev ? "on" : "off" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
        ],
      },
    ];
  },

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