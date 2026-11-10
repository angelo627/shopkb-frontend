import { apiClient } from "../../../lib/api/client";

export interface WeeklyReportResponse {
  startDate: string;
  endDate: string;
  itemsSold: number;
  stockReceived: number;
  activities: number;
  revenue?: number;
}

export async function getWeeklyReport(): Promise<WeeklyReportResponse> {
  return apiClient<WeeklyReportResponse>("/user/reports/weekly");
}
