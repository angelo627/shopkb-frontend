import { apiClient } from "../../../lib/api/client";
import type { AuthenticatedUser } from "../types";

export interface RegisterInput {
  fullName: string;
  email: string;
  password: string;
}

export async function register(
  input: RegisterInput,
): Promise<AuthenticatedUser> {
  return apiClient<AuthenticatedUser>("/register", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
