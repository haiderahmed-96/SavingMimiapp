import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { goalService } from "../services/goalService";
import { eventSavingService } from "../services/eventSavingService";
import { travelSavingService } from "../services/travelSavingService";
import { groupSavingService } from "../services/groupSavingService";
import { SavingTypeMap, EventTypeMap, CurrencyTypeMap } from "../types/enums";
import { useUIStore } from "../stores/useUIStore";
import { useGoalStore } from "../stores/useGoalStore";
import { ArrowRight } from "lucide-react";
import { formatAmount } from "../utils/format";

export default function CreateGoal() {
  const navigate = useNavigate();
  const { showToast } = useUIStore();
  const fetchGoals = useGoalStore((s) => s.fetchGoals);

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [durationDays, setDurationDays] = useState("");
  const [savingType, setSavingType] = useState("FixedDaily");

  const [eventType, setEventType] = useState(1);
  const [eventDate, setEventDate] = useState("");

  const [country, setCountry] = useState("");
  const [currencyType, setCurrencyType] = useState(1);
  const [equivalentAmount, setEquivalentAmount] = useState("");

  const needsStep2 = savingType === "EventBased" || savingType === "Travel" || savingType === "Group";
  const dailyAmount = savingType === "FixedDaily" && Number(targetAmount) > 0 && Number(durationDays) > 0
    ? Number(targetAmount) / Number(durationDays)
    : null;

  const handleStep1Next = () => {
    if (!goalName || Number(targetAmount) <= 0 || Number(durationDays) <= 0) {
      showToast("يرجى ملء جميع الحقول بشكل صحيح", "error");
      return;
    }
    if (needsStep2) {
      setStep(2);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const result = await goalService.create({
        goalName,
        targetAmount: Number(targetAmount),
        durationDays: Number(durationDays),
        savingType,
      });
      const goalId = result.id;

      if (savingType === "EventBased" && eventDate) {
        await eventSavingService.create({
          savingGoalId: goalId,
          eventDate: new Date(eventDate).toISOString(),
          eventType,
        });
      } else if (savingType === "Travel" && country) {
        await travelSavingService.create({
          savingGoalId: goalId,
          country,
          currencyType,
          equivalentAmount: Number(equivalentAmount),
        });
      } else if (savingType === "Group") {
        await groupSavingService.create(goalId);
      }

      showToast("تم إنشاء الهدف بنجاح! 🎯");
      fetchGoals();
      navigate(`/goals/${goalId}`);
    } catch (err: unknown) {
      showToast((err as { error?: string })?.error || "فشل إنشاء الهدف", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-secondary">
      {/* Header */}
      <div className="bg-surface flex items-center" style={{ padding: "var(--spacing-md) var(--spacing-lg)", paddingTop: 56, gap: "var(--spacing-sm)" }}>
        <button
          onClick={() => (step === 2 ? setStep(1) : navigate(-1))}
          className="w-9 h-9 flex items-center justify-center bg-surface-secondary active:scale-95 transition-transform"
          style={{ borderRadius: "var(--radius-sm)" }}
        >
          <ArrowRight size={18} className="text-text" />
        </button>
        <h1 className="text-[16px] font-bold text-text">
          {step === 1 ? "إنشاء هدف جديد" : "معلومات إضافية"}
        </h1>
      </div>

      <div className="h-px bg-border" />

      <div style={{ padding: "var(--spacing-lg)", paddingBottom: "var(--spacing-xl)" }}>
        {/* Step indicator */}
        {needsStep2 && (
          <div className="flex" style={{ gap: "var(--spacing-sm)", marginBottom: "var(--spacing-lg)" }}>
            <div className="flex-1 h-1 rounded-full bg-primary" />
            <div className="flex-1 h-1 rounded-full" style={{ background: step === 2 ? "var(--color-primary)" : "var(--color-border)" }} />
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col" style={{ gap: "var(--spacing-md)" }}>
            <div>
              <label className="block text-[12px] text-text-secondary font-medium" style={{ marginBottom: "var(--spacing-sm)" }}>اسم الهدف</label>
              <input type="text" value={goalName} onChange={(e) => setGoalName(e.target.value)} placeholder="مثال: شراء لابتوب" className="input-field" />
            </div>

            <div>
              <label className="block text-[12px] text-text-secondary font-medium" style={{ marginBottom: "var(--spacing-sm)" }}>المبلغ المستهدف (د.ع)</label>
              <input type="number" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} placeholder="0" className="input-field" min="1" />
            </div>

            <div>
              <label className="block text-[12px] text-text-secondary font-medium" style={{ marginBottom: "var(--spacing-sm)" }}>المدة (أيام)</label>
              <input type="number" value={durationDays} onChange={(e) => setDurationDays(e.target.value)} placeholder="90" className="input-field" min="1" />
            </div>

            <div>
              <label className="block text-[12px] text-text-secondary font-medium" style={{ marginBottom: "var(--spacing-sm)" }}>نوع الادخار</label>
              <div className="grid grid-cols-2" style={{ gap: "var(--spacing-sm)" }}>
                {Object.entries(SavingTypeMap).map(([key, val]) => {
                  const isSelected = savingType === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setSavingType(key)}
                      className="flex items-center border transition-all text-start active:scale-[0.97]"
                      style={{
                        gap: "var(--spacing-sm)",
                        padding: "var(--spacing-sm)",
                        borderRadius: "var(--radius-md)",
                        background: isSelected ? `${val.color}0A` : "var(--color-surface)",
                        borderColor: isSelected ? val.color : "var(--color-border)",
                        borderWidth: isSelected ? "1.5px" : "1px",
                      }}
                    >
                      <span className="text-lg">{val.icon}</span>
                      <span className="text-[12px] font-medium" style={{ color: isSelected ? val.color : "var(--color-text-secondary)" }}>
                        {val.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {dailyAmount && (
              <div className="bg-primary-light text-center" style={{ borderRadius: "var(--radius-md)", padding: "var(--spacing-sm) var(--spacing-md)" }}>
                <p className="text-[11px] text-text-muted" style={{ marginBottom: "var(--spacing-xs)" }}>المبلغ اليومي المقترح</p>
                <p className="text-[16px] font-bold text-primary">{formatAmount(dailyAmount)} د.ع</p>
              </div>
            )}

            <button
              onClick={handleStep1Next}
              disabled={submitting}
              className="w-full h-12 font-bold text-[14px] text-white bg-primary disabled:opacity-50 active:scale-[0.97] transition-transform"
              style={{ borderRadius: "var(--radius-md)", marginTop: "var(--spacing-sm)" }}
            >
              {submitting ? "جاري الإنشاء..." : needsStep2 ? "التالي" : "إنشاء الهدف"}
            </button>
          </div>
        )}

        {step === 2 && savingType === "EventBased" && (
          <div className="flex flex-col" style={{ gap: "var(--spacing-md)" }}>
            <div>
              <label className="block text-[12px] text-text-secondary font-medium" style={{ marginBottom: "var(--spacing-sm)" }}>نوع المناسبة</label>
              <div className="grid grid-cols-2" style={{ gap: "var(--spacing-sm)" }}>
                {Object.entries(EventTypeMap).map(([key, val]) => {
                  const k = Number(key);
                  const isSelected = eventType === k;
                  return (
                    <button
                      key={k}
                      onClick={() => setEventType(k)}
                      className="border text-[12px] text-start transition-all active:scale-[0.97]"
                      style={{
                        padding: "var(--spacing-sm)",
                        borderRadius: "var(--radius-md)",
                        background: isSelected ? "var(--color-primary-light)" : "var(--color-surface)",
                        borderColor: isSelected ? "var(--color-primary)" : "var(--color-border)",
                        color: isSelected ? "var(--color-primary)" : "var(--color-text-secondary)",
                        fontWeight: isSelected ? 600 : 400,
                      }}
                    >
                      {val.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="block text-[12px] text-text-secondary font-medium" style={{ marginBottom: "var(--spacing-sm)" }}>تاريخ المناسبة</label>
              <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="input-field" />
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitting || !eventDate}
              className="w-full h-12 font-bold text-[14px] text-white bg-primary disabled:opacity-50 active:scale-[0.97] transition-transform"
              style={{ borderRadius: "var(--radius-md)", marginTop: "var(--spacing-sm)" }}
            >
              {submitting ? "جاري الإنشاء..." : "إنشاء الهدف"}
            </button>
          </div>
        )}

        {step === 2 && savingType === "Travel" && (
          <div className="flex flex-col" style={{ gap: "var(--spacing-md)" }}>
            <div>
              <label className="block text-[12px] text-text-secondary font-medium" style={{ marginBottom: "var(--spacing-sm)" }}>الدولة</label>
              <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="مثال: تركيا" className="input-field" />
            </div>
            <div>
              <label className="block text-[12px] text-text-secondary font-medium" style={{ marginBottom: "var(--spacing-sm)" }}>العملة</label>
              <div className="grid grid-cols-2" style={{ gap: "var(--spacing-sm)" }}>
                {Object.entries(CurrencyTypeMap).map(([key, val]) => {
                  const k = Number(key);
                  const isSelected = currencyType === k;
                  return (
                    <button
                      key={k}
                      onClick={() => setCurrencyType(k)}
                      className="border text-[12px] text-start transition-all active:scale-[0.97]"
                      style={{
                        padding: "var(--spacing-sm)",
                        borderRadius: "var(--radius-md)",
                        background: isSelected ? "var(--color-primary-light)" : "var(--color-surface)",
                        borderColor: isSelected ? "var(--color-primary)" : "var(--color-border)",
                        color: isSelected ? "var(--color-primary)" : "var(--color-text-secondary)",
                        fontWeight: isSelected ? 600 : 400,
                      }}
                    >
                      {val.symbol} {val.label}
                    </button>
                  );
                })}
              </div>
            </div>
            <div>
              <label className="block text-[12px] text-text-secondary font-medium" style={{ marginBottom: "var(--spacing-sm)" }}>المبلغ المعادل</label>
              <input type="number" value={equivalentAmount} onChange={(e) => setEquivalentAmount(e.target.value)} placeholder="0" className="input-field" min="1" />
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitting || !country || Number(equivalentAmount) <= 0}
              className="w-full h-12 font-bold text-[14px] text-white bg-primary disabled:opacity-50 active:scale-[0.97] transition-transform"
              style={{ borderRadius: "var(--radius-md)", marginTop: "var(--spacing-sm)" }}
            >
              {submitting ? "جاري الإنشاء..." : "إنشاء الهدف"}
            </button>
          </div>
        )}

        {step === 2 && savingType === "Group" && (
          <div className="flex flex-col" style={{ gap: "var(--spacing-md)" }}>
            <div className="card text-center" style={{ padding: "var(--spacing-lg)" }}>
              <span className="text-4xl block" style={{ marginBottom: "var(--spacing-sm)" }}>👥</span>
              <p className="text-[13px] text-text-secondary leading-relaxed">
                سيتم إنشاء مجموعة ادخار وإضافتك كمالك. يمكنك إضافة أعضاء لاحقاً.
              </p>
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full h-12 font-bold text-[14px] text-white bg-primary disabled:opacity-50 active:scale-[0.97] transition-transform"
              style={{ borderRadius: "var(--radius-md)", marginTop: "var(--spacing-sm)" }}
            >
              {submitting ? "جاري الإنشاء..." : "إنشاء الهدف والمجموعة"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
