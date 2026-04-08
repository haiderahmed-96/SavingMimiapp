import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoalStore } from "../stores/useGoalStore";
import GoalCard from "../components/GoalCard";
import { GoalCardSkeleton } from "../components/Skeleton";
import EmptyState from "../components/EmptyState";
import { SavingStatusMap } from "../types/enums";
import { Plus } from "lucide-react";

const STATUS_FILTERS = [
  { value: "", label: "الكل" },
  { value: "Active", label: "نشط" },
  { value: "Completed", label: "مكتمل" },
  { value: "Paused", label: "متوقف" },
  { value: "Cancelled", label: "ملغي" },
];

export default function GoalsList() {
  const { goals, loading, fetchGoals } = useGoalStore();
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const filtered = filter === "" ? goals : goals.filter((g) => g.status === filter);

  return (
    <div className="min-h-screen bg-surface-secondary">
      {/* Header */}
      <div className="bg-surface" style={{ padding: "var(--spacing-md) var(--spacing-lg)", paddingTop: 56 }}>
        <div className="flex items-center justify-between" style={{ marginBottom: "var(--spacing-md)" }}>
          <h1 className="text-[18px] font-bold text-text">أهداف الادخار</h1>
          <button
            onClick={() => navigate("/goals/new")}
            className="flex items-center text-[12px] font-semibold text-white bg-primary active:scale-[0.97] transition-transform"
            style={{ gap: "var(--spacing-xs)", padding: "var(--spacing-sm) var(--spacing-md)", borderRadius: "var(--radius-md)" }}
          >
            <Plus size={15} />
            جديد
          </button>
        </div>

        {/* Filters */}
        <div className="flex overflow-x-auto scrollbar-none" style={{ gap: "var(--spacing-xs)", paddingBottom: "var(--spacing-xs)" }}>
          {STATUS_FILTERS.map((f) => {
            const isActive = filter === f.value;
            const statusMeta = f.value ? SavingStatusMap[f.value] : null;
            return (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className="shrink-0 text-[11px] font-semibold transition-all active:scale-[0.97]"
                style={{
                  padding: "var(--spacing-xs) var(--spacing-md)",
                  borderRadius: "var(--radius-sm)",
                  background: isActive
                    ? statusMeta?.bg || "rgba(13,158,108,0.1)"
                    : "var(--color-surface-secondary)",
                  color: isActive
                    ? statusMeta?.color || "#0D9E6C"
                    : "var(--color-text-muted)",
                }}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-border" />

      {/* Goal List */}
      <div style={{ padding: "var(--spacing-md) var(--spacing-lg) var(--spacing-lg)" }}>
        {loading ? (
          <div className="flex flex-col" style={{ gap: "var(--spacing-sm)" }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <GoalCardSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="🎯"
            message={filter === "" ? "لا توجد أهداف بعد" : "لا توجد أهداف بهذه الحالة"}
            action={filter === "" ? { label: "إنشاء هدف جديد", onClick: () => navigate("/goals/new") } : undefined}
          />
        ) : (
          <div className="flex flex-col" style={{ gap: "var(--spacing-sm)" }}>
            {filtered.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
