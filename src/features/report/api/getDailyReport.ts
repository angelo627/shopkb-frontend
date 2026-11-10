import { apiClient } from "../../../lib/api/client";

export interface DailyReportResponse {
  date: string;
  itemsSold: number;
  stockReceived: number;
  activities: number;
  revenue?: number;
}

export async function getDailyReport(): Promise<DailyReportResponse> {
  return apiClient<DailyReportResponse>("/user/reports/daily"); //although this is both user and admin api
}



// here since the role endpoint from the backend /user ,
// i am going to make a transform that will take /user and turn it into /admin like this const /admin = /user: /admin