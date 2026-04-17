import { apiFetch } from "./api";
import type {
  SavingGoal,
  GoalDetails,
  CreateGoalRequest,
  UpdateGoalRequest,
  PagedResult,
  UserSummary,
} from "../types";

export const goalService = {
  getAll: (page = 1, pageSize = 20) =>
    apiFetch<PagedResult<SavingGoal>>(
      `/api/saving-goals?page=${page}&pageSize=${pageSize}`
    ),

  getArchived: (page = 1, pageSize = 20) =>
    apiFetch<PagedResult<SavingGoal>>(
      `/api/saving-goals/archived?page=${page}&pageSize=${pageSize}`
    ),

  getById: (id: number) => apiFetch<GoalDetails>(`/api/saving-goals/${id}`),

  create: (data: CreateGoalRequest) =>
    apiFetch<{ id: number; message: string }>("/api/saving-goals", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: number, data: UpdateGoalRequest) =>
    apiFetch<{ message: string }>(`/api/saving-goals/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  getSummary: () => apiFetch<UserSummary>("/api/saving-goals/summary"),
};
