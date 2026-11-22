"use client";

import Link from "next/link";
import { useState } from "react";
import "./identity.css";

type Stage = "offer" | "goal" | "outcome";

const stages: Record<Stage, { label: string; title: string; description: string; detail: string }> = {
  offer: {
    label: "Oferta",
    title: "Conoce la oferta",
    description: "Una compra colectiva presenta el producto, sus condiciones y la cantidad mínima necesaria.",
    detail: "Antes de participar se podrán revisar el precio, el plazo y las condiciones de entrega.",
  },
  goal: {
    label: "Meta colectiva",
    title: "La demanda se reúne",
    description: "Las cantidades de varias personas se suman para alcanzar una meta común.",
    detail: "Llegar a la meta no autoriza por sí solo la liberación de fondos.",
  },
  outcome: {
    label: "Resultado",
    title: "Dos resultados posibles",
    description: "La operación puede avanzar tras las autorizaciones requeridas o habilitar devoluciones según sus condiciones.",
    detail: "El resultado comercial y el estado del pago se muestran por separado.",
  },
};

export default function IdentityPage() {
  const [stage, setStage] = useState<Stage>("offer");
  const selected = stages[stage];

  return (
    <main className="identity-page">
      <header className="identity-header"><Link href="/" className="identity-brand">CoBusiness<span>.</span></Link><Link href="/">Volver al inicio</Link></header>
      <div className="identity-layout">
        <section className="identity-intro" aria-labelledby="identity-title">
          <h1 id="identity-title">Explora una compra colectiva</h1>
          <p>Recorre las etapas previstas para reunir demanda y definir el resultado de una operación.</p>
          <div className="identity-notice"><strong>Demostración interactiva</strong><p>Este recorrido es ilustrativo. No realiza compras, pagos ni transacciones.</p></div>
        </section>
        <section className="identity-panel" aria-labelledby="stage-title">
          <h2 id="stage-title">Recorre el proceso</h2>
          <p>Elige una etapa para conocer cómo funciona.</p>
          <div className="identity-roles" role="group" aria-label="Etapa del recorrido">
            {(Object.keys(stages) as Stage[]).map((key) => <button key={key} type="button" aria-pressed={stage === key} onClick={() => setStage(key)}>{stages[key].label}</button>)}
          </div>
          <div className="identity-preview" aria-live="polite"><h3>{selected.title}</h3><p>{selected.description}</p><div className="identity-pending"><p>{selected.detail}</p></div></div>
          <p className="identity-footnote">Las funcionalidades de la operación se incorporarán progresivamente.</p>
        </section>
      </div>
    </main>
  );
}
