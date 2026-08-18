import { apiClient } from "../../../lib/api/client";

export async function logout(): Promise<void> {
  await apiClient<null>("/auth/logout", {
    method: "POST",
    credentials: "include",
  });
}
