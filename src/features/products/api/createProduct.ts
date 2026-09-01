import { apiClient } from "../../../lib/api/client";

export interface CreateProductInput {
  name: string;
  sku: string;
  costPrice: number;
  sellingPrice: number;
  description?: string;
  image?: File;
  stockQuantity?: number;
  minimumStock?: number;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string | null;
  imageUrl: string | null;
  costPrice: number;
  sellingPrice: number;
  stockQuantity: number;
  minimumStock: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export async function createProduct(
  input: CreateProductInput,
): Promise<Product> {
  const formData = new FormData();

  formData.append("name", input.name);
  formData.append("sku", input.sku);
  formData.append("costPrice", String(input.costPrice));
  formData.append("sellingPrice", String(input.sellingPrice));

  if (input.description) {
    formData.append("description", input.description);
  }

  if (input.image) {
    formData.append("image", input.image);
  }

  if (input.stockQuantity !== undefined) {
    formData.append("stockQuantity", String(input.stockQuantity));
  }

  if (input.minimumStock !== undefined) {
    formData.append("minimumStock", String(input.minimumStock));
  }

  return apiClient<Product>("/admin/createproducts", {
    method: "POST",
    body: formData,
  });
}
