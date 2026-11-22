"use client";

import { formatMinor } from "@/domain/demo/money";
import type { DemoOffer, DemoOrder } from "@/domain/demo/types";
import { DataRow, EmptyState, ResultBanner, StatusChip } from "./components";
import { formatDate, formatDateTime, formatUnits, paymentStatusLabel, paymentStatusTone } from "./format";
import type { OfferProgress } from "./types";

export function OperatorTab({
  offer,
  progress,
  orders,
  onContinue,
  onDecline,
}: {
  offer: DemoOffer;
  progress: OfferProgress;
  orders: DemoOrder[];
  onContinue: () => void;
  onDecline: () => void;
}) {
  const canRespond = offer.commercialStatus === "goal_reached" && offer.operatorResponse === "pending";
  const responseDeadline = offer.operatorResponseDeadline ? formatDate(offer.operatorResponseDeadline) : null;

  return (
    <div className="identity-tab-content">
      <section className="identity-section" aria-labelledby="identity-operator-demand-title">
        <div className="identity-section-head">
          <h2 id="identity-operator-demand-title">Demanda confirmada</h2>
          <StatusChip
            label={progress.isGoalReached ? "Meta alcanzada" : "En recolección"}
            tone={progress.isGoalReached ? "info" : "neutral"}
          />
        </div>
        <dl className="identity-rows">
          <DataRow label="Bloques confirmados">
            <span className="identity-num">{progress.confirmedBlocks} / {progress.totalBlocks}</span>
          </DataRow>
          <DataRow label="Bloques pendientes">
            <span className="identity-num">{progress.pendingBlocks}</span>
          </DataRow>
          <DataRow label="Meta colectiva">
            <span className="identity-num">{progress.totalBlocks} bloques</span>
          </DataRow>
          <DataRow label="Plazo de la oferta">{formatDate(offer.deadline)}</DataRow>
          {offer.goalReachedAt ? <DataRow label="Meta alcanzada el">{formatDate(offer.goalReachedAt)}</DataRow> : null}
        </dl>
      </section>

      <section className="identity-section" aria-labelledby="identity-operator-buyers-title">
        <div className="identity-section-head">
          <h2 id="identity-operator-buyers-title">Compradores</h2>
          <span className="identity-fineprint">
            <span className="identity-num">{orders.length}</span> reservas en la demostración
          </span>
        </div>
        {orders.length === 0 ? (
          <EmptyState>Todavía no hay reservas.</EmptyState>
        ) : (
          <ul className="identity-buyer-list">
            {orders.map((order) => (
              <li className="identity-buyer" key={order.id}>
                <div className="identity-buyer-main">
                  <strong>{order.buyerAlias}</strong>
                  <span>{formatDateTime(order.createdAt)}</span>
                </div>
                <div className="identity-buyer-meta">
                  <span className="identity-num">{order.blockCount} bloques</span>
                  <span className="identity-num">{formatUnits(order.blockCount, offer.unitsPerBlock, offer.unitLabel)}</span>
                  <span className="identity-num">{formatMinor(order.amountMinor)}</span>
                </div>
                <div className="identity-buyer-status">
                  <StatusChip label={paymentStatusLabel(order.paymentStatus)} tone={paymentStatusTone(order.paymentStatus)} />
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="identity-section" aria-labelledby="identity-operator-response-title">
        <div className="identity-section-head">
          <h2 id="identity-operator-response-title">Respuesta del operador</h2>
          <StatusChip
            label={offer.operatorResponse === "pending" ? "Pendiente" : offer.operatorResponse === "continue" ? "Continuar" : "Rechazó"}
            tone={offer.operatorResponse === "decline" ? "warning" : offer.operatorResponse === "continue" ? "info" : "neutral"}
          />
        </div>

        {responseDeadline ? (
          <p className="identity-note">
            Ventana de respuesta de 24 horas: hasta <strong>{responseDeadline}</strong>.
          </p>
        ) : null}

        {canRespond ? (
          <>
            <p>
              La meta está alcanzada. El operador puede continuar con la operación o rechazarla. La liberación requiere que
              el operador continúe y que CoBusiness autorice.
            </p>
            <div className="identity-actions">
              <button type="button" className="identity-button identity-button--primary" onClick={onContinue}>
                Continuar con la operación
              </button>
              <button type="button" className="identity-button identity-button--secondary" onClick={onDecline}>
                Rechazar la operación
              </button>
            </div>
          </>
        ) : null}

        {!progress.isGoalReached && offer.commercialStatus === "collecting" ? (
          <div className="identity-disabled-note">
            <p>La meta aún no se alcanzó. El operador no puede responder todavía.</p>
            <p>El operador solo puede responder cuando la meta esté alcanzada.</p>
          </div>
        ) : null}

        {offer.commercialStatus === "accepted" ? (
          <ResultBanner tone="info" title="El operador continúa (simulado).">
            El operador continúa. CoBusiness debe autorizar la liberación.
          </ResultBanner>
        ) : null}

        {offer.commercialStatus === "declined" && offer.escrowStatus === "refund_pending" ? (
          <ResultBanner tone="warning" title="El operador rechazó la operación (simulada).">
            El operador rechazó la operación. CoBusiness debe habilitar las devoluciones.
          </ResultBanner>
        ) : null}

        {offer.commercialStatus === "released" ? (
          <ResultBanner tone="success" title="Operación liberada (simulada).">
            El operador continuó y CoBusiness autorizó la liberación. Esta vista es de solo lectura.
          </ResultBanner>
        ) : null}

        {offer.commercialStatus === "refunded" ? (
          <ResultBanner tone="refund" title="Operación reembolsada (simulada).">
            Las devoluciones se completaron en la demostración. Esta vista es de solo lectura.
          </ResultBanner>
        ) : null}
      </section>
    </div>
  );
}
