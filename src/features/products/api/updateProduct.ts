import { apiClient } from "../../../lib/api/client";
import type { Product } from "./createProduct";

export interface UpdateProductInput {
  name?: string;
  sku?: string;
  description?: string;
  costPrice?: number;
  sellingPrice?: number;
  minimumStock?: number;
  image?: File;
}

export async function updateProduct(
  productId: string,
  input: UpdateProductInput,
): Promise<Product> {
  const formData = new FormData();

  if (input.name !== undefined) {
    formData.append("name", input.name);
  }

  if (input.sku !== undefined) {
    formData.append("sku", input.sku);
  }

  if (input.description !== undefined) {
    formData.append("description", input.description);
  }

  if (input.costPrice !== undefined) {
    formData.append("costPrice", String(input.costPrice));
  }

  if (input.sellingPrice !== undefined) {
    formData.append("sellingPrice", String(input.sellingPrice));
  }

  if (input.minimumStock !== undefined) {
    formData.append("minimumStock", String(input.minimumStock));
  }

  if (input.image) {
    formData.append("image", input.image);
  }

  return apiClient<Product>(`/admin/updateproduct/${productId}`, {
    method: "PATCH",
    body: formData,
  });
}
