import { apiFetch } from "./api";
import type { Notification, PagedResult } from "../types";

export const notificationService = {
  getAll: (page = 1, pageSize = 20) =>
    apiFetch<PagedResult<Notification>>(
      `/api/notifications?page=${page}&pageSize=${pageSize}`
    ),

  getUnreadCount: () =>
    apiFetch<{ unreadCount: number }>("/api/notifications/unread-count"),

  getById: (id: number) => apiFetch<Notification>(`/api/notifications/${id}`),

  markAsRead: (id: number) =>
    apiFetch<{ message: string }>(`/api/notifications/${id}/mark-as-read`, {
      method: "PUT",
    }),

  markAllAsRead: () =>
    apiFetch<{ message: string }>("/api/notifications/mark-all-as-read", {
      method: "PUT",
    }),

  delete: (id: number) =>
    apiFetch<{ message: string }>(`/api/notifications/${id}`, { method: "DELETE" }),

  getByType: (type: string, page = 1, pageSize = 20) =>
    apiFetch<PagedResult<Notification>>(
      `/api/notifications/type/${type}?page=${page}&pageSize=${pageSize}`
    ),
};
