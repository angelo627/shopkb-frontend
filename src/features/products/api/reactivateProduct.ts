import { apiClient } from "../../../lib/api/client";
import type { Product } from "./createProduct";

export async function reactivateProduct(
  productId: string,
): Promise<Product> {
  return apiClient<Product>(
    `/admin/${productId}/reactivate`,
    {
      method: "PATCH",
    },
  );
}