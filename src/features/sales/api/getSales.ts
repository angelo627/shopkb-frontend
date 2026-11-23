
import { apiClient } from "../../../lib/api/client";

export interface GetSalesQuery {
  page?: number;
  limit?: number;
  search?: string;
  productId?: string;
  soldById?: string;
  businessDayId?: string;
  from?: string;
  to?: string;
  status?: SaleStatus;
}

export interface SaleListResponse {
  id: string;
  status: SaleStatus;

  soldBy: {
    id: string;
    fullName: string;
    email: string;
  };

  businessDay: {
    id: string;
    businessDate: string;
    status: BusinessDayStatus;
  };

  totalAmount: string;

  items: {
    id: string;
    product: {
      id: string;
      name: string;
      sku: string;
    };
    quantity: number;
    unitPrice: string;
    totalAmount: string;
  }[];

  createdAt: string;
  updatedAt: string;
}

export interface PaginatedSalesResponse {
  items: SaleListResponse[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export type SaleStatus = "COMPLETED" | "CANCELLED";

export type BusinessDayStatus = "OPEN" | "CLOSED";

export async function getSales(
  query: GetSalesQuery = {},
): Promise<PaginatedSalesResponse> {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  });

  return apiClient<PaginatedSalesResponse>(
    `/admin/get-sales?${params.toString()}`,
    {
      method: "GET",
    },
  );
}
