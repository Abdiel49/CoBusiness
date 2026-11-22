"use client";

import { formatMinor } from "@/domain/demo/money";
import type { DemoEvent, DemoOffer, DemoOrder } from "@/domain/demo/types";
import { DataRow, EventLog, StatusChip } from "./components";
import { formatDate } from "./format";
import { CheckIcon } from "./icons";
import type { CommissionSummary, OfferProgress, RefundSummary } from "./types";

function ChecklistRow({ done, title, detail }: { done: boolean; title: string; detail: string }) {
  return (
    <li className={done ? "identity-checklist-row identity-checklist-row--done" : "identity-checklist-row"}>
      <span className="identity-checklist-icon">
        <CheckIcon done={done} />
      </span>
      <div>
        <strong>{title}</strong>
        <span>{detail}</span>
      </div>
    </li>
  );
}

export function CoBusinessTab({
  offer,
  progress,
  orders,
  events,
  commission,
  refundSummary,
  hasUnclaimedSeededOrders,
  onAuthorizeRelease,
  onEnableRefund,
  onSettleRefunds,
}: {
  offer: DemoOffer;
  progress: OfferProgress;
  orders: DemoOrder[];
  events: DemoEvent[];
  commission: CommissionSummary;
  refundSummary: RefundSummary;
  hasUnclaimedSeededOrders: boolean;
  onAuthorizeRelease: () => void;
  onEnableRefund: () => void;
  onSettleRefunds: () => void;
}) {
  const commissionLabel = `Comisión ilustrativa de CoBusiness (${commission.rateBps / 100} %).`;
  const responseDetail =
    offer.operatorResponse === "pending"
      ? "Pendiente"
      : offer.operatorResponse === "continue"
        ? "El operador continúa."
        : "El operador rechazó la operación.";
  const authorizationDetail =
    offer.authorizationStatus === "pending"
      ? "Pendiente"
      : offer.authorizationStatus === "authorized"
        ? "Liberación autorizada."
        : "Devoluciones habilitadas.";

  return (
    <div className="identity-tab-content">
      <section className="identity-section" aria-labelledby="identity-admin-checklist-title">
        <div className="identity-section-head">
          <h2 id="identity-admin-checklist-title">Control de la operación</h2>
          <StatusChip
            label={offer.commercialStatus === "released" ? "Liberada" : offer.commercialStatus === "refunded" ? "Reembolsada" : "En curso"}
            tone={offer.commercialStatus === "released" ? "success" : offer.commercialStatus === "refunded" ? "refund" : "info"}
          />
        </div>
        <ul className="identity-checklist">
          <ChecklistRow
            done={progress.isGoalReached}
            title="Meta alcanzada"
            detail={`${progress.confirmedBlocks} de ${progress.totalBlocks} bloques confirmados.`}
          />
          <ChecklistRow done={offer.operatorResponse !== "pending"} title="Respuesta del operador" detail={responseDetail} />
          <ChecklistRow done={offer.authorizationStatus !== "pending"} title="Autorización" detail={authorizationDetail} />
        </ul>
      </section>

      {offer.commercialStatus === "accepted" && offer.escrowStatus === "awaiting_authorization" ? (
        <section className="identity-section" aria-labelledby="identity-admin-authorize-title">
          <div className="identity-section-head">
            <h2 id="identity-admin-authorize-title">Autorizar liberación</h2>
            <StatusChip label="Esperando autorización" tone="info" />
          </div>
          <p>El operador continúa. La liberación requiere que CoBusiness autorice.</p>
          <dl className="identity-rows">
            <DataRow label="Monto bruto">
              <span className="identity-num">{formatMinor(commission.grossMinor)}</span>
            </DataRow>
            <DataRow label="Comisión">
              <span className="identity-num">{formatMinor(commission.commissionMinor)}</span>
            </DataRow>
            <DataRow label="Monto neto">
              <span className="identity-num">{formatMinor(commission.netMinor)}</span>
            </DataRow>
          </dl>
          <p className="identity-fineprint">{commissionLabel}</p>
          <div className="identity-actions">
            <button type="button" className="identity-button identity-button--primary" onClick={onAuthorizeRelease}>
              Autorizar liberación
            </button>
          </div>
        </section>
      ) : null}

      {offer.commercialStatus === "declined" && offer.escrowStatus === "refund_pending" ? (
        <section className="identity-section" aria-labelledby="identity-admin-refund-enable-title">
          <div className="identity-section-head">
            <h2 id="identity-admin-refund-enable-title">Habilitar devoluciones</h2>
            <StatusChip label="Devolución pendiente" tone="refund" />
          </div>
          <p>El operador rechazó la operación. CoBusiness debe habilitar las devoluciones.</p>
          <dl className="identity-rows">
            <DataRow label="Monto reembolsable">
              <span className="identity-num">{formatMinor(refundSummary.totalRefundMinor)}</span>
            </DataRow>
            <DataRow label="Comisión">Sin comisión</DataRow>
            <DataRow label="Pedidos confirmados">
              <span className="identity-num">{refundSummary.eligibleOrders}</span>
            </DataRow>
          </dl>
          <p className="identity-fineprint">Habilitar devoluciones no es un pago. Cada comprador debe reclamar su reembolso en la demostración.</p>
          <div className="identity-actions">
            <button type="button" className="identity-button identity-button--primary" onClick={onEnableRefund}>
              Habilitar devoluciones
            </button>
          </div>
        </section>
      ) : null}

      {offer.escrowStatus === "released" || offer.commercialStatus === "released" ? (
        <section className="identity-section" aria-labelledby="identity-admin-released-title">
          <div className="identity-final identity-final--success">
            <h2 id="identity-admin-released-title">Operación liberada (simulada).</h2>
            <p>El operador continuó y CoBusiness autorizó la liberación. No existe una transacción real.</p>
            <dl className="identity-rows">
              <DataRow label="Monto bruto">
                <span className="identity-num">{formatMinor(commission.grossMinor)}</span>
              </DataRow>
              <DataRow label="Comisión">
                <span className="identity-num">{formatMinor(commission.commissionMinor)}</span>
              </DataRow>
              <DataRow label="Monto neto">
                <span className="identity-num">{formatMinor(commission.netMinor)}</span>
              </DataRow>
            </dl>
            <p className="identity-fineprint">{commissionLabel}</p>

            <div className="identity-document">
              <h3>Documento consolidado de ejemplo</h3>
              <dl className="identity-rows">
                <DataRow label="Oferta">{offer.title}</DataRow>
                <DataRow label="Operador">{offer.operatorName}</DataRow>
                <DataRow label="Bloques confirmados">
                  <span className="identity-num">{progress.confirmedBlocks}</span>
                </DataRow>
                <DataRow label="Fecha de liberación">
                  {offer.releasedAt ? formatDate(offer.releasedAt) : "Sin fecha"}
                </DataRow>
              </dl>
              <p className="identity-fineprint">Documento de ejemplo. Sin validez legal.</p>
            </div>
          </div>
        </section>
      ) : null}

      {offer.escrowStatus === "refund_available" ? (
        <section className="identity-section" aria-labelledby="identity-admin-refund-summary-title">
          <div className="identity-section-head">
            <h2 id="identity-admin-refund-summary-title">Reembolsos de ejemplo</h2>
            <StatusChip label="Devoluciones disponibles" tone="refund" />
          </div>
          <p>Las devoluciones están habilitadas. Los compradores pueden reclamar su reembolso simulado.</p>
          <dl className="identity-rows">
            <DataRow label="Pedidos elegibles">
              <span className="identity-num">{refundSummary.eligibleOrders}</span>
            </DataRow>
            <DataRow label="Monto reembolsable">
              <span className="identity-num">{formatMinor(refundSummary.totalRefundMinor)}</span>
            </DataRow>
            <DataRow label="Pedidos reclamados">
              <span className="identity-num">{refundSummary.claimedOrders}</span>
            </DataRow>
            <DataRow label="Monto reclamado">
              <span className="identity-num">{formatMinor(refundSummary.claimedAmountMinor)}</span>
            </DataRow>
            <DataRow label="Comisión">Sin comisión</DataRow>
          </dl>
          {hasUnclaimedSeededOrders ? (
            <>
              <p className="identity-fineprint">Esta acción liquida los pedidos de demostración que aún no reclamaron su reembolso. Es una ayuda de la demo, no un pago real.</p>
              <div className="identity-actions">
                <button type="button" className="identity-button identity-button--secondary" onClick={onSettleRefunds}>
                  Liquidar reembolsos de ejemplo
                </button>
              </div>
            </>
          ) : (
            <p className="identity-fineprint">Los reembolsos de ejemplo ya fueron liquidados.</p>
          )}
        </section>
      ) : null}

      {offer.escrowStatus === "refunded" || offer.commercialStatus === "refunded" ? (
        <section className="identity-section" aria-labelledby="identity-admin-refunded-title">
          <div className="identity-final identity-final--refund">
            <h2 id="identity-admin-refunded-title">Operación reembolsada (simulada).</h2>
            <p>Las devoluciones se completaron en la demostración. No se movió dinero real.</p>
            <dl className="identity-rows">
              <DataRow label="Total reembolsado">
                <span className="identity-num">{formatMinor(refundSummary.claimedAmountMinor)}</span>
              </DataRow>
              <DataRow label="Pedidos reembolsados">
                <span className="identity-num">{refundSummary.claimedOrders}</span>
              </DataRow>
              <DataRow label="Comisión">Sin comisión</DataRow>
            </dl>
          </div>
        </section>
      ) : null}

      <section className="identity-section" aria-labelledby="identity-admin-events-title">
        <div className="identity-section-head">
          <h2 id="identity-admin-events-title">Registro de eventos</h2>
          <span className="identity-fineprint">
            <span className="identity-num">{orders.length}</span> reservas · solo lectura
          </span>
        </div>
        <EventLog events={events} />
      </section>
    </div>
  );
}
