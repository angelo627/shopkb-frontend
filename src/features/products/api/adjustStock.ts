import { apiClient } from "../../../lib/api/client";
import type { Product } from "./createProduct";

export interface AdjustStockInput {
  quantity: number;
  notes?: string;
}

export async function adjustStock(
  productId: string,
  input: AdjustStockInput,
): Promise<Product> {
  return apiClient<Product>(
    `/admin/products/${productId}/adjust-stock`,
    {
      method: "PATCH",
      body: JSON.stringify(input),
    },
  );
}