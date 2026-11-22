import type {
  CommercialStatus,
  DemoRole,
  EscrowStatus,
  FailureReason,
  PaymentStatus,
} from "@/domain/demo/types";

export type StatusTone = "neutral" | "info" | "success" | "refund" | "warning";

const dateFormatter = new Intl.DateTimeFormat("es-BO", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat("es-BO", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDate(value: string): string {
  return dateFormatter.format(new Date(value));
}

export function formatDateTime(value: string): string {
  return dateTimeFormatter.format(new Date(value));
}

export function formatUnits(blockCount: number, unitsPerBlock: number, unitLabel: string): string {
  return `${blockCount * unitsPerBlock} ${unitLabel}`;
}

export function truncateAddress(address: string): string {
  if (address.length <= 14) return address;
  return `${address.slice(0, 6)}…${address.slice(-4)}`;
}

export function commercialStatusLabel(status: CommercialStatus): string {
  switch (status) {
    case "collecting":
      return "En recolección";
    case "goal_reached":
      return "Meta alcanzada";
    case "accepted":
      return "Operador continúa";
    case "declined":
      return "Operador rechazó";
    case "released":
      return "Liberada";
    case "refunded":
      return "Reembolsada";
  }
}

export function commercialStatusTone(status: CommercialStatus): StatusTone {
  switch (status) {
    case "released":
      return "success";
    case "refunded":
      return "refund";
    case "declined":
      return "warning";
    case "goal_reached":
    case "accepted":
      return "info";
    case "collecting":
      return "neutral";
  }
}

export function escrowStatusLabel(status: EscrowStatus): string {
  switch (status) {
    case "funding":
      return "Fondos en recolección";
    case "funded":
      return "Fondos reunidos (simulados)";
    case "awaiting_authorization":
      return "Esperando autorización";
    case "refund_pending":
      return "Devolución pendiente";
    case "refund_available":
      return "Devoluciones disponibles";
    case "released":
      return "Liberado (simulado)";
    case "refunded":
      return "Reembolsado (simulado)";
  }
}

export function escrowStatusTone(status: EscrowStatus): StatusTone {
  switch (status) {
    case "released":
      return "success";
    case "refund_pending":
    case "refund_available":
    case "refunded":
      return "refund";
    case "awaiting_authorization":
      return "info";
    case "funding":
    case "funded":
      return "neutral";
  }
}

export function paymentStatusLabel(status: PaymentStatus): string {
  switch (status) {
    case "pending":
      return "Pendiente (sin fondos)";
    case "confirmed":
      return "Confirmado (simulado)";
    case "failed":
      return "Fallido (sin cargo)";
  }
}

export function paymentStatusTone(status: PaymentStatus): StatusTone {
  switch (status) {
    case "pending":
      return "neutral";
    case "confirmed":
      return "info";
    case "failed":
      return "warning";
  }
}

export function failureReasonLabel(reason: FailureReason | null): string {
  switch (reason) {
    case "signature_rejected":
      return "Firma rechazada";
    case "network_error":
      return "Error de red";
    case "cancelled":
      return "Reserva cancelada";
    case null:
      return "";
  }
}

export function actorLabel(actor: DemoRole | "system"): string {
  switch (actor) {
    case "buyer":
      return "Comprador";
    case "operator":
      return "Operador";
    case "admin":
      return "CoBusiness";
    case "system":
      return "Sistema";
  }
}
