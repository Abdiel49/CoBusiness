import { createInitialDemoState } from "./fixtures";
import { multiplyMinor } from "./money";
import { getAvailableBlocks, getConfirmedBlocks, getOffer } from "./selectors";
import type { DemoEvent, DemoOrder, DemoRole, DemoState, FailureReason, WalletNetwork } from "./types";

export type FlowErrorCode =
  | "offer_not_found"
  | "order_not_found"
  | "offer_not_collecting"
  | "deadline_passed"
  | "wallet_not_connected"
  | "invalid_wallet_address"
  | "invalid_network"
  | "terms_not_accepted"
  | "terms_mismatch"
  | "invalid_block_count"
  | "insufficient_blocks"
  | "invalid_status"
  | "release_not_authorized"
  | "refund_not_available"
  | "duplicate_refund";

export type FlowResult =
  | { ok: true; state: DemoState }
  | { ok: false; error: { code: FlowErrorCode; message: string } };

export interface ConnectWalletInput {
  address: string;
  network: WalletNetwork;
}

export interface CreateOrderInput {
  offerId: string;
  buyerId: string;
  buyerAlias: string;
  blockCount: number;
  termsAccepted: boolean;
}

function cloneState(state: DemoState): DemoState {
  return JSON.parse(JSON.stringify(state)) as DemoState;
}

function ok(state: DemoState): FlowResult {
  return { ok: true, state };
}

function fail(code: FlowErrorCode, message: string): FlowResult {
  return { ok: false, error: { code, message } };
}

export function nextEventId(state: DemoState): string {
  const ids = new Set(state.events.map((event) => event.id));
  let index = state.events.length + 1;
  while (ids.has(`demo-event-${index}`)) index += 1;
  return `demo-event-${index}`;
}

export function nextReceiptId(state: DemoState): string {
  const highest = state.orders.reduce((current, order) => {
    const match = order.receiptId?.match(/^REC-DEMO-(\d+)$/);
    return match ? Math.max(current, Number(match[1])) : current;
  }, 0);
  return `REC-DEMO-${String(highest + 1).padStart(3, "0")}`;
}

function nextOrderId(state: DemoState): string {
  const ids = new Set(state.orders.map((order) => order.id));
  let index = state.orders.length + 1;
  while (ids.has(`demo-order-${index}`)) index += 1;
  return `demo-order-${index}`;
}

export function appendEvent(
  state: DemoState,
  input: {
    actor: DemoRole | "system";
    action: string;
    description: string;
    occurredAt: string;
    offerId?: string;
    orderId?: string;
  },
): DemoEvent {
  const event: DemoEvent = {
    id: nextEventId(state),
    actor: input.actor,
    action: input.action,
    description: input.description,
    occurredAt: input.occurredAt,
    simulated: true,
    ...(input.offerId === undefined ? {} : { offerId: input.offerId }),
    ...(input.orderId === undefined ? {} : { orderId: input.orderId }),
  };
  state.events.push(event);
  return event;
}

function addHours(iso: string, hours: number): string {
  return new Date(new Date(iso).getTime() + hours * 60 * 60 * 1000).toISOString();
}

function isDeadlinePassed(now: string, deadline: string): boolean {
  return new Date(now).getTime() > new Date(deadline).getTime();
}

function isWalletNetwork(value: string): value is WalletNetwork {
  return value === "TESTNET" || value === "PUBLIC";
}

function failureLabel(reason: FailureReason): string {
  if (reason === "signature_rejected") return "firma rechazada";
  if (reason === "network_error") return "error de red";
  return "operación cancelada";
}

function markOfferRefundedIfComplete(state: DemoState, offerId: string, now: string): void {
  const offer = getOffer(state, offerId);
  if (!offer) return;
  const confirmed = state.orders.filter((order) => order.offerId === offerId && order.paymentStatus === "confirmed");
  if (confirmed.length > 0 && confirmed.every((order) => order.refundStatus === "claimed")) {
    offer.commercialStatus = "refunded";
    offer.escrowStatus = "refunded";
    offer.refundedAt = now;
    offer.updatedAt = now;
  }
}

export function connectWallet(state: DemoState, input: ConnectWalletInput, now: string): FlowResult {
  const address = input.address.trim();
  if (!address) return fail("invalid_wallet_address", "Ingresa una dirección de billetera válida.");
  if (!isWalletNetwork(input.network)) return fail("invalid_network", "La red de la billetera no es válida.");
  const next = cloneState(state);
  next.wallet = { address, network: input.network, connectedAt: now };
  appendEvent(next, {
    actor: "system",
    action: "wallet.connected",
    description: `Billetera conectada en ${input.network}.`,
    occurredAt: now,
  });
  return ok(next);
}

export function disconnectWallet(state: DemoState, now: string): FlowResult {
  const next = cloneState(state);
  next.wallet = { address: null, network: null, connectedAt: null };
  appendEvent(next, {
    actor: "system",
    action: "wallet.disconnected",
    description: "Billetera desconectada.",
    occurredAt: now,
  });
  return ok(next);
}

export function setWalletNetwork(state: DemoState, network: WalletNetwork, now: string): FlowResult {
  if (!state.wallet.address || !state.wallet.network) {
    return fail("wallet_not_connected", "Conecta una billetera antes de cambiar la red.");
  }
  if (!isWalletNetwork(network)) return fail("invalid_network", "La red de la billetera no es válida.");
  const next = cloneState(state);
  next.wallet.network = network;
  appendEvent(next, {
    actor: "system",
    action: "wallet.network_changed",
    description: `Red de la billetera cambiada a ${network}.`,
    occurredAt: now,
  });
  return ok(next);
}

export function createOrder(state: DemoState, input: CreateOrderInput, now: string): FlowResult {
  const offer = getOffer(state, input.offerId);
  if (!offer) return fail("offer_not_found", "La oferta no existe.");
  if (offer.commercialStatus !== "collecting") return fail("offer_not_collecting", "La oferta ya no acepta pedidos.");
  if (isDeadlinePassed(now, offer.deadline)) return fail("deadline_passed", "El plazo de la oferta ya venció.");
  if (!state.wallet.address || !state.wallet.network) {
    return fail("wallet_not_connected", "Conecta una billetera para reservar bloques.");
  }
  if (state.wallet.network !== "TESTNET") {
    return fail("invalid_network", "Solo se permiten billeteras de la red de prueba.");
  }
  if (!input.termsAccepted) return fail("terms_not_accepted", "Debes aceptar los términos de la oferta.");
  if (!Number.isSafeInteger(input.blockCount) || input.blockCount <= 0) {
    return fail("invalid_block_count", "La cantidad de bloques debe ser un entero mayor que cero.");
  }
  const available = getAvailableBlocks(state, offer.id);
  if (input.blockCount > available) {
    return fail("insufficient_blocks", `Solo quedan ${available} bloques disponibles.`);
  }
  const next = cloneState(state);
  const order: DemoOrder = {
    id: nextOrderId(next),
    offerId: offer.id,
    buyerId: input.buyerId,
    buyerAlias: input.buyerAlias,
    blockCount: input.blockCount,
    amountMinor: multiplyMinor(offer.blockPriceMinor, input.blockCount),
    termsVersion: offer.termsVersion,
    termsAcceptedAt: now,
    paymentStatus: "pending",
    receiptId: null,
    createdAt: now,
    confirmedAt: null,
    walletAddress: state.wallet.address,
    network: state.wallet.network,
    signatureStatus: "none",
    failureReason: null,
    attempt: 1,
    refundStatus: "none",
    refundedAt: null,
    refundAmountMinor: null,
    simulatedTxRef: null,
    seeded: false,
  };
  next.orders.push(order);
  appendEvent(next, {
    actor: "buyer",
    action: "order.created",
    description: `${order.buyerAlias} reservó ${order.blockCount} bloques.`,
    occurredAt: now,
    offerId: order.offerId,
    orderId: order.id,
  });
  return ok(next);
}

export function confirmOrder(state: DemoState, orderId: string, now: string): FlowResult {
  const next = cloneState(state);
  const order = next.orders.find((item) => item.id === orderId);
  if (!order) return fail("order_not_found", "El pedido no existe.");
  if (order.paymentStatus !== "pending") {
    return fail("invalid_status", "Solo se pueden confirmar pedidos pendientes.");
  }
  const offer = getOffer(next, order.offerId);
  if (!offer) return fail("offer_not_found", "La oferta no existe.");
  if (order.termsVersion !== offer.termsVersion) {
    return fail("terms_mismatch", "Los términos del pedido ya no coinciden con la oferta.");
  }
  const confirmedBlocks = getConfirmedBlocks(next, offer.id);
  if (confirmedBlocks + order.blockCount > offer.totalBlocks) {
    return fail("insufficient_blocks", "La confirmación supera los bloques disponibles.");
  }
  order.amountMinor = multiplyMinor(offer.blockPriceMinor, order.blockCount);
  order.paymentStatus = "confirmed";
  order.receiptId = nextReceiptId(next);
  order.confirmedAt = now;
  order.signatureStatus = "accepted";
  order.failureReason = null;
  order.simulatedTxRef = `SIM-TX-${order.id}`;
  appendEvent(next, {
    actor: "buyer",
    action: "order.confirmed",
    description: `${order.buyerAlias} confirmó ${order.blockCount} bloques.`,
    occurredAt: now,
    offerId: order.offerId,
    orderId: order.id,
  });
  if (getConfirmedBlocks(next, offer.id) === offer.totalBlocks && offer.commercialStatus === "collecting") {
    offer.commercialStatus = "goal_reached";
    offer.escrowStatus = "funded";
    offer.goalReachedAt = now;
    offer.operatorResponseDeadline = addHours(now, 24);
    offer.updatedAt = now;
    appendEvent(next, {
      actor: "system",
      action: "offer.goal_reached",
      description: "La meta colectiva fue alcanzada.",
      occurredAt: now,
      offerId: offer.id,
    });
  }
  return ok(next);
}

export function failOrder(state: DemoState, orderId: string, reason: FailureReason, now: string): FlowResult {
  const next = cloneState(state);
  const order = next.orders.find((item) => item.id === orderId);
  if (!order) return fail("order_not_found", "El pedido no existe.");
  if (order.paymentStatus !== "pending") {
    return fail("invalid_status", "Solo se pueden fallar pedidos pendientes.");
  }
  order.paymentStatus = "failed";
  order.signatureStatus = reason === "signature_rejected" ? "rejected" : "none";
  order.failureReason = reason;
  order.receiptId = null;
  order.confirmedAt = null;
  order.simulatedTxRef = null;
  appendEvent(next, {
    actor: "buyer",
    action: "order.failed",
    description: `${order.buyerAlias} no pudo confirmar ${order.blockCount} bloques: ${failureLabel(reason)}.`,
    occurredAt: now,
    offerId: order.offerId,
    orderId: order.id,
  });
  return ok(next);
}

export function retryOrder(state: DemoState, orderId: string, now: string): FlowResult {
  const next = cloneState(state);
  const order = next.orders.find((item) => item.id === orderId);
  if (!order) return fail("order_not_found", "El pedido no existe.");
  if (order.paymentStatus !== "failed") {
    return fail("invalid_status", "Solo se pueden reintentar pedidos fallidos.");
  }
  const offer = getOffer(next, order.offerId);
  if (!offer) return fail("offer_not_found", "La oferta no existe.");
  if (offer.commercialStatus !== "collecting") return fail("offer_not_collecting", "La oferta ya no acepta pedidos.");
  if (isDeadlinePassed(now, offer.deadline)) return fail("deadline_passed", "El plazo de la oferta ya venció.");
  if (!state.wallet.address || !state.wallet.network) {
    return fail("wallet_not_connected", "Conecta una billetera para reintentar el pedido.");
  }
  if (state.wallet.network !== "TESTNET") {
    return fail("invalid_network", "Solo se permiten billeteras de la red de prueba.");
  }
  if (order.termsVersion !== offer.termsVersion) {
    return fail("terms_mismatch", "Los términos del pedido ya no coinciden con la oferta.");
  }
  const available = getAvailableBlocks(next, offer.id);
  if (order.blockCount > available) {
    return fail("insufficient_blocks", `Solo quedan ${available} bloques disponibles.`);
  }
  order.paymentStatus = "pending";
  order.attempt += 1;
  order.amountMinor = multiplyMinor(offer.blockPriceMinor, order.blockCount);
  order.walletAddress = state.wallet.address;
  order.network = state.wallet.network;
  order.signatureStatus = "none";
  order.failureReason = null;
  order.receiptId = null;
  order.confirmedAt = null;
  order.simulatedTxRef = null;
  order.refundStatus = "none";
  order.refundedAt = null;
  order.refundAmountMinor = null;
  appendEvent(next, {
    actor: "buyer",
    action: "order.retried",
    description: `${order.buyerAlias} reintentó ${order.blockCount} bloques.`,
    occurredAt: now,
    offerId: order.offerId,
    orderId: order.id,
  });
  return ok(next);
}

export function respondToOffer(state: DemoState, offerId: string, response: "continue" | "decline", now: string): FlowResult {
  const next = cloneState(state);
  const offer = getOffer(next, offerId);
  if (!offer) return fail("offer_not_found", "La oferta no existe.");
  if (offer.commercialStatus !== "goal_reached" || offer.operatorResponse !== "pending") {
    return fail("invalid_status", "El operador solo puede responder después de alcanzar la meta.");
  }
  offer.operatorResponse = response;
  offer.operatorRespondedAt = now;
  offer.updatedAt = now;
  if (response === "continue") {
    offer.commercialStatus = "accepted";
    offer.escrowStatus = "awaiting_authorization";
  } else {
    offer.commercialStatus = "declined";
    offer.escrowStatus = "refund_pending";
    offer.refundReason = "operator_declined";
  }
  appendEvent(next, {
    actor: "operator",
    action: response === "continue" ? "offer.continued" : "offer.declined",
    description: response === "continue" ? "El operador confirmó la operación." : "El operador rechazó la operación.",
    occurredAt: now,
    offerId: offer.id,
  });
  return ok(next);
}

export function authorizeRelease(state: DemoState, offerId: string, now: string): FlowResult {
  const next = cloneState(state);
  const offer = getOffer(next, offerId);
  if (!offer) return fail("offer_not_found", "La oferta no existe.");
  if (
    offer.commercialStatus !== "accepted" ||
    offer.escrowStatus !== "awaiting_authorization" ||
    offer.operatorResponse !== "continue"
  ) {
    return fail("release_not_authorized", "La liberación no está autorizada.");
  }
  offer.escrowStatus = "released";
  offer.commercialStatus = "released";
  offer.authorizationStatus = "authorized";
  offer.authorizedAt = now;
  offer.releasedAt = now;
  offer.updatedAt = now;
  appendEvent(next, {
    actor: "admin",
    action: "escrow.released",
    description: "CoBusiness autorizó la liberación de fondos.",
    occurredAt: now,
    offerId: offer.id,
  });
  return ok(next);
}

export function enableRefund(state: DemoState, offerId: string, now: string): FlowResult {
  const next = cloneState(state);
  const offer = getOffer(next, offerId);
  if (!offer) return fail("offer_not_found", "La oferta no existe.");
  if (
    offer.commercialStatus === "released" ||
    offer.commercialStatus === "refunded" ||
    offer.escrowStatus === "released" ||
    offer.escrowStatus === "refunded"
  ) {
    return fail("invalid_status", "La operación ya fue liberada o devuelta.");
  }
  const eligible = offer.commercialStatus === "declined" || offer.refundReason === "goal_not_reached";
  if (!eligible) return fail("refund_not_available", "La oferta no es elegible para devoluciones.");
  offer.escrowStatus = "refund_available";
  offer.refundEnabled = true;
  offer.authorizationStatus = "refund_enabled";
  offer.refundReason = offer.refundReason ?? "operator_declined";
  offer.updatedAt = now;
  appendEvent(next, {
    actor: "admin",
    action: "refund.enabled",
    description: "CoBusiness habilitó las devoluciones.",
    occurredAt: now,
    offerId: offer.id,
  });
  return ok(next);
}

export function claimRefund(state: DemoState, orderId: string, now: string): FlowResult {
  const next = cloneState(state);
  const order = next.orders.find((item) => item.id === orderId);
  if (!order) return fail("order_not_found", "El pedido no existe.");
  const offer = getOffer(next, order.offerId);
  if (!offer) return fail("offer_not_found", "La oferta no existe.");
  if (offer.escrowStatus !== "refund_available" || !offer.refundEnabled) {
    return fail("refund_not_available", "Las devoluciones no están disponibles.");
  }
  if (order.paymentStatus !== "confirmed") {
    return fail("invalid_status", "Solo los pedidos confirmados pueden reclamar una devolución.");
  }
  if (order.refundStatus !== "none") {
    return fail("duplicate_refund", "La devolución de este pedido ya fue reclamada.");
  }
  order.refundStatus = "claimed";
  order.refundedAt = now;
  order.refundAmountMinor = order.amountMinor;
  appendEvent(next, {
    actor: "buyer",
    action: "refund.claimed",
    description: `${order.buyerAlias} reclamó la devolución de ${order.blockCount} bloques.`,
    occurredAt: now,
    offerId: order.offerId,
    orderId: order.id,
  });
  markOfferRefundedIfComplete(next, offer.id, now);
  return ok(next);
}

export function settleSeedRefunds(state: DemoState, offerId: string, now: string): FlowResult {
  const next = cloneState(state);
  const offer = getOffer(next, offerId);
  if (!offer) return fail("offer_not_found", "La oferta no existe.");
  if (offer.escrowStatus !== "refund_available") {
    return fail("refund_not_available", "Las devoluciones no están disponibles.");
  }
  const seededOrders = next.orders.filter(
    (order) =>
      order.offerId === offerId &&
      order.seeded &&
      order.paymentStatus === "confirmed" &&
      order.refundStatus === "none",
  );
  for (const order of seededOrders) {
    order.refundStatus = "claimed";
    order.refundedAt = now;
    order.refundAmountMinor = order.amountMinor;
  }
  appendEvent(next, {
    actor: "admin",
    action: "refund.seed_settled",
    description: "CoBusiness liquidó las devoluciones de los pedidos de demostración.",
    occurredAt: now,
    offerId: offer.id,
  });
  markOfferRefundedIfComplete(next, offer.id, now);
  return ok(next);
}

export function resetState(now: string): FlowResult {
  const state = createInitialDemoState(now);
  appendEvent(state, {
    actor: "system",
    action: "demo.reset",
    description: "Datos de demostración reiniciados.",
    occurredAt: now,
  });
  return ok(state);
}
