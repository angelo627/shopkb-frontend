import { apiClient } from "../../../lib/api/client";
import type { Product } from "./createProduct";

export interface ReceiveStockInput {
  quantity: number;
  notes?: string;
}

export async function receiveStock(
  productId: string,
  input: ReceiveStockInput,
): Promise<Product> {
  return apiClient<Product>(
    `/admin/products/${productId}/receive-stock`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );
}