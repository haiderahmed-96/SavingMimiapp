import { useUIStore } from "../stores/useUIStore";
import { CircleCheck, CircleX } from "lucide-react";

export default function Toast() {
  const toast = useUIStore((s) => s.toast);
  if (!toast) return null;

  const isError = toast.type === "error";

  return (
    <div className="fixed top-4 left-4 right-4 z-[60] animate-scale-in flex justify-center">
      <div
        className="flex items-center max-w-[400px] w-full"
        style={{
          gap: "var(--spacing-sm)",
          padding: "var(--spacing-md) var(--spacing-md)",
          borderRadius: "var(--radius-lg)",
          background: isError ? "#FEF2F2" : "#ECFDF5",
          border: `1px solid ${isError ? "#FECACA" : "#A7F3D0"}`,
          boxShadow: "var(--shadow-lg)",
        }}
      >
        {isError ? (
          <CircleX size={20} className="text-danger shrink-0" />
        ) : (
          <CircleCheck size={20} className="text-primary shrink-0" />
        )}
        <span className="text-[14px] font-medium text-text">{toast.message}</span>
      </div>
    </div>
  );
}
