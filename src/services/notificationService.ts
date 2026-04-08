import { apiFetch, getUserId } from "./api";
import type { Notification } from "../types";

export const notificationService = {
  getAll: () =>
    apiFetch<Notification[]>(`/api/notifications/user/${getUserId()}`),

  getUnreadCount: () =>
    apiFetch<{ unreadCount: number }>(`/api/notifications/user/${getUserId()}/unread-count`),

  markAsRead: (id: number) =>
    apiFetch<{ message: string }>(`/api/notifications/${id}/mark-as-read`, { method: "PUT" }),

  markAllAsRead: () =>
    apiFetch<{ message: string }>(`/api/notifications/user/${getUserId()}/mark-all-as-read`, { method: "PUT" }),

  delete: (id: number) =>
    apiFetch<{ message: string }>(`/api/notifications/${id}`, { method: "DELETE" }),

  getByType: (type: string) =>
    apiFetch<Notification[]>(`/api/notifications/user/${getUserId()}/type/${type}`),
};
