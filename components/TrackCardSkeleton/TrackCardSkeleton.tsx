export function TrackCardSkeleton() {
  return (
    <div className="bg-aura-card flex w-full animate-pulse flex-col gap-3 overflow-hidden rounded-xl border border-white/5 p-4 shadow-lg backdrop-blur-md">
      {/* Album Art Skeleton */}
      <div className="relative aspect-square w-full rounded-lg bg-slate-800" />

      {/* Track Info Skeleton */}
      <div className="mt-1 w-full min-w-0 flex-1 space-y-2">
        <div className="h-4 w-3/4 rounded bg-slate-700/50" />
        <div className="h-3 w-1/2 rounded bg-slate-800/50" />
      </div>
    </div>
  )
}
