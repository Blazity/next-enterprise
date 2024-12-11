import withBundleAnalyzer from "@next/bundle-analyzer"
import { env } from "./env.mjs"

const plugins = [
  withBundleAnalyzer({ enabled: env.ANALYZE }),
];

/**
 * @type {import('next').NextConfig}
 */
const config = {
  reactStrictMode: true,
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  experimental: { instrumentationHook: true },
  rewrites() {
    return [
      { source: "/healthz", destination: "/api/health" },
      { source: "/api/healthz", destination: "/api/health" },
      { source: "/health", destination: "/api/health" },
      { source: "/ping", destination: "/api/health" },
    ]
  },
};

export default plugins.reduce((acc, next) => next(acc), config);
