// next.config.js
module.exports = {
  // ... rest of the configuration.
  output: "standalone",
  async redirects() {
    return [
      {
        source: "/",
        destination: "/home",
        permanent: true,
      },
    ]
  },
}
