import { apiClient } from "../../../lib/api/client";

export interface CreateSaleItem {
  productId: string;
  quantity: number;
}

export interface CreateSaleRequest {
  items: CreateSaleItem[];
}

export async function createSale(payload: CreateSaleRequest): Promise<void> {
  return apiClient<void>("/user/make-sales", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
