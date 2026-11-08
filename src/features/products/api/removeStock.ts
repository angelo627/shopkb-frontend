import { apiClient } from "../../../lib/api/client";
import type { Product } from "./createProduct";

export interface RemoveStockInput {
  quantity: number;
  notes?: string;
}

export async function removeStock(
  productId: string,
  input: RemoveStockInput,
): Promise<Product> {
  return apiClient<Product>(`/admin/products/${productId}/remove-stock`, {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}
