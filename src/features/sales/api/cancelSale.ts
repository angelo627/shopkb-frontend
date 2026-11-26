import { apiClient } from "../../../lib/api/client";

export async function cancelSale(saleId: string): Promise<void> {
  await apiClient(`/admin/sales/${saleId}/cancel`, {
    method: "POST",
  });
}
