import "styles/tailwind.css"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full overflow-hidden bg-zinc-950">{children}</body>
    </html>
  )
}
