import { createInitialDemoState } from "./fixtures";
import type { DemoEvent, DemoOffer, DemoOrder, DemoRepository, DemoState, DemoWallet } from "./types";

export const DEMO_STORAGE_KEY = "cobusiness.demo.v2";
export const DEMO_STORAGE_VERSION = 2;
const LEGACY_STORAGE_KEY = "cobusiness.demo.v1";
const LEGACY_STORAGE_VERSION = 1;

const ROLES = ["buyer", "operator", "admin"] as const;
const COMMERCIAL_STATUSES = ["collecting", "goal_reached", "accepted", "declined", "released", "refunded"] as const;
const ESCROW_STATUSES = ["funding", "funded", "awaiting_authorization", "refund_pending", "refund_available", "released", "refunded"] as const;
const OPERATOR_RESPONSES = ["pending", "continue", "decline"] as const;
const AUTHORIZATION_STATUSES = ["pending", "authorized", "refund_enabled"] as const;
const PAYMENT_STATUSES = ["pending", "confirmed", "failed"] as const;
const REFUND_STATUSES = ["none", "claimed"] as const;
const WALLET_NETWORKS = ["TESTNET", "PUBLIC"] as const;
const SIGNATURE_STATUSES = ["none", "accepted", "rejected"] as const;
const FAILURE_REASONS = ["signature_rejected", "network_error", "cancelled"] as const;
const LEGACY_COMMERCIAL_STATUSES = ["collecting", "awaiting_operator", "accepted", "declined"] as const;

export class DemoStorageError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "DemoStorageError";
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function isOneOf<T extends string>(value: unknown, values: readonly T[]): value is T {
  return typeof value === "string" && (values as readonly string[]).includes(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function isDateString(value: unknown): value is string {
  return isNonEmptyString(value) && !Number.isNaN(Date.parse(value));
}

function isNullableDate(value: unknown): value is string | null {
  return value === null || isDateString(value);
}

function isNullableString(value: unknown): value is string | null {
  return value === null || isNonEmptyString(value);
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value > 0;
}

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) && value >= 0;
}

function isMinorAmount(value: unknown): value is string {
  return typeof value === "string" && /^\d+$/.test(value);
}

function isPositiveMinorAmount(value: unknown): value is string {
  return isMinorAmount(value) && BigInt(value) > BigInt(0);
}

function isDemoOffer(value: unknown): value is DemoOffer {
  if (!isRecord(value)) return false;
  return (
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.title) &&
    isNonEmptyString(value.productDescription) &&
    isNonEmptyString(value.unitLabel) &&
    isNonEmptyString(value.operatorName) &&
    isPositiveInteger(value.unitsPerBlock) &&
    isPositiveInteger(value.totalBlocks) &&
    isPositiveMinorAmount(value.blockPriceMinor) &&
    isPositiveInteger(value.termsVersion) &&
    isNonEmptyString(value.termsSummary) &&
    isDateString(value.deadline) &&
    isOneOf(value.commercialStatus, COMMERCIAL_STATUSES) &&
    isOneOf(value.escrowStatus, ESCROW_STATUSES) &&
    isNullableDate(value.goalReachedAt) &&
    isOneOf(value.operatorResponse, OPERATOR_RESPONSES) &&
    isNullableDate(value.operatorRespondedAt) &&
    isNullableDate(value.operatorResponseDeadline) &&
    isOneOf(value.authorizationStatus, AUTHORIZATION_STATUSES) &&
    isNullableDate(value.authorizedAt) &&
    (value.refundReason === null || value.refundReason === "operator_declined" || value.refundReason === "goal_not_reached") &&
    typeof value.refundEnabled === "boolean" &&
    isNonNegativeInteger(value.commissionRateBps) &&
    isNullableDate(value.releasedAt) &&
    isNullableDate(value.refundedAt) &&
    isDateString(value.updatedAt)
  );
}

function isDemoOrder(value: unknown): value is DemoOrder {
  if (!isRecord(value)) return false;
  const valid =
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.offerId) &&
    isNonEmptyString(value.buyerId) &&
    isNonEmptyString(value.buyerAlias) &&
    isPositiveInteger(value.blockCount) &&
    isPositiveMinorAmount(value.amountMinor) &&
    isPositiveInteger(value.termsVersion) &&
    isDateString(value.termsAcceptedAt) &&
    isOneOf(value.paymentStatus, PAYMENT_STATUSES) &&
    isNullableString(value.receiptId) &&
    isDateString(value.createdAt) &&
    isNullableDate(value.confirmedAt) &&
    isNonEmptyString(value.walletAddress) &&
    isOneOf(value.network, WALLET_NETWORKS) &&
    isOneOf(value.signatureStatus, SIGNATURE_STATUSES) &&
    (value.failureReason === null || isOneOf(value.failureReason, FAILURE_REASONS)) &&
    isPositiveInteger(value.attempt) &&
    isOneOf(value.refundStatus, REFUND_STATUSES) &&
    isNullableDate(value.refundedAt) &&
    (value.refundAmountMinor === null || isPositiveMinorAmount(value.refundAmountMinor)) &&
    isNullableString(value.simulatedTxRef) &&
    typeof value.seeded === "boolean";
  if (!valid) return false;
  if (value.paymentStatus === "confirmed" && (!isNonEmptyString(value.receiptId) || value.confirmedAt === null)) return false;
  if (value.refundStatus === "claimed" && (value.refundedAt === null || !isPositiveMinorAmount(value.refundAmountMinor))) return false;
  if (value.refundStatus === "none" && (value.refundedAt !== null || value.refundAmountMinor !== null)) return false;
  return true;
}

function isDemoEvent(value: unknown): value is DemoEvent {
  if (!isRecord(value)) return false;
  return (
    isNonEmptyString(value.id) &&
    (value.actor === "system" || isOneOf(value.actor, ROLES)) &&
    isNonEmptyString(value.action) &&
    isNonEmptyString(value.description) &&
    isDateString(value.occurredAt) &&
    value.simulated === true &&
    (value.offerId === undefined || isNonEmptyString(value.offerId)) &&
    (value.orderId === undefined || isNonEmptyString(value.orderId))
  );
}

function isDemoWallet(value: unknown): value is DemoWallet {
  if (!isRecord(value)) return false;
  if (value.address === null) return value.network === null && value.connectedAt === null;
  return isNonEmptyString(value.address) && isOneOf(value.network, WALLET_NETWORKS) && isDateString(value.connectedAt);
}

function isDemoState(value: unknown): value is DemoState {
  if (!isRecord(value)) return false;
  return (
    Array.isArray(value.offers) &&
    value.offers.every(isDemoOffer) &&
    Array.isArray(value.orders) &&
    value.orders.every(isDemoOrder) &&
    Array.isArray(value.events) &&
    value.events.every(isDemoEvent) &&
    isDemoWallet(value.wallet)
  );
}

interface LegacyOffer {
  id: string;
  title: string;
  operatorName: string;
  unitsPerBlock: number;
  totalBlocks: number;
  blockPriceMinor: string;
  termsVersion: number;
  deadline: string;
  commercialStatus: (typeof LEGACY_COMMERCIAL_STATUSES)[number];
}

interface LegacyOrder {
  id: string;
  offerId: string;
  buyerId: string;
  blockCount: number;
  amountMinor: string;
  paymentStatus: (typeof PAYMENT_STATUSES)[number];
}

interface LegacyEvent {
  id: string;
  description: string;
  occurredAt: string;
}

function isLegacyOffer(value: unknown): value is LegacyOffer {
  if (!isRecord(value)) return false;
  return (
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.title) &&
    isNonEmptyString(value.operatorName) &&
    isPositiveInteger(value.unitsPerBlock) &&
    isPositiveInteger(value.totalBlocks) &&
    isPositiveMinorAmount(value.blockPriceMinor) &&
    isPositiveInteger(value.termsVersion) &&
    isDateString(value.deadline) &&
    isOneOf(value.commercialStatus, LEGACY_COMMERCIAL_STATUSES)
  );
}

function isLegacyOrder(value: unknown): value is LegacyOrder {
  if (!isRecord(value)) return false;
  return (
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.offerId) &&
    isNonEmptyString(value.buyerId) &&
    isPositiveInteger(value.blockCount) &&
    isPositiveMinorAmount(value.amountMinor) &&
    isOneOf(value.paymentStatus, PAYMENT_STATUSES)
  );
}

function isLegacyEvent(value: unknown): value is LegacyEvent {
  if (!isRecord(value)) return false;
  return isNonEmptyString(value.id) && isNonEmptyString(value.description) && isDateString(value.occurredAt);
}

function mapLegacyCommercialStatus(status: LegacyOffer["commercialStatus"]): Pick<
  DemoOffer,
  "commercialStatus" | "escrowStatus" | "operatorResponse" | "refundReason"
> {
  switch (status) {
    case "collecting":
      return { commercialStatus: "collecting", escrowStatus: "funding", operatorResponse: "pending", refundReason: null };
    case "awaiting_operator":
      return { commercialStatus: "goal_reached", escrowStatus: "funded", operatorResponse: "pending", refundReason: null };
    case "accepted":
      return { commercialStatus: "accepted", escrowStatus: "awaiting_authorization", operatorResponse: "continue", refundReason: null };
    case "declined":
      return { commercialStatus: "declined", escrowStatus: "refund_pending", operatorResponse: "decline", refundReason: "operator_declined" };
  }
}

function migrateLegacy(envelope: unknown): DemoState {
  if (!isRecord(envelope) || envelope.version !== LEGACY_STORAGE_VERSION) {
    throw new Error("Unsupported legacy demo version.");
  }
  const data = envelope.data;
  if (!isRecord(data)) throw new Error("Invalid legacy demo data.");
  const legacyOffers = data.offers;
  const legacyOrders = data.orders;
  const legacyEvents = data.events;
  if (!Array.isArray(legacyOffers)) throw new Error("Invalid legacy demo offers.");
  if (!legacyOffers.every(isLegacyOffer)) throw new Error("Invalid legacy demo offers.");
  if (!Array.isArray(legacyOrders)) throw new Error("Invalid legacy demo orders.");
  if (!legacyOrders.every(isLegacyOrder)) throw new Error("Invalid legacy demo orders.");
  if (!Array.isArray(legacyEvents)) throw new Error("Invalid legacy demo events.");
  if (!legacyEvents.every(isLegacyEvent)) throw new Error("Invalid legacy demo events.");
  const migratedAt = legacyEvents.length > 0 ? legacyEvents[legacyEvents.length - 1].occurredAt : new Date().toISOString();
  const offerById = new Map(legacyOffers.map((offer) => [offer.id, offer]));
  const offers: DemoOffer[] = legacyOffers.map((offer) => {
    const mapped = mapLegacyCommercialStatus(offer.commercialStatus);
    return {
      id: offer.id,
      title: offer.title,
      productDescription: offer.title,
      unitLabel: "unidades",
      operatorName: offer.operatorName,
      unitsPerBlock: offer.unitsPerBlock,
      totalBlocks: offer.totalBlocks,
      blockPriceMinor: offer.blockPriceMinor,
      termsVersion: offer.termsVersion,
      termsSummary: "Condiciones migradas de la demostración anterior.",
      deadline: offer.deadline,
      ...mapped,
      goalReachedAt: offer.commercialStatus === "collecting" ? null : migratedAt,
      operatorRespondedAt: mapped.operatorResponse === "pending" ? null : migratedAt,
      operatorResponseDeadline: null,
      authorizationStatus: "pending",
      authorizedAt: null,
      refundEnabled: false,
      commissionRateBps: 0,
      releasedAt: null,
      refundedAt: null,
      updatedAt: migratedAt,
    };
  });
  const orders: DemoOrder[] = legacyOrders.map((order, index) => {
    const legacyOffer = offerById.get(order.offerId);
    const confirmed = order.paymentStatus === "confirmed";
    return {
      id: order.id,
      offerId: order.offerId,
      buyerId: order.buyerId,
      buyerAlias: order.buyerId,
      blockCount: order.blockCount,
      amountMinor: order.amountMinor,
      termsVersion: legacyOffer?.termsVersion ?? 1,
      termsAcceptedAt: migratedAt,
      paymentStatus: order.paymentStatus,
      receiptId: confirmed ? `REC-DEMO-${String(index + 1).padStart(3, "0")}` : null,
      createdAt: migratedAt,
      confirmedAt: confirmed ? migratedAt : null,
      walletAddress: "GDEMO0000000000000000000000000000000000000000000000000000",
      network: "TESTNET",
      signatureStatus: confirmed ? "accepted" : "none",
      failureReason: null,
      attempt: 1,
      refundStatus: "none",
      refundedAt: null,
      refundAmountMinor: null,
      simulatedTxRef: confirmed ? `SIM-TX-${order.id}` : null,
      seeded: false,
    };
  });
  const events: DemoEvent[] = legacyEvents.map((event) => ({
    id: event.id,
    actor: "system",
    action: "legacy.event",
    description: event.description,
    occurredAt: event.occurredAt,
    simulated: true,
  }));
  const state: DemoState = {
    offers,
    orders,
    events,
    wallet: { address: null, network: null, connectedAt: null },
  };
  if (!isDemoState(state)) throw new Error("Migrated demo data is invalid.");
  return state;
}

function readStorage(storage: Storage, key: string): string | null {
  try {
    return storage.getItem(key);
  } catch (cause) {
    throw new DemoStorageError("No se pudieron leer los datos de la demo.", { cause });
  }
}

function parseJson(raw: string, message: string): unknown {
  try {
    return JSON.parse(raw);
  } catch (cause) {
    throw new DemoStorageError(message, { cause });
  }
}

export function createLocalDemoRepository(storage: Storage): DemoRepository {
  function write(state: DemoState): void {
    if (!isDemoState(state)) {
      throw new DemoStorageError("No se pueden guardar datos de demostración inválidos.");
    }
    try {
      storage.setItem(DEMO_STORAGE_KEY, JSON.stringify({ version: DEMO_STORAGE_VERSION, data: state }));
    } catch (cause) {
      throw new DemoStorageError("No se pudieron guardar los datos de la demo.", { cause });
    }
  }

  return {
    read() {
      const raw = readStorage(storage, DEMO_STORAGE_KEY);
      if (raw !== null) {
        const envelope = parseJson(raw, "Los datos de la demo no son JSON válido.");
        if (!isRecord(envelope)) {
          throw new DemoStorageError("Los datos de la demo son inválidos o tienen una versión no compatible.");
        }
        if (envelope.version !== DEMO_STORAGE_VERSION) {
          throw new DemoStorageError("Los datos de la demo son inválidos o tienen una versión no compatible.");
        }
        if (!isDemoState(envelope.data)) {
          throw new DemoStorageError("Los datos de la demo son inválidos o tienen una versión no compatible.");
        }
        return envelope.data;
      }
      const legacyRaw = readStorage(storage, LEGACY_STORAGE_KEY);
      if (legacyRaw === null) return createInitialDemoState();
      const legacyEnvelope = parseJson(legacyRaw, "Los datos anteriores de la demo no son JSON válido.");
      let migrated: DemoState;
      try {
        migrated = migrateLegacy(legacyEnvelope);
      } catch (cause) {
        throw new DemoStorageError("No se pudieron migrar los datos anteriores de la demostración.", { cause });
      }
      write(migrated);
      return migrated;
    },
    write,
    reset() {
      const state = createInitialDemoState();
      write(state);
      return state;
    },
  };
}
