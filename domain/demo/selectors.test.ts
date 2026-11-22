import { describe, expect, it } from "vitest";
import { createInitialDemoState } from "./fixtures";
import { confirmOrder, connectWallet, createOrder } from "./flow";
import {
  getAvailableBlocks,
  getBuyerOrders,
  getCommission,
  getConfirmedBlocks,
  getOffer,
  getOfferProgress,
  getPendingBlocks,
  getRefundSummary,
} from "./selectors";
import type { DemoState } from "./types";

const NOW = "2026-02-01T12:00:00.000Z";

function connectedState(): DemoState {
  const result = connectWallet(createInitialDemoState(), { address: "GDEMO-TEST", network: "TESTNET" }, NOW);
  if (!result.ok) throw new Error(result.error.message);
  return result.state;
}

function pendingState(state: DemoState, blockCount = 4): DemoState {
  const result = createOrder(
    state,
    {
      offerId: "demo-offer-1",
      buyerId: "buyer-test",
      buyerAlias: "Comprador Prueba",
      blockCount,
      termsAccepted: true,
    },
    NOW,
  );
  if (!result.ok) throw new Error(result.error.message);
  return result.state;
}

describe("demo selectors", () => {
  it("finds offers and buyer orders", () => {
    const state = createInitialDemoState();
    expect(getOffer(state, "demo-offer-1")?.title).toBe("Café verde en grano");
    expect(getOffer(state, "missing")).toBeUndefined();
    expect(getBuyerOrders(state, "seed-buyer-2").map((order) => order.id)).toEqual(["seed-order-2"]);
  });

  it("excludes pending orders from confirmed progress", () => {
    const state = pendingState(connectedState());
    expect(getConfirmedBlocks(state, "demo-offer-1")).toBe(96);
    expect(getPendingBlocks(state, "demo-offer-1")).toBe(4);
    expect(getOfferProgress(state, "demo-offer-1")).toEqual({
      confirmedBlocks: 96,
      pendingBlocks: 4,
      availableBlocks: 0,
      totalBlocks: 100,
      percent: 96,
      isGoalReached: false,
    });
  });

  it("subtracts pending reservations from availability", () => {
    const state = connectedState();
    expect(getAvailableBlocks(state, "demo-offer-1")).toBe(4);
    expect(getAvailableBlocks(pendingState(state), "demo-offer-1")).toBe(0);
  });

  it("calculates commission from confirmed orders only", () => {
    const state = pendingState(connectedState());
    expect(getCommission(state, "demo-offer-1")).toEqual({
      rateBps: 500,
      grossMinor: "1200000000",
      commissionMinor: "60000000",
      netMinor: "1140000000",
    });
    const orderId = state.orders.find((order) => order.buyerId === "buyer-test")?.id;
    if (!orderId) throw new Error("Missing pending order.");
    const confirmed = confirmOrder(state, orderId, NOW);
    if (!confirmed.ok) throw new Error(confirmed.error.message);
    expect(getCommission(confirmed.state, "demo-offer-1")).toEqual({
      rateBps: 500,
      grossMinor: "1250000000",
      commissionMinor: "62500000",
      netMinor: "1187500000",
    });
  });

  it("summarizes refund eligibility and claims", () => {
    const state = createInitialDemoState();
    expect(getRefundSummary(state, "demo-offer-1")).toEqual({
      eligibleOrders: 3,
      totalRefundMinor: "1200000000",
      claimedOrders: 0,
      claimedAmountMinor: "0",
    });
  });
});
