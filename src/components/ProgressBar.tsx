interface ProgressBarProps {
  percent: number;
  height?: string;
  showLabel?: boolean;
}

export default function ProgressBar({ percent, height = "h-1.5", showLabel = false }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));
  const thick = showLabel ? "h-5" : height;
  return (
    <div className={`relative w-full ${thick} rounded-full overflow-hidden bg-border`}>
      <div
        className="h-full rounded-full animate-progress-fill transition-all duration-700 ease-out"
        style={{
          width: `${clamped}%`,
          background: clamped >= 100
            ? "linear-gradient(90deg, #E5A100, #F59E0B)"
            : "linear-gradient(90deg, #0D9E6C, #34D399)",
        }}
      />
      {showLabel && (
        <span
          className="absolute inset-0 flex items-center justify-center text-[10px] font-bold"
          style={{ color: clamped > 20 ? "#fff" : "var(--color-text)" }}
        >
          {clamped.toFixed(0)}%
        </span>
      )}
    </div>
  );
}
