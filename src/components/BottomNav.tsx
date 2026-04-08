import { useLocation, useNavigate } from "react-router-dom";
import { Home, Target, Bell, User } from "lucide-react";
import { useNotificationStore } from "../stores/useNotificationStore";

const tabs = [
  { path: "/", icon: Home, label: "الرئيسية" },
  { path: "/goals", icon: Target, label: "الأهداف" },
  { path: "/notifications", icon: Bell, label: "الإشعارات" },
  { path: "/profile", icon: User, label: "حسابي" },
] as const;

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border safe-bottom">
      <div className="flex items-center justify-around px-1" style={{ height: 68 }}>
        {tabs.map((tab) => {
          const isActive = tab.path === "/" ? pathname === "/" : pathname.startsWith(tab.path);
          const Icon = tab.icon;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className="relative flex flex-col items-center justify-center w-16 h-full transition-all duration-200 active:scale-95"
              style={{ gap: "var(--spacing-xs)" }}
            >
              {isActive && (
                <div className="absolute top-0 w-8 h-[3px] rounded-b-full bg-primary" />
              )}
              <Icon
                size={21}
                className={isActive ? "text-primary" : "text-text-muted"}
                strokeWidth={isActive ? 2.3 : 1.7}
              />
              <span className={`text-[10px] font-semibold ${isActive ? "text-primary" : "text-text-muted"}`}>
                {tab.label}
              </span>
              {tab.path === "/notifications" && unreadCount > 0 && (
                <span className="absolute top-1.5 right-2 bg-danger text-white text-[7px] font-bold min-w-[16px] h-4 rounded-full flex items-center justify-center px-1">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
