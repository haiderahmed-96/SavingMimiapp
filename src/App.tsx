import { Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useNotificationStore } from "./stores/useNotificationStore";
import { useAuthStore } from "./stores/useAuthStore";

function RequireAuth({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <>{children}</>;
}

export default function App() {
  const fetchUnreadCount = useNotificationStore((s) => s.fetchUnreadCount);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const loadSession = useAuthStore((s) => s.loadSession);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount, isAuthenticated]);

  return (
    <div className="min-h-dvh bg-surface-secondary text-text">
      <div style={{ paddingBottom: isAuthenticated ? "calc(68px + env(safe-area-inset-bottom, 0px) + 16px)" : 0 }}>
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <Register />} />
          <Route path="/" element={<RequireAuth><Dashboard /></RequireAuth>} />
          <Route path="/goals" element={<RequireAuth><GoalsList /></RequireAuth>} />
          <Route path="/goals/new" element={<RequireAuth><CreateGoal /></RequireAuth>} />
          <Route path="/goals/:id" element={<RequireAuth><GoalDetails /></RequireAuth>} />
          <Route path="/notifications" element={<RequireAuth><Notifications /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
        </Routes>
      </div>
      {isAuthenticated && <BottomNav />}
      <Toast />
      <Celebration />
    </div>
  );
}
