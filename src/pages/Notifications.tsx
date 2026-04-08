import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useNotificationStore } from "../stores/useNotificationStore";
import { NotificationTypeMap } from "../types/enums";
import { timeAgo } from "../utils/format";
import EmptyState from "../components/EmptyState";
import Skeleton from "../components/Skeleton";
import { CheckCheck, Trash2 } from "lucide-react";

export default function Notifications() {
  const navigate = useNavigate();
  const { notifications, loading, fetchNotifications, markAsRead, markAllAsRead, deleteNotification } =
    useNotificationStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleTap = async (n: (typeof notifications)[0]) => {
    if (n.status === "Unread") {
      await markAsRead(n.id);
    }
    if (n.relatedEntityType === "SavingGoal" && n.relatedEntityId) {
      navigate(`/goals/${n.relatedEntityId}`);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    await deleteNotification(id);
  };

  return (
    <div className="min-h-screen bg-surface-secondary">
      <div className="bg-surface" style={{ padding: "var(--spacing-md) var(--spacing-lg)", paddingTop: 56 }}>
        <div className="flex items-center justify-between">
          <h1 className="text-[18px] font-bold text-text">الإشعارات</h1>
          {notifications.some((n) => n.status === "Unread") && (
            <button
              onClick={markAllAsRead}
              className="flex items-center gap-1.5 text-[11px] font-semibold text-primary active:scale-[0.97] transition-transform"
            >
              <CheckCheck size={14} />
              قراءة الكل
            </button>
          )}
        </div>
      </div>

      <div className="h-px bg-border" />

      <div style={{ padding: "var(--spacing-md) var(--spacing-lg) var(--spacing-lg)" }}>
        {loading ? (
          <div className="flex flex-col" style={{ gap: "var(--spacing-sm)" }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="w-full h-[72px]" style={{ borderRadius: "var(--radius-md)" }} />
            ))}
          </div>
        ) : notifications.length === 0 ? (
          <EmptyState icon="🔔" message="لا توجد إشعارات" />
        ) : (
          <div className="flex flex-col" style={{ gap: "var(--spacing-sm)" }}>
            {notifications.map((n) => {
              const isUnread = n.status === "Unread";
              const typeInfo = NotificationTypeMap[n.type] || NotificationTypeMap.SystemNotification;
              return (
                <button
                  key={n.id}
                  onClick={() => handleTap(n)}
                  className="relative w-full text-start card flex items-start transition-all active:scale-[0.98]"
                  style={{ padding: "var(--spacing-sm) var(--spacing-md)", gap: "var(--spacing-sm)", opacity: isUnread ? 1 : 0.65 }}
                >
                  {isUnread && (
                    <div className="absolute top-0 inset-x-0 h-[2px] rounded-t-2xl bg-primary" />
                  )}
                  <span className="text-lg shrink-0 mt-0.5">{typeInfo.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-text truncate">{n.title}</p>
                    <p className="text-[11px] text-text-muted mt-0.5 line-clamp-2">{n.message}</p>
                    <p className="text-[10px] text-text-muted mt-1">{timeAgo(n.createdAt)}</p>
                  </div>
                  <button
                    onClick={(e) => handleDelete(e, n.id)}
                    className="shrink-0 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-secondary transition-colors -m-1"
                  >
                    <Trash2 size={14} className="text-text-muted" />
                  </button>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
