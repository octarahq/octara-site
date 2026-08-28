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
};

export default nextConfig;
