import { apiClient } from "../../../lib/api/client";
import type { Product } from "./createProduct";

export async function deactivateProduct(
  productId: string,
): Promise<Product> {
  return apiClient<Product>(
    `/admin/${productId}/deactivate`,
    {
      method: "PATCH",
    },
  );
}