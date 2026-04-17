import { apiFetch } from "./api";
import type { EventSaving, CreateEventSavingRequest } from "../types";

export const eventSavingService = {
  get: (goalId: number) => apiFetch<EventSaving>(`/api/event-saving/${goalId}`),

  getAll: (goalId: number) =>
    apiFetch<EventSaving[]>(`/api/event-saving/goal/${goalId}/all`),

  create: (data: CreateEventSavingRequest) =>
    apiFetch<{ id: number; message: string }>("/api/event-saving", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (goalId: number, data: CreateEventSavingRequest) =>
    apiFetch<{ message: string }>(`/api/event-saving/${goalId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (goalId: number) =>
    apiFetch<{ message: string }>(`/api/event-saving/${goalId}`, { method: "DELETE" }),
};
