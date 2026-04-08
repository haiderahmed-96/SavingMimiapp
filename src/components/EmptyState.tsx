interface EmptyStateProps {
  icon: string;
  message: string;
  action?: { label: string; onClick: () => void };
}

export default function EmptyState({ icon, message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center" style={{ padding: "var(--spacing-xl) var(--spacing-lg)" }}>
      <span className="text-5xl animate-float" style={{ marginBottom: "var(--spacing-md)" }}>{icon}</span>
      <p className="text-text-secondary text-center text-[14px] leading-relaxed max-w-[260px]" style={{ marginBottom: "var(--spacing-lg)" }}>{message}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="font-semibold text-[14px] text-white bg-primary active:scale-[0.97] transition-transform"
          style={{ padding: "var(--spacing-sm) var(--spacing-lg)", borderRadius: "var(--radius-md)" }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
