import { create } from "zustand";

interface UIState {
  toast: { message: string; type: "success" | "error" } | null;
  showCelebration: boolean;
  showToast: (message: string, type?: "success" | "error") => void;
  hideToast: () => void;
  triggerCelebration: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  toast: null,
  showCelebration: false,

  showToast: (message, type = "success") => {
    set({ toast: { message, type } });
    setTimeout(() => set({ toast: null }), 3000);
  },

  hideToast: () => set({ toast: null }),

  triggerCelebration: () => {
    set({ showCelebration: true });
    setTimeout(() => set({ showCelebration: false }), 3000);
  },
}));
