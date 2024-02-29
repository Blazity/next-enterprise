if (!self.define) {
  let e,
    s = {}
  const t = (t, c) => (
    (t = new URL(t + ".js", c).href),
    s[t] ||
      new Promise((s) => {
        if ("document" in self) {
          const e = document.createElement("script")
          ;(e.src = t), (e.onload = s), document.head.appendChild(e)
        } else (e = t), importScripts(t), s()
      }).then(() => {
        let e = s[t]
        if (!e) throw new Error(`Module ${t} didn’t register its module`)
        return e
      })
  )
  self.define = (c, n) => {
    const i = e || ("document" in self ? document.currentScript.src : "") || location.href
    if (s[i]) return
    let a = {}
    const l = (e) => t(e, i),
      u = { module: { uri: i }, exports: a, require: l }
    s[i] = Promise.all(c.map((e) => u[e] || l(e))).then((e) => (n(...e), a))
  }
}
define(["./workbox-1846d813"], function (e) {
  "use strict"
  importScripts("worker-WcZyltu4AIEZdlepY3Peo.js"),
    self.skipWaiting(),
    e.clientsClaim(),
    e.precacheAndRoute(
      [
        { url: "/SMOR-192.png", revision: "694a5d68bb01b831f6c9b5c7d43f0c27" },
        { url: "/SMOR-256.png", revision: "93baa0d7792e6776ccfbb917ed8fb1e8" },
        { url: "/SMOR-384.png", revision: "c0ef024f0903ba73d308e2dee7889bf9" },
        { url: "/SMOR-512.png", revision: "243de524262c12c7e00403a4b5dc14c5" },
        { url: "/_next/static/WcZyltu4AIEZdlepY3Peo/_buildManifest.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/WcZyltu4AIEZdlepY3Peo/_middlewareManifest.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/WcZyltu4AIEZdlepY3Peo/_ssgManifest.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/0b7b90cd.23a679f790af5ada.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/1120-4b6c01efbb660cb0.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/1443-c9911baf6aa6969d.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/1857-4a754531d0dc3ce7.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/1944-1172cffe798b2d2d.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/1bfc9850-a5e52aab60a2bf09.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/2022-0b1731e5d5e56391.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/252f366e-25667f96c249ca01.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/3516-4d6afd5e3449cb6f.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/3761-100286903250d54e.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/4067.cc92d8e1edb00a0b.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/4321-45e31c436c8cb7a8.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/4355-471e0659b91aaa0f.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/4356-91fe2cc212fb70f3.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/5302-b90e4a54f702b9b8.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/5365-49d12afab2725ba2.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/5575-2326a978162761c3.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/5979-6f2587baf37a9775.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/6046-38951b11790c6f85.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/6220-3632eefa25b908ea.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/6602-15be9cec14ac902e.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/7005-d08d38268c11f695.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/7019-594327e28c484778.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/7164.b91874f80a184dd3.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/7238-8610a6af415f8caf.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/7259-0a5f5ceb4cbcd248.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/7411-111c6e401cb97781.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/8423-fc8e044710f19317.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/8608-e397dfae632fb839.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/9651.5057209db3881ec8.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/framework-428dc724d9086efb.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/main-04e4151d30f71ab2.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/pages/_app-d8b8016d7bea506b.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/pages/_error-0b1a861ffa2edde1.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/pages/address-b7eca4e9b569fd1c.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/pages/bookingreqpage-e8e1a6f68f8bb6c4.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/pages/dashboard-1bdf95290ba665cd.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/pages/home-6ee91d9bf555a563.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/pages/index-ffda4f32514d6aa0.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/pages/info-5a0660f1bea67378.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/pages/itempage-69d6598aef5ec5da.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        {
          url: "/_next/static/chunks/pages/itempage/%5Bitemkey%5D-c2f6ebad6a59057d.js",
          revision: "WcZyltu4AIEZdlepY3Peo",
        },
        {
          url: "/_next/static/chunks/pages/items/%5Buser_lender%5D-33ac1a4b581b143a.js",
          revision: "WcZyltu4AIEZdlepY3Peo",
        },
        { url: "/_next/static/chunks/pages/itemswindow-706741772e4ee171.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/pages/login-df75183f3fdaf6f4.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/pages/mappage-95b6b631665d0b5d.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/pages/newItem-76961819cc2fa4f2.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/pages/orders-5637e34fa4aeb00c.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/pages/privacypolicy-fea0a9e36d408ce0.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/pages/profile-d750e0bec23d4699.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/pages/searchpage-a20e60074cffe8c4.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/pages/settings-fdcc39f57cd60718.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/pages/signup-56863616abb5769b.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/pages/splash-4020a016f3a18b60.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/pages/taskpage-c2cea2257c510db0.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/pages/welcome-b00b5fc8b217a709.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/pages/wishlist-d8d72984251367c7.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/pages/workpage-dd025f82110469c5.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/polyfills-5cd94c89d3acac5f.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/chunks/webpack-bde62137e53dadca.js", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/css/4ac61f15fc19c268.css", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/css/6c1a23dd8a183dbb.css", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/media/layers-2x.9859cd12.png", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/media/layers.ef6db872.png", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/_next/static/media/marker-icon.d577052a.png", revision: "WcZyltu4AIEZdlepY3Peo" },
        { url: "/favicon.ico", revision: "666586677e60428aa5e58d13871736c7" },
        { url: "/firebase-messaging-sw.js", revision: "e387921962396472d67f290af1777d55" },
        { url: "/freebessimagelight.png", revision: "7e742e758c9028e8bd0c4345655e93c4" },
        { url: "/icon-192x192.png", revision: "ed26a1bbca33bba35e0e25bccec594f1" },
        { url: "/icon-256x256.png", revision: "ed2c6547ed3aeea9df44fe44bc30007f" },
        { url: "/icon-384x384.png", revision: "22a4a4214cd9cfa1b401091618ca0ac9" },
        { url: "/icon-512x512.png", revision: "562865edb386df86d7c72587c9096528" },
        { url: "/images/SMOR-192.png", revision: "3023f02d03ea538d8e3c39bdf0de383d" },
        { url: "/images/SMOR-512.png", revision: "c446f4acb68301e0d833488005e82085" },
        { url: "/images/no-image.png", revision: "12f9ee78f32722610c775ca7375c0c11" },
        { url: "/images/vercel.svg", revision: "26bf2d0adaf1028a4d4c6ee77005e819" },
        { url: "/manifest.json", revision: "d42be44d1990847c3d9aab15fbefdc00" },
        { url: "/marker-icon.png", revision: "3023f02d03ea538d8e3c39bdf0de383d" },
        { url: "/vercel.svg", revision: "26bf2d0adaf1028a4d4c6ee77005e819" },
      ],
      { ignoreURLParametersMatching: [] }
    ),
    e.cleanupOutdatedCaches(),
    e.registerRoute(
      "/",
      new e.NetworkFirst({
        cacheName: "start-url",
        plugins: [
          {
            cacheWillUpdate: async ({ request: e, response: s, event: t, state: c }) =>
              s && "opaqueredirect" === s.type
                ? new Response(s.body, { status: 200, statusText: "OK", headers: s.headers })
                : s,
          },
        ],
      }),
      "GET"
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,
      new e.CacheFirst({
        cacheName: "google-fonts-webfonts",
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 31536e3 })],
      }),
      "GET"
    ),
    e.registerRoute(
      /^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,
      new e.StaleWhileRevalidate({
        cacheName: "google-fonts-stylesheets",
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 })],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-font-assets",
        plugins: [new e.ExpirationPlugin({ maxEntries: 4, maxAgeSeconds: 604800 })],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-image-assets",
        plugins: [new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 })],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/image\?url=.+$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-image",
        plugins: [new e.ExpirationPlugin({ maxEntries: 64, maxAgeSeconds: 86400 })],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:mp3|wav|ogg)$/i,
      new e.CacheFirst({
        cacheName: "static-audio-assets",
        plugins: [new e.RangeRequestsPlugin(), new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:mp4)$/i,
      new e.CacheFirst({
        cacheName: "static-video-assets",
        plugins: [new e.RangeRequestsPlugin(), new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:js)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-js-assets",
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:css|less)$/i,
      new e.StaleWhileRevalidate({
        cacheName: "static-style-assets",
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      "GET"
    ),
    e.registerRoute(
      /\/_next\/data\/.+\/.+\.json$/i,
      new e.StaleWhileRevalidate({
        cacheName: "next-data",
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      "GET"
    ),
    e.registerRoute(
      /\.(?:json|xml|csv)$/i,
      new e.NetworkFirst({
        cacheName: "static-data-assets",
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1
        const s = e.pathname
        return !s.startsWith("/api/auth/") && !!s.startsWith("/api/")
      },
      new e.NetworkFirst({
        cacheName: "apis",
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({ maxEntries: 16, maxAgeSeconds: 86400 })],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: e }) => {
        if (!(self.origin === e.origin)) return !1
        return !e.pathname.startsWith("/api/")
      },
      new e.NetworkFirst({
        cacheName: "others",
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 86400 })],
      }),
      "GET"
    ),
    e.registerRoute(
      ({ url: e }) => !(self.origin === e.origin),
      new e.NetworkFirst({
        cacheName: "cross-origin",
        networkTimeoutSeconds: 10,
        plugins: [new e.ExpirationPlugin({ maxEntries: 32, maxAgeSeconds: 3600 })],
      }),
      "GET"
    )
})
