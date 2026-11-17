import { apiClient } from "../../../lib/api/client";

export interface SaleReceiptResponse {
  saleId: string;
  status: string;
  receiptDate: string;
  cashier: {
    id: string;
    fullName: string;
  };
  items: {
    productId: string;
    productName: string;
    sku: string;
    quantity: number;
    unitPrice: string;
    totalAmount: string;
  }[];
  totalAmount: string;
}


export async function getSaleReceipt(
  saleId: string,
): Promise<SaleReceiptResponse> {
  return apiClient<SaleReceiptResponse>(
    `/user/getsales/${saleId}/receipt`,
    {
      method: "GET",
    },
  );
}