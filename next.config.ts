import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "orionhost.xyz",
      },
    ],
  },
  rewrites: async () => [
    {
      source: "/favicon.ico",
      destination: "/favicon.svg",
    },
    {
      source: "/api/:path*",
      destination: "http://localhost:4059/api/:path*",
    },
  ],
};

export default nextConfig;
