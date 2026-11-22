"use client";

import Link from "next/link";
import { useReducer } from "react";
import { BLOCK_PRICE, BLOCK_SIZE, TOTAL_BLOCKS, UNIT_PRICE, createQuickDemo, quickDemoReducer, type DemoRole, type Stage } from "@/domain/demo/quick-demo";

const money = (value: number) => `Bs ${value.toLocaleString("es-BO")}`;
const roles: Record<DemoRole, { label: string; detail: string }> = {
  buyer: { label: "COMPRADOR", detail: "Selecciona bloques, acepta condiciones, aporta y reclama tu devolución." },
  importer: { label: "IMPORTADOR", detail: "Consulta la oferta y ratifica o rechaza la operación cuando se alcance el mínimo." },
  admin: { label: "ADMINISTRACIÓN COBUSINESS", detail: "Supervisa el saldo y la actividad; autoriza el desembolso o habilita devoluciones." },
};
const nextRole: Partial<Record<Stage, DemoRole>> = { collecting: "buyer", funded: "importer", ratified: "admin", authorized: "admin", rejected: "admin", "refund-available": "buyer" };
const stages: Record<Stage, { commercial: string; financial: string; title: string; detail: string }> = {
  collecting: { commercial: "Reuniendo pedidos", financial: "Recaudación en curso", title: "Tu pedido acerca la compra al mínimo.", detail: "Elige bloques, acepta las condiciones y simula tu aporte. El saldo no se entrega al importador." },
  funded: { commercial: "Mínimo alcanzado", financial: "Financiada · saldo retenido", title: "Meta alcanzada. El dinero aún no se libera.", detail: "Financiar la operación no autoriza el desembolso. Primero debe decidir el importador." },
  ratified: { commercial: "Ratificada por el importador", financial: "Pendiente de autorización", title: "El importador confirmó la operación.", detail: "Precio, cantidad y condiciones ratificados. Falta la autorización de CoBusiness para liberar el saldo." },
  authorized: { commercial: "Compra autorizada", financial: "Desembolso autorizado", title: "Las dos aprobaciones están listas.", detail: "La ratificación comercial y la autorización de CoBusiness permiten simular el desembolso." },
  released: { commercial: "Abastecimiento pendiente", financial: "Desembolso completado", title: "Compra en marcha. Desembolso simulado completado.", detail: "El importador ficticio recibió el saldo demo. Esto no demuestra compra, importación ni entrega de mercancía real." },
  rejected: { commercial: "Cancelada por el importador", financial: "Saldo retenido · sin desembolso", title: "El importador rechazó la operación.", detail: "Aunque se alcanzó la meta, no se realizará la compra. El siguiente paso es habilitar la devolución." },
  "refund-available": { commercial: "Operación cancelada", financial: "Devolución disponible", title: "Puedes recuperar tu aporte.", detail: "CoBusiness habilitó la devolución. El comprador puede reclamar su aporte simulado completo." },
  refunded: { commercial: "Operación cancelada", financial: "Tu devolución completada", title: "Tu aporte volvió a tu saldo demo.", detail: "No hubo desembolso al importador. Tu devolución finalizó; los demás compradores mantienen sus reclamos independientes." },
};

export function QuickDemo() {
  const [state, dispatch] = useReducer(quickDemoReducer, undefined, () => createQuickDemo());
  const current = stages[state.stage];
  const rejection = ["rejected", "refund-available", "refunded"].includes(state.stage) || (state.scenario === "rejection" && state.stage === "funded");
  const terminal = state.stage === "released" || state.stage === "refunded";
  const waitingFor = nextRole[state.stage];
  const ownAmount = state.ownBlocks * BLOCK_PRICE;
  const heldAmount = state.stage === "released" ? 0 : state.fundedBlocks * BLOCK_PRICE - (state.stage === "refunded" ? ownAmount : 0);
  const steps = rejection ? ["Meta financiada", "Rechazo importador", "Habilitar devolución", "Reclamar aporte"] : ["Aportar", "Alcanzar meta", "Ratificar", "Autorizar", "Desembolsar"];
  const progress: Partial<Record<Stage, number>> = rejection ? { funded: 1, rejected: 2, "refund-available": 3, refunded: 4 } : { collecting: state.ownBlocks > 0 ? 1 : 0, funded: 2, ratified: 3, authorized: 4, released: 5 };
  const stepIndex = progress[state.stage] ?? 0;

  return <div className="quick-demo">
    <a className="skip-link" href="#demo-main">Saltar al contenido</a>
    <header className="quick-header">
      <Link href="/" className="quick-brand" aria-label="CoBusiness, volver al inicio"><svg viewBox="0 0 48 48" aria-hidden="true"><path d="m24 4 19 10.5v19L24 44 5 33.5v-19Z" fill="currentColor"/><path d="m14 18 10-5.5L34 18l-10 5.5L14 18Zm0 8 10 5.5L34 26" fill="none" stroke="white" strokeWidth="2.4"/></svg>CoBusiness</Link>
      <span className="quick-demo-label">Demo interactiva · 90 segundos</span>
      <Link href="/" className="quick-home">Volver al inicio</Link>
    </header>
    <div className="quick-simulation"><strong>SIMULACIÓN</strong><span>Datos ficticios. Sin dinero real, backend, wallet ni blockchain. Todos los movimientos son simulados.</span></div>
    <main id="demo-main" className="quick-main">
      <div className="quick-intro"><div><h1>Un pedido colectivo.<br/>{" "}Dos posibles resultados.</h1><p>Prueba cómo se reúne la compra y qué sucede con el aporte en cada escenario.</p></div><button className="quick-secondary" onClick={() => dispatch({ type: "reset", scenario: state.scenario })}>Reiniciar escenario</button></div>
      <section className="quick-role-switcher" aria-label="Vista por rol simulada">
        <div className="quick-role-buttons" role="group" aria-label="Cambiar rol sin reiniciar">{(Object.keys(roles) as DemoRole[]).map(role => <button key={role} aria-pressed={state.role === role} onClick={() => dispatch({ type: "change-role", role })}>{roles[role].label}</button>)}</div>
        <p><strong>Vista: {roles[state.role].label}.</strong> {roles[state.role].detail} Cambiar rol conserva el avance; no es autenticación.</p>
      </section>
      <div className="quick-scenarios" role="group" aria-label="Elegir escenario; cambiar reinicia el recorrido">
        <button aria-pressed={!rejection} onClick={() => dispatch({ type: "reset", scenario: "success" })}>Compra exitosa<span>Aporte, aprobaciones y desembolso</span></button>
        <button aria-pressed={rejection} onClick={() => dispatch({ type: "reset", scenario: "rejection" })}>Rechazo y devolución<span>Operación financiada, aporte recuperable</span></button>
      </div>
      <ol className="quick-steps" aria-label="Progreso del escenario">{steps.map((step, index) => <li key={step} className={index < stepIndex ? "is-done" : index === stepIndex ? "is-current" : ""} aria-current={index === stepIndex ? "step" : undefined}><span>{index + 1}</span>{step}</li>)}</ol>
      <div className="quick-workspace">
        <section className="quick-offer" aria-labelledby="quick-offer-title">
          <div className="quick-offer-heading"><h2 id="quick-offer-title">Termos de acero inoxidable</h2><span className="quick-chip">Oferta ficticia</span></div>
          <p className="quick-offer-subtitle">750 ml · Importador demo Bolivia · Pedido CB-DEMO-001</p>
          <dl className="quick-specs"><div><dt>Precio unitario</dt><dd>{money(UNIT_PRICE)}</dd></div><div><dt>Pedido mínimo</dt><dd>1.000 termos</dd></div><div><dt>Cada bloque</dt><dd>100 unidades</dd></div><div><dt>Valor por bloque</dt><dd>{money(BLOCK_PRICE)}</dd></div></dl>
          <div className="quick-progress-heading"><h3>Compra reunida</h3><strong>{state.fundedBlocks} de 10 bloques</strong></div>
          <div className="quick-blocks" role="img" aria-label={`${state.fundedBlocks} de 10 bloques financiados; cada bloque contiene 100 termos`}>{Array.from({ length: TOTAL_BLOCKS }, (_, i) => <span key={i} className={i < state.fundedBlocks - state.ownBlocks ? "is-funded" : i < state.fundedBlocks ? "is-own" : ""}>{i + 1}</span>)}</div>
          <div className="quick-progress" role="progressbar" aria-label="Recaudación simulada" aria-valuemin={0} aria-valuemax={50000} aria-valuenow={state.fundedBlocks * BLOCK_PRICE}><span style={{ width: `${state.fundedBlocks * 10}%` }}/></div>
          <p className="quick-raised"><strong>{money(state.fundedBlocks * BLOCK_PRICE)}</strong> de {money(50000)} simulados <span>{state.fundedBlocks * 10}%</span></p>
          <div className="quick-conditions"><h3>Condiciones de esta oferta demo</h3><ul><li>10 bloques de 100 termos. Cierre al completar el mínimo.</li><li>Importador responsable de abastecimiento y entrega; retiro ficticio en La Paz, 30 días después del desembolso.</li><li>El saldo requiere ratificación del importador y autorización de CoBusiness. La meta no libera fondos.</li><li>Si el importador rechaza, la compra se cancela y se habilita el reclamo del aporte completo. Sin comisiones en esta demo.</li></ul></div>
        </section>
        <section className={`quick-action-panel${rejection ? " is-rejection" : ""}`} aria-labelledby="quick-action-title">
          <div className="quick-state-grid"><div><span>Flujo comercial</span><strong>{current.commercial}</strong></div><div><span>Movimientos SIMULADOS</span><strong>{current.financial}</strong></div></div>
          <div className="quick-next" key={state.stage}>
            <h2 id="quick-action-title">{current.title}</h2><p>{current.detail}</p>
            {waitingFor && waitingFor !== state.role ? <p className="quick-confirmation">Siguiente paso: cambia a {roles[waitingFor].label}. Esta vista solo consulta el estado actual.</p> : null}
            {state.role === "buyer" && state.stage === "collecting" && state.ownBlocks === 0 ? <>
              <label className="quick-select-label" htmlFor="quick-block-count">¿Cuántos bloques necesitas?</label><select id="quick-block-count" value={state.blocks} onChange={event => dispatch({ type: "select", blocks: Number(event.target.value) })}>{Array.from({ length: TOTAL_BLOCKS - state.fundedBlocks }, (_, i) => <option key={i} value={i + 1}>{i + 1} {i === 0 ? "bloque" : "bloques"} · {(i + 1) * BLOCK_SIZE} termos</option>)}</select>
              <div className="quick-total"><span>Tu aporte simulado</span><strong>{money(state.blocks * BLOCK_PRICE)}</strong></div>
              <label className="quick-checkbox"><input type="checkbox" checked={state.accepted} onChange={event => dispatch({ type: "accept", accepted: event.target.checked })}/><span>Acepto las condiciones de esta oferta ficticia y entiendo que no se moverá dinero real.</span></label>
              <button className="quick-primary" disabled={!state.accepted} onClick={() => dispatch({ type: "contribute" })}>Simular aporte</button>{!state.accepted ? <p className="quick-help">Acepta las condiciones para continuar.</p> : null}
            </> : null}
            {state.role === "buyer" && state.stage === "collecting" && state.ownBlocks > 0 ? <><p className="quick-confirmation">Aporte confirmado: {state.ownBlocks} bloque(s) · {money(ownAmount)} simulados.</p><button className="quick-primary" onClick={() => dispatch({ type: "complete" })}>Simular aportes restantes</button></> : null}
            {state.role === "importer" && state.stage === "funded" ? <><button className="quick-primary" onClick={() => dispatch({ type: "ratify" })}>Ratificar operación como importador</button><button className="quick-primary quick-danger" onClick={() => dispatch({ type: "reject" })}>Simular rechazo del importador</button></> : null}
            {state.role === "admin" && state.stage === "ratified" ? <button className="quick-primary" onClick={() => dispatch({ type: "authorize" })}>Autorizar como CoBusiness</button> : null}
            {state.role === "admin" && state.stage === "authorized" ? <button className="quick-primary" onClick={() => dispatch({ type: "release" })}>Simular desembolso de Bs 50.000</button> : null}
            {state.role === "admin" && state.stage === "rejected" ? <button className="quick-primary" onClick={() => dispatch({ type: "enable-refund" })}>Habilitar devolución simulada</button> : null}
            {state.role === "buyer" && state.stage === "refund-available" ? <button className="quick-primary" onClick={() => dispatch({ type: "refund" })}>Reclamar mis {money(ownAmount)} simulados</button> : null}
            {terminal ? <div className="quick-finished"><strong>{rejection ? "Devolución completada" : "Desembolso completado"} · SIMULADO</strong><button className="quick-primary" onClick={() => dispatch({ type: "reset", scenario: rejection ? "success" : "rejection" })}>{rejection ? "Probar compra exitosa" : "Probar rechazo y devolución"}</button></div> : null}
          </div>
          <dl className="quick-balances"><div><dt>Saldo retenido simulado</dt><dd>{money(heldAmount)}</dd></div><div><dt>{state.stage === "refunded" ? "Tu aporte devuelto" : "Tu aporte confirmado"}</dt><dd>{money(ownAmount)}</dd></div></dl>
        </section>
      </div>
      <section className="quick-activity" aria-labelledby="quick-activity-title"><div className="quick-activity-title"><h2 id="quick-activity-title">Actividad de la simulación</h2><span>Solo en esta sesión · reinicia al recargar</span></div><p className="quick-live" role="status" aria-live="polite" aria-atomic="true">{state.events[state.events.length - 1]}</p><ol>{state.events.map((event, index) => <li key={`${index}-${event}`}><span className="quick-event-index">{String(index + 1).padStart(2, "0")}</span>{event}</li>)}</ol></section>
      <footer className="quick-footer">Demo de flujo comercial, no plataforma de inversión. No se crean pedidos ni transacciones reales.</footer>
    </main>
  </div>;
}
