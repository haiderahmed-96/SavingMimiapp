import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGoalStore } from "../stores/useGoalStore";
import { useUIStore } from "../stores/useUIStore";
import { transactionService } from "../services/transactionService";
import { goalService } from "../services/goalService";
import { eventSavingService } from "../services/eventSavingService";
import { travelSavingService } from "../services/travelSavingService";
import { groupSavingService } from "../services/groupSavingService";
import { SavingTypeMap, ContributionTypeMap, EventTypeMap, CurrencyTypeMap } from "../types/enums";
import type { EventSaving, TravelSaving, GroupSaving } from "../types";
import { formatAmount, formatDateTime, calcProgress } from "../utils/format";
import ProgressBar from "../components/ProgressBar";
import StatusBadge from "../components/StatusBadge";
import Modal from "../components/Modal";
import Skeleton from "../components/Skeleton";
import { ArrowRight, ArrowDownLeft, ArrowUpRight, Pencil, Plus, Minus, Clock, Target } from "lucide-react";

export default function GoalDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentGoal, loading, fetchGoalDetails, clearCurrentGoal } = useGoalStore();
  const { showToast, triggerCelebration } = useUIStore();
  const fetchGoals = useGoalStore((s) => s.fetchGoals);

  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [eventData, setEventData] = useState<EventSaving | null>(null);
  const [travelData, setTravelData] = useState<TravelSaving | null>(null);
  const [groupData, setGroupData] = useState<GroupSaving | null>(null);

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editTarget, setEditTarget] = useState("");
  const [editDuration, setEditDuration] = useState("");

  useEffect(() => {
    if (id) fetchGoalDetails(Number(id));
    return () => clearCurrentGoal();
  }, [id, fetchGoalDetails, clearCurrentGoal]);

  useEffect(() => {
    if (!currentGoal) return;
    const goalId = currentGoal.id;
    if (currentGoal.savingType === "EventBased") {
      eventSavingService.get(goalId).then(setEventData).catch(() => {});
    } else if (currentGoal.savingType === "Travel") {
      travelSavingService.get(goalId).then(setTravelData).catch(() => {});
    } else if (currentGoal.savingType === "Group") {
      groupSavingService.get(goalId).then(setGroupData).catch(() => {});
    }
  }, [currentGoal]);

  const handleDeposit = async () => {
    if (!currentGoal || !amount || Number(amount) <= 0) return;
    setSubmitting(true);
    try {
      await transactionService.deposit(currentGoal.id, Number(amount));
      showToast("تم الإيداع بنجاح");
      setDepositOpen(false);
      setAmount("");
      await fetchGoalDetails(currentGoal.id);
      const updated = useGoalStore.getState().currentGoal;
      if (updated && updated.currentAmount >= updated.targetAmount) {
        triggerCelebration();
      }
      fetchGoals();
    } catch (err: unknown) {
      showToast((err as { error?: string })?.error || "فشل الإيداع", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleWithdraw = async () => {
    if (!currentGoal || !amount || Number(amount) <= 0) return;
    setSubmitting(true);
    try {
      await transactionService.withdraw(currentGoal.id, Number(amount));
      showToast("تم السحب بنجاح");
      setWithdrawOpen(false);
      setAmount("");
      fetchGoalDetails(currentGoal.id);
      fetchGoals();
    } catch (err: unknown) {
      showToast((err as { error?: string })?.error || "فشل السحب", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!currentGoal) return;
    setSubmitting(true);
    try {
      await goalService.update(currentGoal.id, {
        goalName: editName,
        targetAmount: Number(editTarget),
        durationDays: Number(editDuration),
      });
      showToast("تم التحديث بنجاح");
      setEditing(false);
      fetchGoalDetails(currentGoal.id);
      fetchGoals();
    } catch (err: unknown) {
      showToast((err as { error?: string })?.error || "فشل التحديث", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !currentGoal) {
    return (
      <div style={{ padding: "var(--spacing-lg)", paddingTop: 56 }}>
        <Skeleton className="w-full h-48" style={{ borderRadius: "var(--radius-lg)", marginBottom: "var(--spacing-md)" }} />
        <Skeleton className="w-full h-24" style={{ borderRadius: "var(--radius-lg)", marginBottom: "var(--spacing-sm)" }} />
        <Skeleton className="w-full h-24" style={{ borderRadius: "var(--radius-lg)" }} />
      </div>
    );
  }

  const goal = { ...currentGoal, transactions: currentGoal.transactions ?? [] };
  const type = SavingTypeMap[goal.savingType] || SavingTypeMap.FixedDaily;
  const progress = calcProgress(goal.currentAmount, goal.targetAmount);
  const dailyAmount = goal.savingType === "FixedDaily" ? goal.targetAmount / goal.durationDays : null;
  const remaining = goal.targetAmount - goal.currentAmount;

  const createdDate = new Date(goal.createdAt);
  const deadlineDate = new Date(createdDate.getTime() + goal.durationDays * 86400000);
  const now = new Date();
  const daysLeft = Math.max(0, Math.ceil((deadlineDate.getTime() - now.getTime()) / 86400000));

  return (
    <div className="min-h-screen bg-surface-secondary">
      {/* Header */}
      <div className="bg-surface flex items-center justify-between" style={{ padding: "var(--spacing-md) var(--spacing-lg)", paddingTop: 56 }}>
        <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center bg-surface-secondary active:scale-95 transition-transform" style={{ borderRadius: "var(--radius-sm)" }}>
          <ArrowRight size={18} className="text-text" />
        </button>
        <h1 className="text-[16px] font-bold text-text">تفاصيل الهدف</h1>
        <button
          onClick={() => {
            setEditName(goal.goalName);
            setEditTarget(String(goal.targetAmount));
            setEditDuration(String(goal.durationDays));
            setEditing(true);
          }}
          className="w-9 h-9 flex items-center justify-center bg-surface-secondary active:scale-95 transition-transform"
          style={{ borderRadius: "var(--radius-sm)" }}
        >
          <Pencil size={16} className="text-text-secondary" />
        </button>
      </div>

      <div style={{ padding: "var(--spacing-md) var(--spacing-lg) var(--spacing-lg)" }}>
        {/* Hero Card */}
        <div className="card" style={{ padding: "var(--spacing-lg)", marginBottom: "var(--spacing-md)" }}>
          <div className="flex items-center" style={{ gap: "var(--spacing-sm)", marginBottom: "var(--spacing-lg)" }}>
            <div className="w-12 h-12 flex items-center justify-center text-xl" style={{ borderRadius: "var(--radius-md)", background: `${type.color}14` }}>
              {type.icon}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-[15px] font-bold text-text truncate">{goal.goalName}</h2>
              <div className="flex items-center" style={{ gap: "var(--spacing-sm)", marginTop: "var(--spacing-xs)" }}>
                <span className="text-[11px] text-text-muted">{type.label}</span>
                <StatusBadge status={goal.status} />
              </div>
            </div>
          </div>

          {/* Amount display */}
          <div className="text-center" style={{ marginBottom: "var(--spacing-lg)" }}>
            <p className="text-[11px] text-text-muted" style={{ marginBottom: "var(--spacing-xs)" }}>المبلغ الحالي</p>
            <p className="text-[32px] font-extrabold text-text leading-none tabular-nums">
              {formatAmount(goal.currentAmount)}
            </p>
            <p className="text-[12px] text-text-muted" style={{ marginTop: "var(--spacing-xs)" }}>من {formatAmount(goal.targetAmount)} د.ع</p>
          </div>

          {/* Progress */}
          <div style={{ marginBottom: "var(--spacing-sm)" }}>
            <div className="flex items-center justify-between" style={{ marginBottom: "var(--spacing-sm)" }}>
              <span className="text-[11px] text-text-muted">التقدم</span>
              <span className="text-[12px] font-bold tabular-nums text-primary">{progress.toFixed(0)}%</span>
            </div>
            <ProgressBar percent={progress} showLabel height="h-5" />
          </div>

          {dailyAmount && (
            <p className="text-center text-text-muted text-[11px] mt-3">
              المبلغ اليومي المقترح: <span className="font-semibold text-primary">{formatAmount(dailyAmount)} د.ع</span>
            </p>
          )}

          {/* Motivation */}
          {progress < 100 && progress >= 25 && (
            <div className="mt-4 text-center">
              <p className="text-[12px] font-medium text-primary">
                {progress >= 75 ? "أنت قريب جداً من هدفك! 🔥" : progress >= 50 ? "أحسنت! أنجزت أكثر من النصف 💪" : "أنت على الطريق الصحيح 🎯"}
              </p>
            </div>
          )}
          {progress >= 100 && (
            <div className="mt-4 text-center">
              <p className="text-[12px] font-bold text-warning">مبارك! لقد حققت هدفك 🏆</p>
            </div>
          )}
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2" style={{ gap: "var(--spacing-sm)", marginBottom: "var(--spacing-md)" }}>
          <div className="card text-center" style={{ padding: "var(--spacing-md)" }}>
            <div className="flex items-center justify-center" style={{ gap: "var(--spacing-xs)", marginBottom: "var(--spacing-xs)" }}>
              <Clock size={13} className="text-text-muted" />
              <p className="text-[11px] text-text-muted">المتبقي</p>
            </div>
            <p className="text-[18px] font-bold text-text tabular-nums">{daysLeft}</p>
            <p className="text-[10px] text-text-muted">يوم</p>
          </div>
          <div className="card text-center" style={{ padding: "var(--spacing-md)" }}>
            <div className="flex items-center justify-center" style={{ gap: "var(--spacing-xs)", marginBottom: "var(--spacing-xs)" }}>
              <Target size={13} className="text-text-muted" />
              <p className="text-[11px] text-text-muted">المبلغ المتبقي</p>
            </div>
            <p className="text-[18px] font-bold text-text tabular-nums">{formatAmount(remaining > 0 ? remaining : 0)}</p>
            <p className="text-[10px] text-text-muted">د.ع</p>
          </div>
        </div>

        {/* Type-specific */}
        {goal.savingType === "EventBased" && eventData && (
          <div className="card" style={{ padding: "var(--spacing-md)", marginBottom: "var(--spacing-md)" }}>
            <h3 className="text-[13px] font-bold text-text" style={{ marginBottom: "var(--spacing-sm)" }}>🎉 تفاصيل المناسبة</h3>
            <div className="flex justify-between text-[12px]">
              <span className="text-text-muted">النوع</span>
              <span className="text-text-secondary font-medium">{EventTypeMap[eventData.eventType]?.label || "أخرى"}</span>
            </div>
            <div className="flex justify-between text-[12px]" style={{ marginTop: "var(--spacing-sm)" }}>
              <span className="text-text-muted">التاريخ</span>
              <span className="text-text-secondary font-medium">{new Date(eventData.eventDate).toLocaleDateString("ar-u-nu-latn")}</span>
            </div>
          </div>
        )}

        {goal.savingType === "Travel" && travelData && (
          <div className="card" style={{ padding: "var(--spacing-md)", marginBottom: "var(--spacing-md)" }}>
            <h3 className="text-[13px] font-bold text-text" style={{ marginBottom: "var(--spacing-sm)" }}>✈️ تفاصيل السفر</h3>
            <div className="flex justify-between text-[12px]">
              <span className="text-text-muted">الوجهة</span>
              <span className="text-text-secondary font-medium">{travelData.country}</span>
            </div>
            <div className="flex justify-between text-[12px]" style={{ marginTop: "var(--spacing-sm)" }}>
              <span className="text-text-muted">المبلغ المعادل</span>
              <span className="text-text-secondary font-medium">{formatAmount(travelData.equivalentAmount)} {CurrencyTypeMap[travelData.currencyType]?.symbol}</span>
            </div>
          </div>
        )}

        {goal.savingType === "Group" && groupData && (
          <div className="card" style={{ padding: "var(--spacing-md)", marginBottom: "var(--spacing-md)" }}>
            <h3 className="text-[13px] font-bold text-text" style={{ marginBottom: "var(--spacing-sm)" }}>👥 أعضاء المجموعة</h3>
            {groupData.groupMembers.map((m) => (
              <div key={m.id} className="flex items-center justify-between text-[12px]" style={{ paddingBlock: "var(--spacing-xs)" }}>
                <span className="text-text-secondary">مستخدم #{m.userId}</span>
                <span className="text-text-muted">{m.role === 1 ? "مالك" : "عضو"}</span>
              </div>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="grid grid-cols-2" style={{ gap: "var(--spacing-sm)", marginBottom: "var(--spacing-lg)" }}>
          <button
            onClick={() => { setAmount(""); setDepositOpen(true); }}
            className="flex items-center justify-center h-12 font-bold text-[14px] text-white bg-primary active:scale-[0.97] transition-all"
            style={{ gap: "var(--spacing-sm)", borderRadius: "var(--radius-md)" }}
          >
            <Plus size={18} strokeWidth={2.5} />
            إيداع
          </button>
          <button
            onClick={() => { setAmount(""); setWithdrawOpen(true); }}
            className="flex items-center justify-center h-12 font-semibold text-[14px] border border-border text-text-secondary bg-surface active:scale-[0.97] transition-all"
            style={{ gap: "var(--spacing-sm)", borderRadius: "var(--radius-md)" }}
          >
            <Minus size={18} strokeWidth={2.5} />
            سحب
          </button>
        </div>

        {/* Transactions */}
        <div>
          <h3 className="text-[14px] font-bold text-text" style={{ marginBottom: "var(--spacing-md)" }}>آخر العمليات</h3>
          {goal.transactions.length === 0 ? (
            <p className="text-[13px] text-text-muted text-center" style={{ paddingBlock: "var(--spacing-xl)" }}>لا توجد عمليات بعد</p>
          ) : (
            <div className="flex flex-col" style={{ gap: "var(--spacing-sm)" }}>
              {goal.transactions.map((t) => {
                const ct = ContributionTypeMap[t.contributionType] || ContributionTypeMap.Deposit;
                const isWithdraw = t.contributionType === "Withdrawal";
                return (
                  <div key={t.id} className="card flex items-center justify-between" style={{ padding: "var(--spacing-sm) var(--spacing-md)" }}>
                    <div className="flex items-center" style={{ gap: "var(--spacing-sm)" }}>
                      <div
                        className="w-9 h-9 flex items-center justify-center"
                        style={{ borderRadius: "var(--radius-sm)" }}
                        style={{ background: isWithdraw ? "var(--color-danger-light)" : "var(--color-primary-light)" }}
                      >
                        {isWithdraw ? (
                          <ArrowUpRight size={17} className="text-danger" />
                        ) : (
                          <ArrowDownLeft size={17} className="text-primary" />
                        )}
                      </div>
                      <div>
                        <p className="text-[13px] font-medium text-text">{ct.label}</p>
                        <p className="text-[10px] text-text-muted mt-0.5">{formatDateTime(t.createdAt)}</p>
                      </div>
                    </div>
                    <p className="font-bold text-[13px] tabular-nums" style={{ color: isWithdraw ? "var(--color-danger)" : "var(--color-primary)" }}>
                      {isWithdraw ? "-" : "+"}{formatAmount(t.amount)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Deposit Modal */}
      <Modal open={depositOpen} onClose={() => setDepositOpen(false)} title="إيداع مبلغ">
        <div style={{ marginBottom: "var(--spacing-md)" }}>
          <label className="block text-[12px] text-text-secondary font-medium" style={{ marginBottom: "var(--spacing-sm)" }}>المبلغ (د.ع)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            className="input-field text-xl font-bold text-center"
            min="0"
            step="0.01"
          />
        </div>
        {dailyAmount && (
          <button
            onClick={() => setAmount(String(dailyAmount.toFixed(2)))}
            className="w-full text-[12px] font-medium bg-primary-light text-primary active:scale-[0.97] transition-transform"
            style={{ marginBottom: "var(--spacing-md)", padding: "var(--spacing-sm) var(--spacing-sm)", borderRadius: "var(--radius-sm)" }}
          >
            المبلغ اليومي: {formatAmount(dailyAmount)} د.ع
          </button>
        )}
        <button
          onClick={handleDeposit}
          disabled={submitting || !amount || Number(amount) <= 0}
          className="w-full h-12 font-bold text-[14px] text-white bg-primary disabled:opacity-50 active:scale-[0.97] transition-transform"
          style={{ borderRadius: "var(--radius-md)" }}
        >
          {submitting ? "جاري الإيداع..." : "تأكيد الإيداع"}
        </button>
      </Modal>

      {/* Withdraw Modal */}
      <Modal open={withdrawOpen} onClose={() => setWithdrawOpen(false)} title="سحب مبلغ">
        <div className="bg-surface-secondary text-center" style={{ borderRadius: "var(--radius-md)", padding: "var(--spacing-md)", marginBottom: "var(--spacing-md)" }}>
          <p className="text-[11px] text-text-muted" style={{ marginBottom: "var(--spacing-xs)" }}>الرصيد الحالي</p>
          <p className="text-xl font-bold text-text tabular-nums">{formatAmount(goal.currentAmount)} د.ع</p>
        </div>
        {goal.currentAmount === 0 ? (
          <p className="text-center text-text-muted text-[14px] py-4">لا يوجد رصيد للسحب</p>
        ) : (
          <>
            <div style={{ marginBottom: "var(--spacing-md)" }}>
              <label className="block text-[12px] text-text-secondary font-medium" style={{ marginBottom: "var(--spacing-sm)" }}>المبلغ (د.ع)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                max={goal.currentAmount}
                className="input-field text-xl font-bold text-center"
                style={{ borderColor: "var(--color-danger)" }}
                min="0"
                step="0.01"
              />
            </div>
            <button
              onClick={handleWithdraw}
              disabled={submitting || !amount || Number(amount) <= 0 || Number(amount) > goal.currentAmount}
              className="w-full h-12 font-bold text-[14px] text-white bg-danger disabled:opacity-50 active:scale-[0.97] transition-transform"
              style={{ borderRadius: "var(--radius-md)" }}
            >
              {submitting ? "جاري السحب..." : "تأكيد السحب"}
            </button>
          </>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal open={editing} onClose={() => setEditing(false)} title="تعديل الهدف">
        <div className="flex flex-col" style={{ gap: "var(--spacing-md)", marginBottom: "var(--spacing-lg)" }}>
          <div>
            <label className="block text-[12px] text-text-secondary font-medium" style={{ marginBottom: "var(--spacing-sm)" }}>اسم الهدف</label>
            <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="input-field" />
          </div>
          <div>
            <label className="block text-[12px] text-text-secondary font-medium" style={{ marginBottom: "var(--spacing-sm)" }}>المبلغ المستهدف</label>
            <input type="number" value={editTarget} onChange={(e) => setEditTarget(e.target.value)} className="input-field" min="1" />
          </div>
          <div>
            <label className="block text-[12px] text-text-secondary font-medium" style={{ marginBottom: "var(--spacing-sm)" }}>المدة (أيام)</label>
            <input type="number" value={editDuration} onChange={(e) => setEditDuration(e.target.value)} className="input-field" min="1" />
          </div>
        </div>
        <button
          onClick={handleEdit}
          disabled={submitting || !editName || Number(editTarget) <= 0 || Number(editDuration) <= 0}
          className="w-full h-12 font-bold text-[14px] text-white bg-primary disabled:opacity-50 active:scale-[0.97] transition-transform"
          style={{ borderRadius: "var(--radius-md)" }}
        >
          {submitting ? "جاري الحفظ..." : "حفظ التعديلات"}
        </button>
      </Modal>
    </div>
  );
}
