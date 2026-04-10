import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.moyasar.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.moyasar.com",
              "font-src 'self' https://fonts.gstatic.com",
              "img-src 'self' data: blob: https://res.cloudinary.com",
              "connect-src 'self' https://boost-api-16ta.onrender.com wss://boost-api-16ta.onrender.com https://api.moyasar.com",
              "frame-src 'self' https://api.moyasar.com https://*.moyasar.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self' https://api.moyasar.com",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
