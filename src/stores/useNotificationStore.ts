import { create } from "zustand";
import { notificationService } from "../services/notificationService";
import type { Notification } from "../types";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  fetchNotifications: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: number) => Promise<void>;
}

function toItems<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) return raw as T[];
  if (raw && typeof raw === "object") {
    const r = raw as { items?: T[]; $values?: T[] };
    return r.items ?? r.$values ?? [];
  }
  return [];
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,

  fetchNotifications: async () => {
    set({ loading: true });
    try {
      const raw = await notificationService.getAll(1, 100);
      set({ notifications: toItems<Notification>(raw), loading: false });
    } catch {
      set({ loading: false });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const { unreadCount } = await notificationService.getUnreadCount();
      set({ unreadCount });
    } catch {
      // silent
    }
  },

  markAsRead: async (id: number) => {
    await notificationService.markAsRead(id);
    set({
      notifications: get().notifications.map((n) =>
        n.id === id ? { ...n, status: "Read", readAt: new Date().toISOString() } : n
      ),
      unreadCount: Math.max(0, get().unreadCount - 1),
    });
  },

  markAllAsRead: async () => {
    await notificationService.markAllAsRead();
    set({
      notifications: get().notifications.map((n) => ({
        ...n,
        status: "Read",
        readAt: n.readAt || new Date().toISOString(),
      })),
      unreadCount: 0,
    });
  },

  deleteNotification: async (id: number) => {
    await notificationService.delete(id);
    const wasUnread = get().notifications.find((n) => n.id === id)?.status === "Unread";
    set({
      notifications: get().notifications.filter((n) => n.id !== id),
      unreadCount: wasUnread ? Math.max(0, get().unreadCount - 1) : get().unreadCount,
    });
  },
}));
