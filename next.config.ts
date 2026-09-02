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
      destination: "http://172.18.0.1:4059/api/:path*",
    },
  ],
  allowedDevOrigins: ["172.18.0.1"],
};

export default nextConfig;
