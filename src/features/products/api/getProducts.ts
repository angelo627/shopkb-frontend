import { apiClient } from "../../../lib/api/client";

export interface GetProductsParams {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export interface ProductListItem {
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
}

export interface ProductsPagination {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export interface GetProductsResponse {
  items: ProductListItem[];
  pagination: ProductsPagination;
}

export async function getProducts(
  params?: GetProductsParams,
): Promise<GetProductsResponse> {
  const searchParams = new URLSearchParams();

  if (params?.page !== undefined) {
    searchParams.set("page", String(params.page));
  }

  if (params?.limit !== undefined) {
    searchParams.set("limit", String(params.limit));
  }

  if (params?.status) {
    searchParams.set("status", params.status);
  }

  if (params?.search) {
    searchParams.set("search", params.search);
  }

  const queryString = searchParams.toString();

  return apiClient<GetProductsResponse>(
    `/user/getproduct${queryString ? `?${queryString}` : ""}`,
    {
      method: "GET",
    },
  );
}
