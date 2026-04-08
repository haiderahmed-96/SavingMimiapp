import { useEffect, type ReactNode } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export default function Modal({ open, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] animate-fade-in" />
      <div
        className="relative w-full max-w-[500px] mx-auto bg-surface animate-slide-up"
        onClick={(e) => e.stopPropagation()}
        style={{ borderRadius: "var(--radius-xl) var(--radius-xl) 0 0", padding: "var(--spacing-sm) var(--spacing-lg) var(--spacing-xl)", boxShadow: "0 -4px 32px rgba(0,0,0,0.12)" }}
      >
        <div className="w-10 h-1 rounded-full bg-border mx-auto" style={{ marginBottom: "var(--spacing-lg)" }} />
        <h2 className="text-[17px] font-bold text-text" style={{ marginBottom: "var(--spacing-lg)" }}>{title}</h2>
        {children}
      </div>
    </div>
  );
}
