import { apiFetch, getUserId } from "./api";
import type { TravelSaving, CreateTravelSavingRequest } from "../types";

export const travelSavingService = {
  get: (goalId: number) =>
    apiFetch<TravelSaving>(`/api/travel-saving/${goalId}`),

  create: (data: Omit<CreateTravelSavingRequest, "userId">) =>
    apiFetch<{ id: number; message: string }>("/api/travel-saving", {
      method: "POST",
      body: JSON.stringify({ ...data, userId: getUserId() }),
    }),

  update: (goalId: number, data: Omit<CreateTravelSavingRequest, "userId">) =>
    apiFetch<{ message: string }>(`/api/travel-saving/${goalId}`, {
      method: "PUT",
      body: JSON.stringify({ ...data, userId: getUserId() }),
    }),

  delete: (goalId: number) =>
    apiFetch<{ message: string }>(`/api/travel-saving/${goalId}`, { method: "DELETE" }),
};
