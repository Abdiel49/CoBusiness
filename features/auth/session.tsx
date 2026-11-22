"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { DemoRole } from "@/domain/demo/types";

export interface DemoSession {
  email: string;
  role: DemoRole;
}

const SESSION_KEY = "cobusiness.session.v1";
const roles: DemoRole[] = ["buyer", "operator", "admin"];

export function rolePath(role: DemoRole): string {
  return `/${role}/dashboard`;
}

interface AuthContextValue {
  session: DemoSession | null;
  loading: boolean;
  error: string | null;
  login: (email: string, role: DemoRole) => boolean;
  changeRole: (role: DemoRole) => boolean;
  logout: () => boolean;
  retry: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<DemoSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const retry = useCallback(() => {
    try {
      const stored = window.localStorage.getItem(SESSION_KEY);
      if (!stored) {
        setSession(null);
      } else {
        const value: unknown = JSON.parse(stored);
        if (!value || typeof value !== "object" || !("email" in value) || typeof value.email !== "string" || !value.email || !("role" in value) || !roles.includes(value.role as DemoRole)) throw new Error("Invalid session");
        setSession({ email: value.email, role: value.role as DemoRole });
      }
      setError(null);
    } catch {
      setSession(null);
      setError("No se pudo acceder a la sesión de demostración.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => { if (active) retry(); });
    const sync = (event: StorageEvent) => {
      if (event.key === SESSION_KEY || event.key === null) retry();
    };
    window.addEventListener("storage", sync);
    return () => { active = false; window.removeEventListener("storage", sync); };
  }, [retry]);

  function login(email: string, role: DemoRole): boolean {
    try {
      const next = { email, role };
      window.localStorage.setItem(SESSION_KEY, JSON.stringify(next));
      setSession(next);
      setError(null);
      return true;
    } catch {
      setError("No se pudo guardar la sesión de demostración.");
      return false;
    }
  }

  function changeRole(role: DemoRole): boolean {
    return session ? login(session.email, role) : false;
  }

  function logout(): boolean {
    try {
      window.localStorage.removeItem(SESSION_KEY);
      setSession(null);
      setError(null);
      return true;
    } catch {
      setError("No se pudo cerrar la sesión de demostración.");
      return false;
    }
  }

  return <AuthContext.Provider value={{ session, loading, error, login, changeRole, logout, retry }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
