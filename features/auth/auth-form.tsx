"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { DemoRole } from "@/domain/demo/types";
import { useAuth, rolePath } from "./session";
import "./auth.css";

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const { login, error, loading, retry, logout } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<DemoRole>("buyer");
  const [submitted, setSubmitted] = useState(false);
  const emailInvalid = !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const passwordInvalid = password.length < 8;
  const register = mode === "register";
  return <main className="auth-page"><header className="auth-header"><Link href="/" className="auth-brand">CoBusiness<span>.</span></Link><Link href="/">Volver al inicio</Link></header><div className="auth-layout"><section className="auth-intro"><h1>{register ? "Crea tu acceso a la demo" : "Entra a la demo"}</h1><p>Explora la compra colectiva desde la perspectiva que elijas.</p><div className="auth-note"><strong>Una experiencia simulada</strong><p>Los datos se guardan en este navegador. No se crea una cuenta real ni se envían credenciales.</p></div></section><section className="auth-panel"><h2>{register ? "Crear acceso" : "Iniciar sesión"}</h2><p>Elige un rol para continuar. Podrás cambiarlo después.</p><form noValidate onSubmit={(event) => { event.preventDefault(); setSubmitted(true); if (!emailInvalid && !passwordInvalid && login(email.trim(), role)) router.push(rolePath(role)); }}>
    <label htmlFor="email">Correo electrónico</label><input id="email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} aria-invalid={submitted && emailInvalid} aria-describedby={submitted && emailInvalid ? "email-error" : undefined} />{submitted && emailInvalid && <p id="email-error" className="auth-error">Escribe un correo válido.</p>}
    <label htmlFor="password">Contraseña</label><input id="password" type="password" autoComplete={register ? "new-password" : "current-password"} value={password} onChange={(event) => setPassword(event.target.value)} aria-invalid={submitted && passwordInvalid} aria-describedby={submitted && passwordInvalid ? "password-error" : "password-help"} /><p id="password-help" className="auth-help">Mínimo 8 caracteres. No se guardará.</p>{submitted && passwordInvalid && <p id="password-error" className="auth-error">Escribe al menos 8 caracteres.</p>}
    <label htmlFor="role">Rol de la demo</label><select id="role" value={role} onChange={(event) => setRole(event.target.value as DemoRole)}><option value="buyer">Comprador</option><option value="operator">Operador</option><option value="admin">CoBusiness</option></select>
    {error && <div role="alert"><p className="auth-error">{error}</p><button type="button" onClick={retry}>Reintentar</button><button type="button" onClick={logout}>Descartar sesión demo</button></div>}<button type="submit" disabled={loading}>{register ? "Crear acceso demo" : "Entrar a la demo"}</button></form><p className="auth-switch">{register ? "¿Ya tienes acceso? " : "¿Primera vez aquí? "}<Link href={register ? "/login" : "/register"}>{register ? "Inicia sesión" : "Crear acceso"}</Link></p></section></div></main>;
}
