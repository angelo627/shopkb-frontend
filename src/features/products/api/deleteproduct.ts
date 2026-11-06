import { apiClient } from "../../../lib/api/client";

export interface DeletedProductResponse {
  id: string;
  name: string;
  sku: string;
  status: string;
  stockQuantity: number;
  deletedAt: string;
  createdAt: string;
}

export async function deleteProduct(
  productId: string,
): Promise<DeletedProductResponse> {
  return apiClient<DeletedProductResponse>(
    `/admin/deleteproduct/${productId}`,
    {
      method: "DELETE",
    },
  );
}
