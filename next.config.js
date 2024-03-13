// // next.config.js
// module.exports = {
//   // ... rest of the configuration.
//   output: "standalone",
//   async redirects() {
//     return [
//       {
//         source: "/",
//         destination: "/home",
//         permanent: true,
//       },
//     ]
//   },
// }

const withPWA = require("next-pwa")({
  dest: "public",
  swSrc: "public/service-worker.js",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
})

module.exports = withPWA({
  reactStrictMode: true,
  // next.js config
  output: "standalone",
})
