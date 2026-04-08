import { apiFetch, getUserId } from "./api";
import type { GroupSaving } from "../types";

export const groupSavingService = {
  get: (goalId: number) =>
    apiFetch<GroupSaving>(`/api/group-saving/${goalId}`),

  create: (savingGoalId: number) =>
    apiFetch<{ id: number; message: string }>("/api/group-saving", {
      method: "POST",
      body: JSON.stringify({ savingGoalId, userId: getUserId() }),
    }),

  addMember: (goalId: number, userId: number) =>
    apiFetch<{ message: string }>(`/api/group-saving/${goalId}/members`, {
      method: "POST",
      body: JSON.stringify({ UserId: userId }),
    }),

  removeMember: (goalId: number, userId: number) =>
    apiFetch<{ message: string }>(`/api/group-saving/${goalId}/members/${userId}`, {
      method: "DELETE",
    }),

  delete: (goalId: number) =>
    apiFetch<{ message: string }>(`/api/group-saving/${goalId}`, { method: "DELETE" }),
};
