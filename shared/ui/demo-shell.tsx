"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { DemoProvider, useDemo } from "@/domain/demo/provider";
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
  return <DemoProvider><div className="demo-shell">
    <header className="demo-shell-header"><Link href="/" className="demo-shell-brand">CoBusiness<span>.</span></Link><span>Datos de demostración</span></header>
    <nav className="demo-shell-nav" aria-label="Vistas de la demo"><Link href="/buyer/dashboard" aria-current={pathname.startsWith("/buyer") ? "page" : undefined}>Comprador</Link><Link href="/operator/dashboard" aria-current={pathname.startsWith("/operator") ? "page" : undefined}>Operador</Link><Link href="/admin/dashboard" aria-current={pathname.startsWith("/admin") ? "page" : undefined}>CoBusiness</Link></nav>
    <main className="demo-shell-content">{children}<DemoControls /></main>
  </div></DemoProvider>;
}
