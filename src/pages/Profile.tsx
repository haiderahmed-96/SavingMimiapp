import { getUserId } from "../services/api";
import { User, Hash, ShieldCheck, Info } from "lucide-react";

export default function Profile() {
  const userId = getUserId();

  return (
    <div className="bg-surface-secondary">
      {/* Green Header */}
      <div
        className="relative overflow-hidden text-center"
        style={{
          background: "linear-gradient(135deg, #0D9E6C 0%, #087A52 100%)",
          paddingTop: 60,
          paddingBottom: 64,
          paddingInline: "var(--spacing-lg)",
        }}
      >
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-44 h-44 rounded-full bg-white/5 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-36 h-36 rounded-full bg-white/5 translate-x-1/3 translate-y-1/3" />

        {/* Avatar */}
        <div
          className="relative w-20 h-20 bg-white/15 flex items-center justify-center mx-auto"
          style={{ borderRadius: "var(--radius-xl)", marginBottom: "var(--spacing-md)" }}
        >
          <User size={36} className="text-white" />
          <div
            className="absolute -bottom-1 -left-1 w-6 h-6 bg-[#34D399] flex items-center justify-center"
            style={{ borderRadius: "var(--radius-sm)", border: "2px solid #087A52" }}
          >
            <ShieldCheck size={12} className="text-white" />
          </div>
        </div>

        <h2 className="text-[20px] font-bold text-white" style={{ marginBottom: "var(--spacing-xs)" }}>
          مستخدم
        </h2>
        <p className="text-white/50 text-[13px] tabular-nums">ID: {userId}</p>
      </div>

      {/* Info Cards — overlapping header */}
      <div
        className="relative z-10"
        style={{
          padding: "0 var(--spacing-lg)",
          marginTop: -28,
        }}
      >
        <div className="flex flex-col" style={{ gap: "var(--spacing-sm)" }}>
          {/* User ID Card */}
          <div
            className="bg-surface flex items-center"
            style={{
              padding: "var(--spacing-md)",
              gap: "var(--spacing-md)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <div
              className="w-11 h-11 bg-primary-light flex items-center justify-center shrink-0"
              style={{ borderRadius: "var(--radius-md)" }}
            >
              <Hash size={20} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-[12px] text-text-muted" style={{ marginBottom: "var(--spacing-xs)" }}>
                رقم المستخدم
              </p>
              <p className="text-[16px] font-bold text-text tabular-nums">{userId}</p>
            </div>
          </div>

          {/* Account Type Card */}
          <div
            className="bg-surface flex items-center"
            style={{
              padding: "var(--spacing-md)",
              gap: "var(--spacing-md)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <div
              className="w-11 h-11 bg-primary-light flex items-center justify-center shrink-0"
              style={{ borderRadius: "var(--radius-md)" }}
            >
              <ShieldCheck size={20} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-[12px] text-text-muted" style={{ marginBottom: "var(--spacing-xs)" }}>
                نوع الحساب
              </p>
              <p className="text-[16px] font-bold text-primary">نشط</p>
            </div>
          </div>

          {/* Version Card */}
          <div
            className="bg-surface flex items-center"
            style={{
              padding: "var(--spacing-md)",
              gap: "var(--spacing-md)",
              borderRadius: "var(--radius-lg)",
              boxShadow: "var(--shadow-md)",
            }}
          >
            <div
              className="w-11 h-11 bg-info-light flex items-center justify-center shrink-0"
              style={{ borderRadius: "var(--radius-md)" }}
            >
              <Info size={20} className="text-info" />
            </div>
            <div className="flex-1">
              <p className="text-[12px] text-text-muted" style={{ marginBottom: "var(--spacing-xs)" }}>
                الإصدار
              </p>
              <p className="text-[16px] font-bold text-text">v2.0.0</p>
            </div>
          </div>
        </div>

        <p
          className="text-center text-[11px] text-text-muted"
          style={{ marginTop: "var(--spacing-xl)" }}
        >
          القاصة — تطبيق إدارة الادخار
        </p>
      </div>
    </div>
  );
}
