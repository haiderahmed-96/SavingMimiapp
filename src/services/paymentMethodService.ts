import { apiFetch } from "./api";
import type { PaymentMethod, PagedResult } from "../types";

export const paymentMethodService = {
  getAll: (page = 1, pageSize = 20) =>
    apiFetch<PagedResult<PaymentMethod>>(
      `/api/payment-methods?page=${page}&pageSize=${pageSize}`
    ),
};
