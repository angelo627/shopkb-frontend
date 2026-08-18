import { createContext } from "react";

import type { AuthenticatedUser, AuthStatus } from "./types";

export interface AuthContextValue {
  accessToken: string | null;
  user: AuthenticatedUser | null;
  status: AuthStatus;
  setAuthentication: (accessToken: string, user: AuthenticatedUser) => void;
  clearAuthentication: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
