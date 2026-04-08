import { apiFetch, getUserId } from "./api";
import type {
  SavingGoal,
  GoalDetails,
  CreateGoalRequest,
  UpdateGoalRequest,
} from "../types";

export const goalService = {
  getAll: () =>
    apiFetch<SavingGoal[]>(`/api/saving-goals?userId=${getUserId()}`),

  getById: (id: number) =>
    apiFetch<GoalDetails>(`/api/saving-goals/${id}?userId=${getUserId()}`),

  create: (data: Omit<CreateGoalRequest, "userId">) =>
    apiFetch<{ id: number; message: string }>("/api/saving-goals", {
      method: "POST",
      body: JSON.stringify({ ...data, userId: getUserId() }),
    }),

  update: (id: number, data: Omit<UpdateGoalRequest, "userId">) =>
    apiFetch<{ message: string }>(`/api/saving-goals/${id}`, {
      method: "PUT",
      body: JSON.stringify({ ...data, userId: getUserId() }),
    }),

  getSummary: () =>
    apiFetch<{ totalSaved: number; activeGoals: number; completedGoals: number; totalGoals: number }>(
      `/api/saving-goals/summary?userId=${getUserId()}`
    ),
};
