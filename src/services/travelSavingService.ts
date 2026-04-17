import { apiFetch } from "./api";
import type { TravelSaving, CreateTravelSavingRequest } from "../types";

export const travelSavingService = {
  get: (goalId: number) => apiFetch<TravelSaving>(`/api/travel-saving/${goalId}`),

  create: (data: CreateTravelSavingRequest) =>
    apiFetch<{ id: number; message: string }>("/api/travel-saving", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (goalId: number, data: CreateTravelSavingRequest) =>
    apiFetch<{ message: string }>(`/api/travel-saving/${goalId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (goalId: number) =>
    apiFetch<{ message: string }>(`/api/travel-saving/${goalId}`, { method: "DELETE" }),
};
