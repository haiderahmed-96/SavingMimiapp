import { useNavigate } from "react-router-dom";
import { SavingTypeMap, SavingStatusMap } from "../types/enums";
import type { SavingGoal } from "../types";
import { formatAmount, calcProgress } from "../utils/format";
import { ChevronLeft, Plus } from "lucide-react";

interface GoalCardProps {
  goal: SavingGoal;
  onDepositClick?: (goal: SavingGoal) => void;
}

export default function GoalCard({ goal, onDepositClick }: GoalCardProps) {
  const navigate = useNavigate();
  const type = SavingTypeMap[goal.savingType] || SavingTypeMap.FixedDaily;
  const status = SavingStatusMap[goal.status] || SavingStatusMap.Active;
  const progress = Math.min(100, goal.progressPercent ?? calcProgress(goal.currentAmount, goal.targetAmount));
  const accentColor = type.color;
  const canDeposit = goal.status === "Active" && onDepositClick;

  return (
    <div
      className="group w-full text-start card transition-all duration-200 active:scale-[0.98] relative"
      style={{ padding: "var(--spacing-md)", display: "flex", alignItems: "center", gap: "var(--spacing-sm)", cursor: "pointer" }}
      onClick={() => navigate(`/goals/${goal.id}`)}
    >
      {/* Icon */}
      <div
        className="w-11 h-11 flex items-center justify-center text-lg shrink-0"
        style={{ borderRadius: "var(--radius-md)", background: `${accentColor}14` }}
      >
        {type.icon}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between" style={{ marginBottom: "var(--spacing-sm)" }}>
          <h3 className="text-[13px] font-semibold text-text truncate">{goal.goalName}</h3>
          <span
            className="inline-flex items-center px-2 py-0.5 text-[9px] font-semibold shrink-0"
            style={{ background: status.bg, color: status.color, borderRadius: "var(--radius-sm)", marginInlineStart: "var(--spacing-sm)" }}
          >
            {status.label}
          </span>
        </div>

        {/* Progress bar */}
        <div className="flex items-center" style={{ gap: "var(--spacing-sm)", marginBottom: "var(--spacing-sm)" }}>
          <div className="flex-1 h-[5px] rounded-full overflow-hidden bg-border">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out animate-progress-fill"
              style={{
                width: `${progress}%`,
                background: progress >= 100
                  ? "linear-gradient(90deg, #E5A100, #F59E0B)"
                  : `linear-gradient(90deg, ${accentColor}, ${accentColor}99)`,
              }}
            />
          </div>
          <span
            className="text-[10px] font-bold tabular-nums shrink-0"
            style={{ color: progress >= 100 ? "#E5A100" : accentColor }}
          >
            {progress.toFixed(0)}%
          </span>
        </div>

        {/* Amounts */}
        <div className="flex items-baseline" style={{ gap: "var(--spacing-xs)" }}>
          <span className="text-[13px] font-bold text-text tabular-nums">
            {formatAmount(goal.currentAmount)}
          </span>
          <span className="text-[10px] text-text-muted tabular-nums">
            / {formatAmount(goal.targetAmount)} د.ع
          </span>
        </div>
      </div>

      <ChevronLeft size={14} className="text-text-muted shrink-0 opacity-40 group-hover:opacity-100 transition-opacity" />

      {/* Quick deposit button */}
      {canDeposit && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDepositClick(goal);
          }}
          className="absolute flex items-center justify-center text-white active:scale-90 transition-transform"
          style={{
            width: 28,
            height: 28,
            borderRadius: "var(--radius-sm)",
            background: accentColor,
            bottom: 10,
            left: 10,
            boxShadow: `0 2px 8px ${accentColor}40`,
          }}
          aria-label="إيداع سريع"
        >
          <Plus size={15} strokeWidth={2.5} />
        </button>
      )}
    </div>
  );
}
