import { multiplyMinor } from "./money";
import type { DemoEvent, DemoOffer, DemoOrder, DemoState } from "./types";

export const DEMO_SEED_TIMESTAMP = "2026-01-15T12:00:00.000Z";

const BLOCK_PRICE_MINOR = "12500000";
const SEED_TERMS_ACCEPTED_AT = "2026-01-15T12:01:00.000Z";
const SEED_CONFIRMED_AT = "2026-01-15T12:05:00.000Z";

const seedBuyers = [
  { buyerId: "seed-buyer-1", buyerAlias: "Comprador Andino", blockCount: 40, walletAddress: "GDEMO0000000000000000000000000000000000000000000000000001" },
  { buyerId: "seed-buyer-2", buyerAlias: "Distribuidora Sur", blockCount: 32, walletAddress: "GDEMO0000000000000000000000000000000000000000000000000002" },
  { buyerId: "seed-buyer-3", buyerAlias: "Mercado Central", blockCount: 24, walletAddress: "GDEMO0000000000000000000000000000000000000000000000000003" },
];

function createSeedOrders(): DemoOrder[] {
  return seedBuyers.map((seed, index) => ({
    id: `seed-order-${index + 1}`,
    offerId: "demo-offer-1",
    buyerId: seed.buyerId,
    buyerAlias: seed.buyerAlias,
    blockCount: seed.blockCount,
    amountMinor: multiplyMinor(BLOCK_PRICE_MINOR, seed.blockCount),
    termsVersion: 1,
    termsAcceptedAt: SEED_TERMS_ACCEPTED_AT,
    paymentStatus: "confirmed",
    receiptId: `REC-DEMO-${String(index + 1).padStart(3, "0")}`,
    createdAt: SEED_TERMS_ACCEPTED_AT,
    confirmedAt: SEED_CONFIRMED_AT,
    walletAddress: seed.walletAddress,
    network: "TESTNET",
    signatureStatus: "accepted",
    failureReason: null,
    attempt: 1,
    refundStatus: "none",
    refundedAt: null,
    refundAmountMinor: null,
    simulatedTxRef: `SIM-TX-SEED-${index + 1}`,
    seeded: true,
  }));
}

function createSeedEvents(now: string, orders: DemoOrder[]): DemoEvent[] {
  const loadEvent: DemoEvent = {
    id: "demo-event-1",
    actor: "system",
    action: "demo.loaded",
    description: "Datos de demostración cargados.",
    occurredAt: now,
    simulated: true,
  };
  const orderEvents: DemoEvent[] = orders.map((order, index) => ({
    id: `demo-event-${index + 2}`,
    actor: "buyer",
    action: "order.confirmed",
    description: `${order.buyerAlias} confirmó ${order.blockCount} bloques.`,
    occurredAt: order.confirmedAt ?? now,
    simulated: true,
    offerId: order.offerId,
    orderId: order.id,
  }));
  return [loadEvent, ...orderEvents];
}

export function createInitialDemoState(now: string = DEMO_SEED_TIMESTAMP): DemoState {
  const offer: DemoOffer = {
    id: "demo-offer-1",
    title: "Café verde en grano",
    productDescription: "Lote colectivo de café verde para distribución minorista.",
    unitLabel: "sacos",
    operatorName: "Andes Import Demo",
    unitsPerBlock: 10,
    totalBlocks: 100,
    blockPriceMinor: BLOCK_PRICE_MINOR,
    termsVersion: 1,
    termsSummary: "Precio por bloque, plazo de acopio y entrega coordinada por el operador.",
    deadline: "2030-01-01T00:00:00.000Z",
    commercialStatus: "collecting",
    escrowStatus: "funding",
    goalReachedAt: null,
    operatorResponse: "pending",
    operatorRespondedAt: null,
    operatorResponseDeadline: null,
    authorizationStatus: "pending",
    authorizedAt: null,
    refundReason: null,
    refundEnabled: false,
    commissionRateBps: 500,
    releasedAt: null,
    refundedAt: null,
    updatedAt: now,
  };
  const orders = createSeedOrders();
  return {
    offers: [offer],
    orders,
    events: createSeedEvents(now, orders),
    wallet: { address: null, network: null, connectedAt: null },
  };
}
