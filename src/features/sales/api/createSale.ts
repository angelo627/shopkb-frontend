import { apiClient } from "../../../lib/api/client";

export interface CreateSaleItem {
  productId: string;
  quantity: number;
}

export interface CreateSaleRequest {
  items: CreateSaleItem[];
}

export interface CreateSaleResponse {
  id: string;
}

export async function createSale(
  payload: CreateSaleRequest,
): Promise<CreateSaleResponse> {
  return apiClient<CreateSaleResponse>("/user/make-sales", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
