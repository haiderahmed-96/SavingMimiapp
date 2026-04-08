import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { Eye, EyeOff, Phone, Lock, User, PiggyBank } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();
  const { register, loading, error } = useAuthStore();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await register(name, phone, password);
    if (ok) navigate("/", { replace: true });
  };

  return (
    <div className="min-h-screen bg-surface-secondary flex flex-col">
      {/* Header */}
      <div
        className="text-center"
        style={{ padding: "var(--spacing-lg)", paddingTop: "var(--spacing-2xl)", paddingBottom: 80, background: "linear-gradient(180deg, #0D9E6C 0%, #087A52 100%)", borderRadius: "0 0 var(--radius-xl) var(--radius-xl)" }}
      >
        <div className="w-16 h-16 bg-white/20 flex items-center justify-center mx-auto" style={{ borderRadius: "var(--radius-lg)", marginBottom: "var(--spacing-md)" }}>
          <PiggyBank size={32} className="text-white" />
        </div>
        <h1 className="text-white text-[26px] font-bold" style={{ marginBottom: "var(--spacing-xs)" }}>القاصة</h1>
        <p className="text-white/70 text-[14px]">إنشاء حساب جديد</p>
      </div>

      {/* Form */}
      <div className="flex-1" style={{ padding: "0 var(--spacing-lg)", marginTop: -32 }}>
        <div className="bg-surface" style={{ borderRadius: "var(--radius-lg)", padding: "var(--spacing-lg)", boxShadow: "var(--shadow-lg)" }}>
          <h2 className="text-[18px] font-bold text-text" style={{ marginBottom: "var(--spacing-xs)" }}>حساب جديد</h2>
          <p className="text-[13px] text-text-muted" style={{ marginBottom: "var(--spacing-lg)" }}>أدخل بياناتك لإنشاء حساب</p>

          {error && (
            <div className="bg-danger-light border border-danger/20 text-danger text-[13px]" style={{ padding: "var(--spacing-sm) var(--spacing-md)", borderRadius: "var(--radius-md)", marginBottom: "var(--spacing-md)" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="flex flex-col" style={{ gap: "var(--spacing-md)" }}>
            <div>
              <label className="block text-[13px] text-text-secondary font-medium" style={{ marginBottom: "var(--spacing-sm)" }}>الاسم الكامل</label>
              <div className="relative">
                <User size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="أحمد محمد"
                  className="input-field" style={{ paddingInlineStart: "var(--spacing-md)", paddingInlineEnd: 44 }}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] text-text-secondary font-medium" style={{ marginBottom: "var(--spacing-sm)" }}>رقم الهاتف</label>
              <div className="relative">
                <Phone size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="07XXXXXXXXX"
                  className="input-field" style={{ paddingInlineStart: "var(--spacing-md)", paddingInlineEnd: 44 }}
                  dir="ltr"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[13px] text-text-secondary font-medium" style={{ marginBottom: "var(--spacing-sm)" }}>كلمة المرور</label>
              <div className="relative">
                <Lock size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input-field" style={{ paddingInlineStart: "var(--spacing-md)", paddingInlineEnd: 44 }}
                  dir="ltr"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !name || !phone || !password}
              className="w-full h-[52px] font-bold text-[15px] text-white disabled:opacity-50 active:scale-[0.98] transition-all"
              style={{ borderRadius: "var(--radius-md)", marginTop: "var(--spacing-sm)", background: "linear-gradient(135deg, #0D9E6C, #087A52)" }}
            >
              {loading ? "جاري الإنشاء..." : "إنشاء الحساب"}
            </button>
          </form>
        </div>

        <div className="text-center" style={{ marginTop: "var(--spacing-lg)", marginBottom: "var(--spacing-xl)" }}>
          <p className="text-[13px] text-text-muted">
            لديك حساب بالفعل؟{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-primary font-bold"
            >
              تسجيل الدخول
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
