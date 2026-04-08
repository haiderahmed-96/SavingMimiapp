export default function Skeleton({ className = "", style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`bg-border animate-pulse ${className}`} style={{ borderRadius: "var(--radius-md)", ...style }} />
  );
}

export function GoalCardSkeleton() {
  return (
    <div className="card" style={{ padding: "var(--spacing-md)" }}>
      <div className="flex items-center" style={{ gap: "var(--spacing-sm)", marginBottom: "var(--spacing-sm)" }}>
        <Skeleton className="w-11 h-11" style={{ borderRadius: "var(--radius-md)" }} />
        <div className="flex-1">
          <Skeleton className="w-24 h-3.5" style={{ marginBottom: "var(--spacing-sm)" }} />
          <Skeleton className="w-14 h-2.5" />
        </div>
        <Skeleton className="w-14 h-5" style={{ borderRadius: "var(--radius-sm)" }} />
      </div>
      <Skeleton className="w-full h-[5px]" style={{ borderRadius: 99, marginBottom: "var(--spacing-sm)" }} />
      <div className="flex justify-between">
        <Skeleton className="w-32 h-3.5" />
        <Skeleton className="w-8 h-3.5" />
      </div>
    </div>
  );
}
