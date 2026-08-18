import { apiClient } from "../../../lib/api/client";
import type { AuthenticatedUser } from "../types";

export async function getProfile(): Promise<AuthenticatedUser> {
  return apiClient<AuthenticatedUser>("/profile", {
    method: "GET",
  });
}
