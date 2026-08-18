import { apiClient } from "../../../lib/api/client";
import type { RefreshResponse } from "../types";

export async function refresh(): Promise<RefreshResponse> {
  return apiClient<RefreshResponse>("/auth/refresh", {
    method: "POST",
    credentials: "include",
  });
}
