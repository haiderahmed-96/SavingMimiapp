import { create } from "zustand";
import { goalService } from "../services/goalService";
import type { SavingGoal, GoalDetails, UserSummary } from "../types";

interface GoalState {
  goals: SavingGoal[];
  archivedGoals: SavingGoal[];
  summary: UserSummary | null;
  currentGoal: GoalDetails | null;
  loading: boolean;
  error: string | null;
  fetchGoals: () => Promise<void>;
  fetchArchivedGoals: () => Promise<void>;
  fetchSummary: () => Promise<void>;
  fetchGoalDetails: (id: number) => Promise<void>;
  clearCurrentGoal: () => void;
}

// Tolerate both paged and legacy array responses during rollout.
function toItems<T>(raw: unknown): T[] {
  if (Array.isArray(raw)) return raw as T[];
  if (raw && typeof raw === "object") {
    const r = raw as { items?: T[]; $values?: T[] };
    return r.items ?? r.$values ?? [];
  }
  return [];
}

export const useGoalStore = create<GoalState>((set) => ({
  goals: [],
  archivedGoals: [],
  summary: null,
  currentGoal: null,
  loading: false,
  error: null,

  fetchGoals: async () => {
    set({ loading: true, error: null });
    try {
      // Pull a generous first page; the backend does not enforce a hard cap.
      const raw = await goalService.getAll(1, 100);
      set({ goals: toItems<SavingGoal>(raw), loading: false });
    } catch (err: unknown) {
      const message = (err as { error?: string })?.error || "فشل تحميل الأهداف";
      set({ error: message, loading: false });
    }
  },

  fetchArchivedGoals: async () => {
    try {
      const raw = await goalService.getArchived(1, 100);
      set({ archivedGoals: toItems<SavingGoal>(raw) });
    } catch {
      // silent
    }
  },

  fetchSummary: async () => {
    try {
      const summary = await goalService.getSummary();
      set({ summary });
    } catch {
      // silent
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
