
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGoalStore } from "../stores/useGoalStore";
import { useUIStore } from "../stores/useUIStore";
import { transactionService } from "../services/transactionService";
import { formatAmount } from "../utils/format";
import GoalCard from "../components/GoalCard";
import DepositModal from "../components/DepositModal";
import { GoalCardSkeleton } from "../components/Skeleton";
import EmptyState from "../components/EmptyState";
import { Bell, ChevronLeft, Plus } from "lucide-react";
import { useNotificationStore } from "../stores/useNotificationStore";
import type { SavingGoal } from "../types";

export default function Dashboard() {
  const { goals, loading, fetchGoals } = useGoalStore();
  const { showToast, triggerCelebration } = useUIStore();
  const navigate = useNavigate();
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const [depositGoal, setDepositGoal] = useState<SavingGoal | null>(null);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const activeGoals = goals.filter((g) => g.status === "Active");

  const overallProgress = totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0;

  return (
    <div className="bg-surface-secondary">
      {/* ── Header ── */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0D9E6C 0%, #087A52 100%)", minHeight: 200 }}>
        <div className="absolute top-0 left-0 w-40 h-40 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full bg-white/5 translate-x-1/3 translate-y-1/3" />

        <div className="relative" style={{ padding: "var(--spacing-lg)", paddingTop: "var(--spacing-2xl)", paddingBottom: 40 }}>
          <div className="flex items-center justify-between" style={{ marginBottom: "var(--spacing-lg)" }}>
            <div>
              <h1 className="text-white text-[24px] font-bold" style={{ marginBottom: "var(--spacing-xs)" }}>القاصة</h1>
              <p className="text-white/70 text-[14px]">خلي هدف وجمع فلوسك</p>
            </div>
            <button
              onClick={() => navigate("/notifications")}
              className="relative w-11 h-11 rounded-xl bg-white/12 flex items-center justify-center active:scale-95 transition-transform"
            >
              <Bell size={20} className="text-white" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-danger text-white text-[9px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>
          </div>

          <p className="text-white/80 text-[16px] font-medium" style={{ marginBottom: "var(--spacing-sm)" }}>مرحباً 👋</p>
          <p className="text-white text-[28px] font-extrabold tabular-nums leading-tight">
            {formatAmount(totalSaved)} <span className="text-[14px] font-normal text-white/60">د.ع</span>
          </p>
          <p className="text-white/50 text-[12px]" style={{ marginTop: "var(--spacing-xs)" }}>إجمالي مدخراتك</p>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="relative z-10" style={{ padding: "var(--spacing-lg)", paddingTop: "var(--spacing-lg)", paddingBottom: "var(--spacing-lg)" }}>
        {/* Progress Card */}
        <div className="bg-surface" style={{ borderRadius: "var(--radius-lg)", padding: "var(--spacing-md)", marginBottom: "var(--spacing-lg)", boxShadow: "var(--shadow-md)" }}>
          <div className="flex items-center justify-between" style={{ marginBottom: "var(--spacing-sm)" }}>
            <p className="text-[14px] text-text font-semibold">تقدم الأهداف</p>
            <span className="text-[13px] text-primary font-bold">
              {overallProgress}%
            </span>
          </div>
          <p className="text-[12px] text-text-muted" style={{ marginBottom: "var(--spacing-md)" }}>نسبة تحقيق جميع أهدافك</p>
          <div className="h-3 rounded-full overflow-hidden bg-border">
            <div
              className="h-full rounded-full transition-all duration-1000 ease-out animate-progress-fill"
              style={{
                width: `${Math.min(overallProgress, 100)}%`,
                background: "linear-gradient(90deg, #0D9E6C, #34D399)",
              }}
            />
          </div>
          <div className="flex items-center justify-between" style={{ marginTop: "var(--spacing-sm)" }}>
            <span className="text-[11px] text-text-muted">{formatAmount(totalSaved)} د.ع محقق</span>
            <span className="text-[11px] text-text-muted">{formatAmount(totalTarget)} د.ع الهدف</span>
          </div>
        </div>

        {/* Active Goals */}
        <div>
          <div className="flex items-center justify-between" style={{ marginBottom: "var(--spacing-md)" }}>
            <h2 className="text-[15px] font-bold text-text">أهدافك النشطة</h2>
            {activeGoals.length > 0 && (
              <button
                onClick={() => navigate("/goals")}
                className="text-primary text-[12px] font-semibold flex items-center gap-1 active:opacity-70"
              >
                عرض الكل
                <ChevronLeft size={14} />
              </button>
            )}
          </div>

          {loading ? (
            <div className="flex flex-col" style={{ gap: "var(--spacing-sm)" }}>
              <GoalCardSkeleton />
              <GoalCardSkeleton />
            </div>
          ) : activeGoals.length === 0 ? (
            <EmptyState
              icon="🎯"
              message="لا توجد أهداف نشطة بعد. ابدأ بإنشاء هدف جديد!"
            />
          ) : (
            <div className="flex flex-col" style={{ gap: "var(--spacing-sm)" }}>
              {activeGoals.slice(0, 4).map((goal) => (
                <GoalCard key={goal.id} goal={goal} onDepositClick={setDepositGoal} />
              ))}
            </div>
          )}

          {/* Create Goal Button */}
          <button
            onClick={() => navigate("/goals/new")}
            className="w-full flex items-center justify-center text-[13px] font-semibold text-white bg-primary active:scale-[0.97] transition-transform"
            style={{ gap: "var(--spacing-xs)", padding: "var(--spacing-md)", borderRadius: "var(--radius-md)", marginTop: "var(--spacing-md)" }}
          >
            <Plus size={16} />
            إنشاء هدف
          </button>
        </div>
      </div>

      {/* Quick Deposit Modal */}
      {depositGoal && (
        <DepositModal
          open={!!depositGoal}
          onClose={() => setDepositGoal(null)}
          goalName={depositGoal.goalName}
          currentAmount={depositGoal.currentAmount}
          targetAmount={depositGoal.targetAmount}
          onDeposit={async (amount) => {
            try {
              await transactionService.deposit(depositGoal.id, amount);
              showToast("تم الإيداع بنجاح");
              setDepositGoal(null);
              await fetchGoals();
              const updated = goals.find((g) => g.id === depositGoal.id);
              if (updated && updated.currentAmount + amount >= updated.targetAmount) {
                triggerCelebration();
              }
            } catch (err: unknown) {
              showToast((err as { error?: string })?.error || "فشل الإيداع", "error");
            }
          }}
        />
      )}
    </div>
  );
}
