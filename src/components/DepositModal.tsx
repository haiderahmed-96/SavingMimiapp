import { useState } from "react";
import Modal from "./Modal";
import { formatAmount } from "../utils/format";
import { Plus } from "lucide-react";

interface DepositModalProps {
  open: boolean;
  onClose: () => void;
  goalName: string;
  currentAmount: number;
  targetAmount: number;
  dailyAmount?: number | null;
  onDeposit: (amount: number) => Promise<void>;
}

const QUICK_AMOUNTS = [5000, 10000, 25000, 50000, 100000];

export default function DepositModal({ open, onClose, goalName, currentAmount, targetAmount, dailyAmount, onDeposit }: DepositModalProps) {
  const [amount, setAmount] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleClose = () => {
    setAmount("");
    onClose();
  };

  const handleSubmit = async () => {
    if (!amount || Number(amount) <= 0) return;
    setSubmitting(true);
    try {
      await onDeposit(Number(amount));
      setAmount("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose} title={`إيداع — ${goalName}`}>
      <div className="flex flex-col" style={{ gap: "var(--spacing-md)" }}>
        {/* Current progress */}
        <div
          className="flex items-center justify-between text-[12px] text-text-muted"
          style={{ padding: "var(--spacing-sm) var(--spacing-md)", background: "var(--color-surface-secondary)", borderRadius: "var(--radius-md)" }}
        >
          <span>الرصيد الحالي</span>
          <span className="font-bold text-text tabular-nums">{formatAmount(currentAmount)} / {formatAmount(targetAmount)} د.ع</span>
        </div>

        {/* Amount input */}
        <div>
          <label className="block text-[12px] font-semibold text-text-muted" style={{ marginBottom: "var(--spacing-xs)" }}>
            المبلغ (د.ع)
          </label>
          <input
            type="number"
            inputMode="numeric"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="أدخل المبلغ"
            className="w-full text-[16px] font-bold text-text bg-surface-secondary outline-none placeholder:text-text-muted/40 tabular-nums"
            style={{ padding: "var(--spacing-md)", borderRadius: "var(--radius-md)", border: "1.5px solid var(--color-border)" }}
            autoFocus
          />
        </div>

        {/* Daily amount suggestion */}
        {dailyAmount != null && dailyAmount > 0 && (
          <button
            onClick={() => setAmount(String(dailyAmount.toFixed(2)))}
            className="w-full text-[12px] font-medium bg-primary-light text-primary active:scale-[0.97] transition-transform"
            style={{ padding: "var(--spacing-sm) var(--spacing-sm)", borderRadius: "var(--radius-sm)" }}
          >
            المبلغ اليومي: {formatAmount(dailyAmount)} د.ع
          </button>
        )}

        {/* Quick amount chips */}
        <div className="flex flex-wrap" style={{ gap: "var(--spacing-xs)" }}>
          {QUICK_AMOUNTS.map((q) => (
            <button
              key={q}
              onClick={() => setAmount(String(q))}
              className="text-[11px] font-semibold text-primary active:scale-95 transition-transform"
              style={{
                padding: "var(--spacing-xs) var(--spacing-sm)",
                borderRadius: "var(--radius-sm)",
                background: amount === String(q) ? "rgba(13,158,108,0.12)" : "var(--color-surface-secondary)",
                border: amount === String(q) ? "1px solid rgba(13,158,108,0.3)" : "1px solid transparent",
              }}
            >
              +{formatAmount(q)}
            </button>
          ))}
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={submitting || !amount || Number(amount) <= 0}
          className="w-full flex items-center justify-center text-[14px] font-bold text-white bg-primary disabled:opacity-50 active:scale-[0.98] transition-all"
          style={{ padding: "var(--spacing-md)", borderRadius: "var(--radius-md)", gap: "var(--spacing-xs)" }}
        >
          {submitting ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Plus size={16} />
              تأكيد الإيداع
            </>
          )}
        </button>
      </div>
    </Modal>
  );
}
