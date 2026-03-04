// HorizontalRow — scrollable horizontal card section
// wednesday-design: section heading, hidden scrollbar
// Used for Albums and Artists sections on home page

interface HorizontalRowProps {
  title: string
  children: React.ReactNode
}

export function HorizontalRow({ title, children }: HorizontalRowProps) {
  return (
    <section className="mb-10">
      <h2 className="text-xl font-bold text-white tracking-[-0.01em] mb-4">{title}</h2>
      <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-2">
        {children}
      </div>
    </section>
  )
}
