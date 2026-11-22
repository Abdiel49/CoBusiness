"use client";

import type { ReactNode } from "react";
import { formatMinor } from "@/domain/demo/money";
import type { DemoOffer, DemoOrder } from "@/domain/demo/types";
import { Modal, OrderSummary } from "./components";

export function SignatureDialog({
  order,
  offer,
  error,
  onApprove,
  onReject,
  onNetworkError,
  onClose,
}: {
  order: DemoOrder;
  offer: DemoOffer;
  error: string | null;
  onApprove: () => void;
  onReject: () => void;
  onNetworkError: () => void;
  onClose: () => void;
}) {
  return (
    <Modal
      title="Firma simulada"
      description="Revisa tu reserva antes de decidir. Esta firma es simulada: no se solicita una firma real ni se realiza un cargo."
      onClose={onClose}
    >
      <OrderSummary order={order} offer={offer} />
      {error ? (
        <p className="identity-alert identity-dialog-alert" role="alert">
          {error}
        </p>
      ) : null}
      <div className="identity-dialog-actions">
        <button type="button" className="identity-button identity-button--primary" onClick={onApprove} data-autofocus>
          Aprobar firma
        </button>
        <button type="button" className="identity-button identity-button--secondary" onClick={onReject}>
          Rechazar firma
        </button>
        <button type="button" className="identity-button identity-button--ghost" onClick={onNetworkError}>
          Simular error de red
        </button>
      </div>
      <p className="identity-fineprint">
        Si cierras este diálogo sin decidir, la reserva queda pendiente y puedes reanudar la firma.
      </p>
    </Modal>
  );
}

export function ConfirmDialog({
  title,
  description,
  confirmLabel,
  onConfirm,
  onClose,
  error,
  children,
}: {
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  onClose: () => void;
  error: string | null;
  children?: ReactNode;
}) {
  return (
    <Modal title={title} description={description} onClose={onClose}>
      {children}
      {error ? (
        <p className="identity-alert identity-dialog-alert" role="alert">
          {error}
        </p>
      ) : null}
      <div className="identity-dialog-actions">
        <button type="button" className="identity-button identity-button--secondary" onClick={onClose} data-autofocus>
          Cancelar
        </button>
        <button type="button" className="identity-button identity-button--primary" onClick={onConfirm}>
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
}

export function RefundAmountSummary({ amountMinor }: { amountMinor: string }) {
  return (
    <dl className="identity-rows identity-dialog-rows">
      <div className="identity-row">
        <dt>Monto</dt>
        <dd className="identity-num">{formatMinor(amountMinor)}</dd>
      </div>
      <div className="identity-row">
        <dt>Comisión</dt>
        <dd>Sin comisión</dd>
      </div>
    </dl>
  );
}
