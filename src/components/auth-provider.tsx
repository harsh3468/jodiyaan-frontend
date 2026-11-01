"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { api } from "@/lib/api";
import { getToken, setToken, subscribeToken } from "@/lib/session";
import type { AuthSession, SessionUser } from "@/lib/types";

type AuthStatus = "loading" | "anonymous" | "authenticated";

interface AuthContextValue {
  status: AuthStatus;
  user: SessionUser | null;
  signIn: (session: AuthSession) => void;
  signOut: () => void;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);
const noopSubscribe = () => () => {};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const token = useSyncExternalStore(subscribeToken, getToken, () => null);
  // False during SSR and hydration, when the stored token cannot be read yet.
  const hydrated = useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
  const [user, setUser] = useState<SessionUser | null>(null);

  const refresh = useCallback(async () => {
    try {
      setUser(await api.me());
    } catch {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    api
      .me()
      .then((me) => !cancelled && setUser(me))
      .catch(() => !cancelled && setUser(null));
    return () => {
      cancelled = true;
    };
  }, [token]);

  const value = useMemo<AuthContextValue>(
    () => ({
      status: !hydrated
        ? "loading"
        : !token
          ? "anonymous"
          : user
            ? "authenticated"
            : "loading",
      user: token ? user : null,
      signIn: (session) => {
        setUser(session.user);
        setToken(session.accessToken);
      },
      signOut: () => {
        setToken(null);
        setUser(null);
      },
      refresh,
    }),
    [hydrated, token, user, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
