import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

try {
  require('./server/timer-bootstrap.cjs');
} catch (e) {
  console.error('[next.config] timer error', e);
}

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /* config options here */
};

export default withNextIntl(nextConfig);

