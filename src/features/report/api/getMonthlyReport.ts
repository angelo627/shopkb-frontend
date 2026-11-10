import { apiClient } from "../../../lib/api/client";

export interface MonthlyReportResponse {
  year: number;
  month: number;
  itemsSold: number;
  stockReceived: number;
  activities: number;
  revenue?: number;
}

export async function getMonthlyReport(
  year?: number,
  month?: number,
): Promise<MonthlyReportResponse> {
  const params = new URLSearchParams();

  if (year !== undefined) params.set("year", String(year));
  if (month !== undefined) params.set("month", String(month));

  const query = params.toString();

  return apiClient<MonthlyReportResponse>(
    `/user/reports/monthly${query ? `?${query}` : ""}`,
  );
}
