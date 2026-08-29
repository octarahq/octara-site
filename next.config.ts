import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
      destination: "https://api.octara.xyz/api/:path*",
    },
  ],
};

export default nextConfig;
