import { apiFetch } from "./api";
import type { GroupSaving } from "../types";

// NOTE: Group Saving backend behavior may be partial — confirm with backend
// before shipping as a production flow. UserId is taken from JWT server-side.
export const groupSavingService = {
  get: (goalId: number) => apiFetch<GroupSaving>(`/api/group-saving/${goalId}`),

  create: (savingGoalId: number) =>
    apiFetch<{ id: number; message: string }>("/api/group-saving", {
      method: "POST",
      body: JSON.stringify({ savingGoalId }),
    }),

  addMember: (goalId: number, memberUserId: number) =>
    apiFetch<{ message: string }>(`/api/group-saving/${goalId}/members`, {
      method: "POST",
      body: JSON.stringify({ userId: memberUserId }),
    }),

  removeMember: (goalId: number, memberUserId: number) =>
    apiFetch<{ message: string }>(
      `/api/group-saving/${goalId}/members/${memberUserId}`,
      { method: "DELETE" }
    ),

  delete: (goalId: number) =>
    apiFetch<{ message: string }>(`/api/group-saving/${goalId}`, { method: "DELETE" }),
};
