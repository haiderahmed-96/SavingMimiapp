import { SavingStatusMap } from "../types/enums";

interface StatusBadgeProps {
  status: string;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const s = SavingStatusMap[status] || SavingStatusMap.Active;
  return (
    <span
      className="inline-flex items-center text-[10px] font-semibold"
      style={{ gap: "var(--spacing-xs)", padding: "2px var(--spacing-sm)", borderRadius: "var(--radius-sm)", background: s.bg, color: s.color }}
    >
      <span className="w-1 h-1 rounded-full" style={{ background: s.color }} />
      {s.label}
    </span>
  );
}
