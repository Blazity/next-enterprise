import "styles/tailwind.css"

// app/layout.tsx
export const metadata = {
  openGraph: {
    images: [
      {
        url: "/social-icon.svg", // Place it in public folder
        width: 800,
        height: 600,
        alt: "Social share image",
      },
    ],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
