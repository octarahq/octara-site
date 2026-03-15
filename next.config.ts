import type { NextConfig } from "next";

try {
  require('./server/timer-bootstrap.cjs');
} catch (e) {
  console.error('[next.config] timer error', e);
}

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
