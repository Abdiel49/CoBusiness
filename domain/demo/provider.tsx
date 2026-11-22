"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { createLocalDemoRepository } from "./local-repository";
import { createDemoServices, type DemoOfferService, type DemoOrderService } from "./services";
import type { DemoState } from "./types";

type DemoContextValue = {
  state: DemoState | null;
  error: string | null;
  loading: boolean;
  save: (state: DemoState) => void;
  reset: () => boolean;
  reload: () => void;
  services: { offers: DemoOfferService; orders: DemoOrderService } | null;
};

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DemoState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(() => {
    try {
      setState(createLocalDemoRepository(window.localStorage).read());
      setError(null);
    } catch {
      setError("No se pudieron cargar los datos de la demo.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    queueMicrotask(() => { if (active) reload(); });
    const sync = (event: StorageEvent) => {
      if (event.key === "cobusiness.demo.v1" || event.key === null) reload();
    };
    window.addEventListener("storage", sync);
    return () => { active = false; window.removeEventListener("storage", sync); };
  }, [reload]);

  function save(next: DemoState) {
    try {
      createLocalDemoRepository(window.localStorage).write(next);
      setState(next);
      setError(null);
    } catch {
      setError("No se pudieron guardar los datos de la demo.");
    }
  }

  function reset() {
    try {
      setState(createLocalDemoRepository(window.localStorage).reset());
      setError(null);
      return true;
    } catch {
      setError("No se pudieron reiniciar los datos de la demo.");
      return false;
    }
  }

  const services = loading || error ? null : createDemoServices(createLocalDemoRepository(window.localStorage), reload);
  return <DemoContext.Provider value={{ state, error, loading, save, reset, reload, services }}>{children}</DemoContext.Provider>;
}

export function useDemo() {
  const value = useContext(DemoContext);
  if (!value) throw new Error("useDemo must be used within DemoProvider");
  return value;
}
