// Skeleton loading placeholder — wednesday-design: shimmer animation, dark surface color

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div className={`relative overflow-hidden bg-surface-elevated rounded-lg ${className}`}>
      <div className="absolute inset-0 shimmer-bg animate-shimmer" />
    </div>
  )
}
