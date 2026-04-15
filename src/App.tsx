import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import BottomNav from "./components/BottomNav";
import Toast from "./components/Toast";
import Celebration from "./components/Celebration";
import Dashboard from "./pages/Dashboard";
import GoalsList from "./pages/GoalsList";
import GoalDetails from "./pages/GoalDetails";
import CreateGoal from "./pages/CreateGoal";
import Notifications from "./pages/Notifications";
import Profile from "./pages/Profile";
import { useNotificationStore } from "./stores/useNotificationStore";

export default function App() {
  const fetchUnreadCount = useNotificationStore((s) => s.fetchUnreadCount);

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  return (
    <div className="min-h-dvh bg-surface-secondary text-text">
      <div style={{ paddingBottom: "calc(68px + env(safe-area-inset-bottom, 0px) + 16px)" }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/goals" element={<GoalsList />} />
          <Route path="/goals/new" element={<CreateGoal />} />
          <Route path="/goals/:id" element={<GoalDetails />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
      <BottomNav />
      <Toast />
      <Celebration />
    </div>
  );
}
