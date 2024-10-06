import withBundleAnalyzer from "@next/bundle-analyzer"
import withPlugins from "next-compose-plugins"
import { env } from "./env.mjs"

/**
 * @type {import('next').NextConfig}
 */
const config = withPlugins(
  [
    [
      withBundleAnalyzer({
        enabled: env.ANALYZE,
      }),
    ],
  ],
  {
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
    // Add the eslint configuration here
    eslint: {
      // Warning: This allows production builds to successfully complete even if
      // your project has ESLint errors.
      ignoreDuringBuilds: true,
    },
    // Add the output setting here
    output: 'standalone',
  }
)

export default config
