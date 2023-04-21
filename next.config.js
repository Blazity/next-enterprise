/* eslint-disable @typescript-eslint/no-var-requires */
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
})
const withPlugins = require("next-compose-plugins")

/**
 * @type {import('next').NextConfig}
 */
module.exports = withPlugins([[withBundleAnalyzer]], {
  reactStrictMode: true,
  experimental: { instrumentationHook: true },
})
