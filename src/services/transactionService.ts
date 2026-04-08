import { apiFetch, getUserId } from "./api";

export const transactionService = {
  deposit: (savingGoalId: number, amount: number, contributionType: string = "Deposit") =>
    apiFetch<{ message: string }>("/api/saving-transactions", {
      method: "POST",
      body: JSON.stringify({ savingGoalId, userId: getUserId(), amount, contributionType }),
    }),

  withdraw: (savingGoalId: number, amount: number) =>
    apiFetch<{ message: string }>("/api/saving-transactions/withdraw", {
      method: "POST",
      body: JSON.stringify({ savingGoalId, userId: getUserId(), amount }),
    }),
};
