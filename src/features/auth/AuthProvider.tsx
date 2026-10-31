import {
  useCallback,
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

import {
  setAccessTokenGetter,
  setRefreshAccessToken,
} from "../../lib/api/client";

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

  const restoreSessionPromiseRef = useRef<Promise<{
    accessToken: string;
    user: AuthenticatedUser;
  }> | null>(null);

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

    const clearAuthentication = useCallback(() => {
    updateAccessToken(null);
    setUser(null);
    setStatus("unauthenticated");
    }, []);

    const refreshAccessToken = useCallback(async (): Promise<string | null> => {
      try {
        const result = await refresh();

        updateAccessToken(result.accessToken);

        return result.accessToken;
      } catch (error) {
        clearAuthentication();
        throw error;
      }
    }, [clearAuthentication]);

  function setAuthentication(
    token: string,
    authenticatedUser: AuthenticatedUser,
  ) {
    updateAccessToken(token);
    setUser(authenticatedUser);
    setStatus("authenticated");
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

    setRefreshAccessToken(refreshAccessToken);

    return () => {
      setAccessTokenGetter(null);
      setRefreshAccessToken(null);
    };
  }, [refreshAccessToken]);

  useEffect(() => {
  let isMounted = true;

  async function restoreSession() {
    if (!restoreSessionPromiseRef.current) {
      restoreSessionPromiseRef.current = (async () => {
        const refreshResult = await refresh();

        const token = refreshResult.accessToken;

        const user = await getProfile(token);

        return {
          accessToken: token,
          user,
        };
      })();
    }

    try {
      const result = await restoreSessionPromiseRef.current;

      if (!isMounted) {
        return;
      }

      updateAccessToken(result.accessToken);
      setUser(result.user);
      setStatus("authenticated");
    } catch (error) {
      console.error("Session restoration failed:", error);

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