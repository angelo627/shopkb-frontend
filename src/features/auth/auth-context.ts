import { createContext } from "react";

import type { AuthenticatedUser, AuthStatus, LoginInput } from "./types";

export interface AuthContextValue {
  accessToken: string | null;
  user: AuthenticatedUser | null;
  status: AuthStatus;

  login: (input: LoginInput) => Promise<void>;

  logout: () => Promise<void>;

  setAuthentication: (accessToken: string, user: AuthenticatedUser) => void;

  clearAuthentication: () => void;
}

export const AuthContext = createContext<AuthContextValue | undefined>(
  undefined,
);
