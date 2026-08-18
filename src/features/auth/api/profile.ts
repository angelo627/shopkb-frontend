import { apiClient } from "../../../lib/api/client";
import type { AuthenticatedUser } from "../types";

export async function getProfile(
  accessToken: string,
): Promise<AuthenticatedUser> {
  return apiClient<AuthenticatedUser>("/auth/profile", {
    method: "GET",
    accessToken,
  });
}
