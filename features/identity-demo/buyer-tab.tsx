"use client";

import type { FormEvent } from "react";
import { formatMinor, multiplyMinor } from "@/domain/demo/money";
import type { DemoOffer, DemoOrder, DemoWallet, WalletNetwork } from "@/domain/demo/types";
import { DataRow, EmptyState, ResultBanner, StatusChip } from "./components";
import {
  failureReasonLabel,
  formatDate,
  formatDateTime,
  formatUnits,
  paymentStatusLabel,
  paymentStatusTone,
  truncateAddress,
  type StatusTone,
} from "./format";
import { ArrowRightIcon, WalletIcon } from "./icons";
import type { OfferProgress } from "./types";

function getOutcome(offer: DemoOffer): { tone: StatusTone; title: string; description: string } {
  if (offer.escrowStatus === "refund_available") {
    return {
      tone: "refund",
      title: "Devoluciones habilitadas (simuladas).",
      description: "Puedes reclamar el reembolso simulado de tu reserva confirmada. No se mueve dinero real.",
    };
  }
  if (offer.escrowStatus === "refunded" || offer.commercialStatus === "refunded") {
    return {
      tone: "refund",
      title: "Operación reembolsada (simulada).",
      description: "Las devoluciones se reclamaron en la demostración. No se movió dinero real.",
    };
  }
  if (offer.escrowStatus === "released" || offer.commercialStatus === "released") {
    return {
      tone: "success",
      title: "Operación liberada (simulada).",
      description: "El operador continuó y CoBusiness autorizó la liberación. No existe una transacción real.",
    };
  }
  if (offer.commercialStatus === "declined") {
    return {
      tone: "warning",
      title: "Operación rechazada por el operador (simulada).",
      description: "CoBusiness debe habilitar las devoluciones.",
    };
  }
  if (offer.commercialStatus === "accepted") {
    return {
      tone: "info",
      title: "El operador continúa (simulado).",
      description: "CoBusiness debe autorizar la liberación.",
    };
  }
  if (offer.commercialStatus === "goal_reached") {
    return {
      tone: "info",
      title: "La meta colectiva fue alcanzada.",
      description: "La liberación aún requiere la respuesta del operador y la autorización de CoBusiness.",
    };
  }
  return {
    tone: "neutral",
    title: "Oferta en recolección.",
    description: "La meta colectiva todavía no se alcanzó.",
  };
}

export function BuyerTab({
  offer,
  progress,
  wallet,
  orders,
  pendingOrder,
  confirmedOrder,
  refundableOrder,
  claimedOrder,
  blockCountInput,
  onBlockCountChange,
  termsAccepted,
  onTermsChange,
  purchaseBlocker,
  onPurchase,
  onConnect,
  onDisconnect,
  onSetNetwork,
  onOpenSignature,
  onCancelReservation,
  onRetry,
  onClaimRefund,
}: {
  offer: DemoOffer;
  progress: OfferProgress;
  wallet: DemoWallet;
  orders: DemoOrder[];
  pendingOrder: DemoOrder | null;
  confirmedOrder: DemoOrder | null;
  refundableOrder: DemoOrder | null;
  claimedOrder: DemoOrder | null;
  blockCountInput: string;
  onBlockCountChange: (value: string) => void;
  termsAccepted: boolean;
  onTermsChange: (value: boolean) => void;
  purchaseBlocker: string | null;
  onPurchase: (event: FormEvent<HTMLFormElement>) => void;
  onConnect: (network: WalletNetwork) => void;
  onDisconnect: () => void;
  onSetNetwork: (network: WalletNetwork) => void;
  onOpenSignature: (orderId: string) => void;
  onCancelReservation: (orderId: string) => void;
  onRetry: (orderId: string) => void;
  onClaimRefund: (orderId: string) => void;
}) {
  const outcome = getOutcome(offer);
  const parsedBlockCount = blockCountInput.trim() === "" ? Number.NaN : Number(blockCountInput);
  const isValidBlockCount = Number.isSafeInteger(parsedBlockCount) && parsedBlockCount > 0;
  const safeBlockCount = isValidBlockCount ? parsedBlockCount : 0;
  const units = safeBlockCount * offer.unitsPerBlock;
  const totalMinor = multiplyMinor(offer.blockPriceMinor, safeBlockCount);
  const isPublicNetwork = wallet.network === "PUBLIC";

  return (
    <div className="identity-tab-content">
      <ResultBanner tone={outcome.tone} title={outcome.title}>
        {outcome.description}
      </ResultBanner>

      <section className="identity-section" aria-labelledby="identity-wallet-title">
        <div className="identity-section-head">
          <h2 id="identity-wallet-title">Wallet simulada</h2>
          {wallet.address && wallet.network ? (
            <StatusChip label={wallet.network === "TESTNET" ? "Testnet simulada" : "Red pública simulada"} tone={isPublicNetwork ? "warning" : "info"} />
          ) : (
            <StatusChip label="Sin conectar" />
          )}
        </div>

        {wallet.address && wallet.network ? (
          <div className="identity-wallet">
            <div className="identity-wallet-head">
              <span className="identity-wallet-icon"><WalletIcon /></span>
              <div>
                <p className="identity-address">{truncateAddress(wallet.address)}</p>
                <p className="identity-fineprint">Billetera simulada. No se solicitan claves ni se firma nada real.</p>
              </div>
            </div>
            <div className="identity-actions">
              <button type="button" className="identity-button identity-button--secondary" onClick={onDisconnect}>
                Desconectar
              </button>
              <button
                type="button"
                className="identity-button identity-button--secondary"
                onClick={() => onSetNetwork("TESTNET")}
                disabled={wallet.network === "TESTNET"}
              >
                Cambiar a Testnet
              </button>
              <button
                type="button"
                className="identity-button identity-button--ghost"
                onClick={() => onSetNetwork("PUBLIC")}
                disabled={wallet.network === "PUBLIC"}
              >
                Simular red pública
              </button>
            </div>
            {isPublicNetwork ? (
              <p className="identity-warning">
                Estás en la red pública simulada. Cambia a Testnet para continuar. No se realizó ningún cargo.
              </p>
            ) : null}
          </div>
        ) : (
          <div className="identity-wallet">
            <p>
              Conecta una billetera ficticia para reservar bloques. La billetera es simulada y no se solicitan claves ni
              firmas reales.
            </p>
            <div className="identity-actions">
              <button type="button" className="identity-button identity-button--primary" onClick={() => onConnect("TESTNET")}>
                Conectar wallet simulada
              </button>
              <button type="button" className="identity-button identity-button--secondary" onClick={() => onConnect("PUBLIC")}>
                Conectar en red pública (simular red incorrecta)
              </button>
            </div>
          </div>
        )}
      </section>

      <section className="identity-section" aria-labelledby="identity-purchase-title">
        <div className="identity-section-head">
          <h2 id="identity-purchase-title">Reservar bloques</h2>
          <span className="identity-availability identity-num">
            {progress.availableBlocks === 1
              ? "Queda 1 bloque disponible."
              : `Quedan ${progress.availableBlocks} bloques disponibles.`}
          </span>
        </div>

        <form className="identity-form" onSubmit={onPurchase}>
          <div className="identity-form-row">
            <label htmlFor="identity-block-count">Bloques a reservar</label>
            <input
              id="identity-block-count"
              className="identity-input identity-num"
              type="number"
              inputMode="numeric"
              min={1}
              max={Math.max(progress.availableBlocks, 1)}
              step={1}
              value={blockCountInput}
              onChange={(event) => onBlockCountChange(event.target.value)}
              aria-describedby={purchaseBlocker ? "identity-purchase-blocker" : undefined}
            />
          </div>

          <div className="identity-calculation">
            <div>
              <span>Unidades</span>
              <strong className="identity-num">{units} {offer.unitLabel}</strong>
            </div>
            <div>
              <span>Total</span>
              <strong className="identity-num">{formatMinor(totalMinor)}</strong>
            </div>
          </div>

          <label className="identity-check">
            <input type="checkbox" checked={termsAccepted} onChange={(event) => onTermsChange(event.target.checked)} />
            <span>
              Acepto los términos simulados, versión <span className="identity-num">{offer.termsVersion}</span>.
            </span>
          </label>
          <p className="identity-terms-summary">{offer.termsSummary}</p>

          {purchaseBlocker ? (
            <p className="identity-form-hint" id="identity-purchase-blocker">
              {purchaseBlocker}
            </p>
          ) : null}

          <div className="identity-actions">
            <button
              type="submit"
              className="identity-button identity-button--primary"
              disabled={Boolean(purchaseBlocker)}
              aria-describedby={purchaseBlocker ? "identity-purchase-blocker" : undefined}
            >
              <span>Firmar y reservar</span>
              <ArrowRightIcon />
            </button>
          </div>
        </form>
      </section>

      {pendingOrder ? (
        <section className="identity-section" aria-labelledby="identity-pending-title">
          <div className="identity-pending-reservation">
            <div>
              <h2 id="identity-pending-title">Reserva pendiente</h2>
              <p>Reserva pendiente. Todavía no cuenta para la meta.</p>
              <p className="identity-num">
                {pendingOrder.blockCount} bloques · {formatUnits(pendingOrder.blockCount, offer.unitsPerBlock, offer.unitLabel)} ·{" "}
                {formatMinor(pendingOrder.amountMinor)}
              </p>
            </div>
            <div className="identity-actions">
              <button type="button" className="identity-button identity-button--primary" onClick={() => onOpenSignature(pendingOrder.id)}>
                Reanudar firma
              </button>
              <button type="button" className="identity-button identity-button--ghost" onClick={() => onCancelReservation(pendingOrder.id)}>
                Cancelar reserva
              </button>
            </div>
          </div>
        </section>
      ) : null}

      <section className="identity-section" aria-labelledby="identity-receipt-title">
        <div className="identity-section-head">
          <h2 id="identity-receipt-title">Constancia</h2>
          {confirmedOrder ? <StatusChip label={paymentStatusLabel(confirmedOrder.paymentStatus)} tone={paymentStatusTone(confirmedOrder.paymentStatus)} /> : null}
        </div>
        {confirmedOrder ? (
          <div className="identity-receipt">
            <div className="identity-receipt-head">
              <strong className="identity-num">{confirmedOrder.receiptId}</strong>
              <span>{formatDateTime(confirmedOrder.confirmedAt ?? confirmedOrder.createdAt)}</span>
            </div>
            <dl className="identity-rows">
              <DataRow label="Bloques">
                <span className="identity-num">{confirmedOrder.blockCount}</span>
              </DataRow>
              <DataRow label="Unidades">
                <span className="identity-num">{formatUnits(confirmedOrder.blockCount, offer.unitsPerBlock, offer.unitLabel)}</span>
              </DataRow>
              <DataRow label="Monto">
                <span className="identity-num">{formatMinor(confirmedOrder.amountMinor)}</span>
              </DataRow>
              <DataRow label="Estado del pago">{paymentStatusLabel(confirmedOrder.paymentStatus)}</DataRow>
              <DataRow label="Referencia ficticia">
                <span className="identity-num">{confirmedOrder.simulatedTxRef}</span>
              </DataRow>
            </dl>
            <p className="identity-fineprint">Constancia simulada. Sin validez real.</p>
          </div>
        ) : (
          <EmptyState>Aún no tienes una constancia confirmada.</EmptyState>
        )}
      </section>

      <section className="identity-section" aria-labelledby="identity-refund-title">
        <div className="identity-section-head">
          <h2 id="identity-refund-title">Reembolso</h2>
          <StatusChip label="Sin comisión" tone="neutral" />
        </div>
        {offer.escrowStatus === "refund_available" ? (
          refundableOrder ? (
            <div className="identity-refund">
              <p>Puedes reclamar el reembolso simulado de tu reserva confirmada.</p>
              <dl className="identity-rows">
                <DataRow label="Monto">
                  <span className="identity-num">{formatMinor(refundableOrder.amountMinor)}</span>
                </DataRow>
                <DataRow label="Comisión">Sin comisión</DataRow>
              </dl>
              <div className="identity-actions">
                <button type="button" className="identity-button identity-button--primary" onClick={() => onClaimRefund(refundableOrder.id)}>
                  Reclamar reembolso simulado
                </button>
              </div>
              {claimedOrder ? <p className="identity-fineprint">Este reembolso ya fue reclamado.</p> : null}
            </div>
          ) : claimedOrder ? (
            <div className="identity-refund">
              <p>Reembolso simulado reclamado.</p>
              <p className="identity-num">
                {formatMinor(claimedOrder.refundAmountMinor ?? claimedOrder.amountMinor)} · Sin comisión
              </p>
              <p className="identity-fineprint">Este reembolso ya fue reclamado.</p>
            </div>
          ) : (
            <EmptyState>No hay una reserva confirmada para reembolsar.</EmptyState>
          )
        ) : offer.escrowStatus === "refunded" || offer.commercialStatus === "refunded" ? (
          <div className="identity-refund">
            <p>Reembolso simulado reclamado.</p>
            <p className="identity-fineprint">La operación ya fue reembolsada en la demostración. No se movió dinero real.</p>
          </div>
        ) : (
          <p className="identity-fineprint">El reembolso solo se habilita tras un rechazo o una meta no alcanzada.</p>
        )}
      </section>

      <section className="identity-section" aria-labelledby="identity-orders-title">
        <div className="identity-section-head">
          <h2 id="identity-orders-title">Tus reservas</h2>
          <span className="identity-fineprint">La fecha límite es {formatDate(offer.deadline)}.</span>
        </div>
        {orders.length === 0 ? (
          <EmptyState>Todavía no tienes reservas en esta demostración.</EmptyState>
        ) : (
          <ul className="identity-order-list">
            {orders.map((order) => (
              <li className="identity-order" key={order.id}>
                <div className="identity-order-main">
                  <strong className="identity-num">{order.receiptId ?? order.id}</strong>
                  <span>{formatDateTime(order.createdAt)}</span>
                </div>
                <div className="identity-order-meta">
                  <span className="identity-num">{order.blockCount} bloques</span>
                  <span className="identity-num">{formatMinor(order.amountMinor)}</span>
                </div>
                <div className="identity-order-status">
                  <StatusChip label={paymentStatusLabel(order.paymentStatus)} tone={paymentStatusTone(order.paymentStatus)} />
                  {order.refundStatus === "claimed" ? <StatusChip label="Reembolso reclamado" tone="refund" /> : null}
                  {order.failureReason ? <span className="identity-order-reason">{failureReasonLabel(order.failureReason)}</span> : null}
                </div>
                {order.paymentStatus === "failed" && !order.seeded ? (
                  <div className="identity-order-action">
                    <button type="button" className="identity-button identity-button--ghost" onClick={() => onRetry(order.id)}>
                      Reintentar reserva
                    </button>
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
