import { apiClient } from "../../../lib/api/client";
import type {
  ActivityAction,
  ActivityEntity,
  ActivityLogsResponse,
} from "../types/activity.types";

export interface GetActivityLogsParams {
  page?: number;
  limit?: number;
  userId?: string;
  businessDayId?: string;
  action?: ActivityAction;
  entityType?: ActivityEntity;
  entityId?: string;
  from?: string;
  to?: string;
  search?: string;
  order?: "asc" | "desc";
}

export async function getActivityLogs(
  filters: GetActivityLogsParams = {},
): Promise<ActivityLogsResponse> {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });

  const query = params.toString();

  return apiClient<ActivityLogsResponse>(
    `/admin/anyActivity-logs${query ? `?${query}` : ""}`,
  );
}
