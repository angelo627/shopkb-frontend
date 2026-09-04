import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import type {
  AuthenticatedUser,
  AuthStatus,
  LoginInput,
} from "./types";

import {
  AuthContext,
  type AuthContextValue,
} from "./auth-context";

import { setAccessTokenGetter } from "../../lib/api/client";

import { refresh } from "./api/refresh";
import { getProfile } from "./api/profile";
import { login as loginApi } from "./api/login";
import { logout as logoutApi } from "./api/logout";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const accessTokenRef = useRef<string | null>(null);

  const [accessToken, setAccessToken] =
    useState<string | null>(null);

  const [user, setUser] =
    useState<AuthenticatedUser | null>(null);

  const [status, setStatus] =
    useState<AuthStatus>("initializing");

    function updateAccessToken(token: string | null) {
      accessTokenRef.current = token;
      setAccessToken(token);
    }

  function setAuthentication(
    token: string,
    authenticatedUser: AuthenticatedUser,
  ) {
    updateAccessToken(token);
    setUser(authenticatedUser);
    setStatus("authenticated");
  }

  function clearAuthentication() {
    updateAccessToken(null);
    setUser(null);
    setStatus("unauthenticated");
  }

  
  async function login(input: LoginInput) {
    const result = await loginApi(input);

    setAuthentication(result.accessToken, result.user);
  }

  async function logout() {
    try {
      await logoutApi();
    } finally {
      clearAuthentication();
    }
  }

  useEffect(() => {
    setAccessTokenGetter(() => accessTokenRef.current);

    return () => {
      setAccessTokenGetter(null);
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function restoreSession() {
      try {
        const refreshResult = await refresh();

        if (!isMounted) {
          return;
        }

        const token = refreshResult.accessToken;

        updateAccessToken(token);

        const user = await getProfile(token);

        if (!isMounted) {
          return;
        }

        setUser(user);
        setStatus("authenticated");
      } catch {
        if (!isMounted) {
          return;
        }

        updateAccessToken(null);
        setUser(null);
        setStatus("unauthenticated");
      }
    }

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  const value: AuthContextValue = {
    accessToken,
    user,
    status,
    login,
    logout,
    setAuthentication,
    clearAuthentication,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}