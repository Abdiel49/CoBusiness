"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DemoProvider, useDemo } from "@/domain/demo/provider";
import { rolePath, useAuth } from "@/features/auth/session";
import type { DemoRole } from "@/domain/demo/types";
import "./demo-shell.css";

function DemoControls() {
  const { error, loading, reset, reload } = useDemo();
  const [notice, setNotice] = useState("");
  return <div className="demo-controls">
    {loading && <p role="status">Cargando datos de la demo…</p>}
    {error && <div role="alert"><p>{error}</p><button onClick={reload}>Reintentar</button></div>}
    <button type="button" onClick={() => { if (window.confirm("¿Reiniciar todos los datos de la demo?")) setNotice(reset() ? "Los datos de la demo se reiniciaron." : ""); }}>Reiniciar demo</button>
    <p role="status">{notice}</p>
  </div>;
}

export function DemoShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, loading, error, retry, changeRole, logout } = useAuth();
  const currentRole = pathname.split("/")[1];
  useEffect(() => {
    if (loading || error) return;
    if (!session) router.replace("/login");
    else if (currentRole !== session.role) router.replace(rolePath(session.role));
  }, [loading, error, session, currentRole, router]);
  if (error) return <main className="demo-shell-content demo-session-error" role="alert"><p>{error}</p><div className="demo-session-actions"><button onClick={retry}>Reintentar</button><button onClick={() => { if (logout()) router.replace("/login"); }}>Descartar sesión demo</button></div></main>;
  if (loading || !session || currentRole !== session.role) return <main className="demo-shell-content" role="status">Cargando sesión demo…</main>;
  return <DemoProvider><div className="demo-shell">
    <header className="demo-shell-header"><Link href="/" className="demo-shell-brand">CoBusiness<span>.</span></Link><span>Datos de demostración</span><button type="button" onClick={() => { if (logout()) router.replace("/login"); }}>Cerrar sesión</button></header>
    <nav className="demo-shell-nav" aria-label="Vista de la demo"><label htmlFor="demo-role">Cambiar rol de la demo</label><select id="demo-role" value={session.role} onChange={(event) => { const role = event.target.value as DemoRole; if (changeRole(role)) router.push(rolePath(role)); }}><option value="buyer">Comprador</option><option value="operator">Operador</option><option value="admin">CoBusiness</option></select></nav>
    <main className="demo-shell-content">{children}<DemoControls /></main>
  </div></DemoProvider>;
}
