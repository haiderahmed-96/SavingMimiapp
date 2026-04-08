import { create } from "zustand";
import { goalService } from "../services/goalService";
import type { SavingGoal, GoalDetails } from "../types";

interface GoalState {
  goals: SavingGoal[];
  currentGoal: GoalDetails | null;
  loading: boolean;
  error: string | null;
  fetchGoals: () => Promise<void>;
  fetchGoalDetails: (id: number) => Promise<void>;
  clearCurrentGoal: () => void;
}

export const useGoalStore = create<GoalState>((set) => ({
  goals: [],
  currentGoal: null,
  loading: false,
  error: null,

  fetchGoals: async () => {
    set({ loading: true, error: null });
    try {
      const raw = await goalService.getAll();
      const goals = Array.isArray(raw) ? raw : (raw as unknown as { $values?: SavingGoal[] }).$values ?? [];
      set({ goals, loading: false });
    } catch (err: unknown) {
      const message = (err as { error?: string })?.error || "فشل تحميل الأهداف";
      set({ error: message, loading: false });
    }
  },

  fetchGoalDetails: async (id: number) => {
    set({ loading: true, error: null });
    try {
      const goal = await goalService.getById(id);
      set({ currentGoal: goal, loading: false });
    } catch (err: unknown) {
      const message = (err as { error?: string })?.error || "فشل تحميل التفاصيل";
      set({ error: message, loading: false });
    }
  },

  clearCurrentGoal: () => set({ currentGoal: null }),
}));
