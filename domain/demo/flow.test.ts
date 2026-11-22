import { describe, expect, it } from "vitest";
import { createInitialDemoState } from "./fixtures";
import {
  authorizeRelease,
  claimRefund,
  confirmOrder,
  connectWallet,
  createOrder,
  enableRefund,
  failOrder,
  resetState,
  respondToOffer,
  retryOrder,
  settleSeedRefunds,
} from "./flow";
import { getOffer, getOfferProgress } from "./selectors";
import type { DemoOrder, DemoState, WalletNetwork } from "./types";

const NOW = "2026-02-01T12:00:00.000Z";
const LATER = "2026-02-01T13:00:00.000Z";

function connect(network: WalletNetwork = "TESTNET", state: DemoState = createInitialDemoState()): DemoState {
  const result = connectWallet(state, { address: "GDEMO-TEST", network }, NOW);
  if (!result.ok) throw new Error(result.error.message);
  return result.state;
}

function reserve(state: DemoState, blockCount = 4): DemoState {
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

function lastOrder(state: DemoState): DemoOrder {
  const order = state.orders[state.orders.length - 1];
  if (!order) throw new Error("Missing order.");
  return order;
}

function goalReachedState(): DemoState {
  const state = reserve(connect());
  const result = confirmOrder(state, lastOrder(state).id, NOW);
  if (!result.ok) throw new Error(result.error.message);
  return result.state;
}

function refundEnabledState(): DemoState {
  const declined = respondToOffer(goalReachedState(), "demo-offer-1", "decline", NOW);
  if (!declined.ok) throw new Error(declined.error.message);
  const enabled = enableRefund(declined.state, "demo-offer-1", NOW);
  if (!enabled.ok) throw new Error(enabled.error.message);
  return enabled.state;
}

describe("demo flow", () => {
  it("creates a pending order without counting it toward the goal", () => {
    const state = reserve(connect());
    const order = lastOrder(state);
    expect(order).toMatchObject({
      paymentStatus: "pending",
      blockCount: 4,
      amountMinor: "50000000",
      walletAddress: "GDEMO-TEST",
      network: "TESTNET",
      signatureStatus: "none",
      failureReason: null,
      attempt: 1,
      refundStatus: "none",
      receiptId: null,
      confirmedAt: null,
      termsVersion: 1,
      seeded: false,
    });
    expect(state.orders).toHaveLength(4);
    expect(getOfferProgress(state, "demo-offer-1").confirmedBlocks).toBe(96);
    expect(getOfferProgress(state, "demo-offer-1").isGoalReached).toBe(false);
    expect(getOffer(state, "demo-offer-1")?.commercialStatus).toBe("collecting");
  });

  it("confirms an order and reaches the collective goal exactly at 100 blocks", () => {
    const state = goalReachedState();
    const order = lastOrder(state);
    expect(order).toMatchObject({
      paymentStatus: "confirmed",
      receiptId: "REC-DEMO-004",
      signatureStatus: "accepted",
      simulatedTxRef: `SIM-TX-${order.id}`,
      confirmedAt: NOW,
    });
    expect(getOfferProgress(state, "demo-offer-1")).toEqual({
      confirmedBlocks: 100,
      pendingBlocks: 0,
      availableBlocks: 0,
      totalBlocks: 100,
      percent: 100,
      isGoalReached: true,
    });
    expect(getOffer(state, "demo-offer-1")).toMatchObject({
      commercialStatus: "goal_reached",
      escrowStatus: "funded",
      goalReachedAt: NOW,
      operatorResponse: "pending",
      operatorResponseDeadline: "2026-02-02T12:00:00.000Z",
    });
  });

  it("does not let the operator respond before the goal is reached", () => {
    const result = respondToOffer(createInitialDemoState(), "demo-offer-1", "continue", NOW);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("invalid_status");
  });

  it("releases funds only after the operator continues and CoBusiness authorizes", () => {
    const continued = respondToOffer(goalReachedState(), "demo-offer-1", "continue", NOW);
    if (!continued.ok) throw new Error(continued.error.message);
    expect(getOffer(continued.state, "demo-offer-1")).toMatchObject({
      commercialStatus: "accepted",
      escrowStatus: "awaiting_authorization",
      operatorResponse: "continue",
      operatorRespondedAt: NOW,
    });
    const released = authorizeRelease(continued.state, "demo-offer-1", LATER);
    if (!released.ok) throw new Error(released.error.message);
    expect(getOffer(released.state, "demo-offer-1")).toMatchObject({
      commercialStatus: "released",
      escrowStatus: "released",
      authorizationStatus: "authorized",
      authorizedAt: LATER,
      releasedAt: LATER,
    });
  });

  it("blocks release without an operator continue response", () => {
    const result = authorizeRelease(goalReachedState(), "demo-offer-1", NOW);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("release_not_authorized");
  });

  it("enables refunds after an operator decline", () => {
    const declined = respondToOffer(goalReachedState(), "demo-offer-1", "decline", NOW);
    if (!declined.ok) throw new Error(declined.error.message);
    expect(getOffer(declined.state, "demo-offer-1")).toMatchObject({
      commercialStatus: "declined",
      escrowStatus: "refund_pending",
      operatorResponse: "decline",
      refundReason: "operator_declined",
    });
    const enabled = enableRefund(declined.state, "demo-offer-1", NOW);
    if (!enabled.ok) throw new Error(enabled.error.message);
    expect(getOffer(enabled.state, "demo-offer-1")).toMatchObject({
      escrowStatus: "refund_available",
      refundEnabled: true,
      authorizationStatus: "refund_enabled",
      refundReason: "operator_declined",
    });
  });

  it("refunds the buyer amount without commission", () => {
    const state = refundEnabledState();
    const seedOrder = state.orders.find((order) => order.id === "seed-order-1");
    if (!seedOrder) throw new Error("Missing seed order.");
    const claimed = claimRefund(state, seedOrder.id, LATER);
    if (!claimed.ok) throw new Error(claimed.error.message);
    const refunded = claimed.state.orders.find((order) => order.id === seedOrder.id);
    expect(refunded).toMatchObject({
      refundStatus: "claimed",
      refundedAt: LATER,
      refundAmountMinor: seedOrder.amountMinor,
    });
    expect(refunded?.refundAmountMinor).toBe("500000000");
  });

  it("blocks duplicate refund claims", () => {
    const state = refundEnabledState();
    const first = claimRefund(state, "seed-order-1", LATER);
    if (!first.ok) throw new Error(first.error.message);
    const second = claimRefund(first.state, "seed-order-1", LATER);
    expect(second.ok).toBe(false);
    if (!second.ok) expect(second.error.code).toBe("duplicate_refund");
  });

  it("settles seeded refunds and closes the offer when every order is claimed", () => {
    const state = refundEnabledState();
    const settled = settleSeedRefunds(state, "demo-offer-1", LATER);
    if (!settled.ok) throw new Error(settled.error.message);
    const seeded = settled.state.orders.filter((order) => order.seeded);
    expect(seeded.every((order) => order.refundStatus === "claimed")).toBe(true);
    const buyerOrder = settled.state.orders.find((order) => order.buyerId === "buyer-test");
    expect(buyerOrder?.refundStatus).toBe("none");
    expect(getOffer(settled.state, "demo-offer-1")).toMatchObject({
      commercialStatus: "declined",
      escrowStatus: "refund_available",
    });
    if (!buyerOrder) throw new Error("Missing buyer order.");
    const claimed = claimRefund(settled.state, buyerOrder.id, LATER);
    if (!claimed.ok) throw new Error(claimed.error.message);
    expect(getOffer(claimed.state, "demo-offer-1")).toMatchObject({
      commercialStatus: "refunded",
      escrowStatus: "refunded",
      refundedAt: LATER,
    });
  });

  it("retries the same failed order without duplicating it", () => {
    const state = reserve(connect());
    const order = lastOrder(state);
    const failed = failOrder(state, order.id, "signature_rejected", NOW);
    if (!failed.ok) throw new Error(failed.error.message);
    expect(failed.state.orders.find((item) => item.id === order.id)).toMatchObject({
      paymentStatus: "failed",
      signatureStatus: "rejected",
      failureReason: "signature_rejected",
      receiptId: null,
    });
    const retried = retryOrder(failed.state, order.id, LATER);
    if (!retried.ok) throw new Error(retried.error.message);
    expect(retried.state.orders).toHaveLength(4);
    expect(retried.state.orders.find((item) => item.id === order.id)).toMatchObject({
      paymentStatus: "pending",
      attempt: 2,
      signatureStatus: "none",
      failureReason: null,
      receiptId: null,
      confirmedAt: null,
    });
  });

  it("blocks orders over available capacity", () => {
    const result = createOrder(
      connect(),
      {
        offerId: "demo-offer-1",
        buyerId: "buyer-test",
        buyerAlias: "Comprador Prueba",
        blockCount: 5,
        termsAccepted: true,
      },
      NOW,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("insufficient_blocks");
  });

  it("blocks orders on a non-test network", () => {
    const result = createOrder(
      connect("PUBLIC"),
      {
        offerId: "demo-offer-1",
        buyerId: "buyer-test",
        buyerAlias: "Comprador Prueba",
        blockCount: 4,
        termsAccepted: true,
      },
      NOW,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("invalid_network");
  });

  it("blocks orders when terms are not accepted", () => {
    const result = createOrder(
      connect(),
      {
        offerId: "demo-offer-1",
        buyerId: "buyer-test",
        buyerAlias: "Comprador Prueba",
        blockCount: 4,
        termsAccepted: false,
      },
      NOW,
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("terms_not_accepted");
  });

  it("blocks orders after the deadline", () => {
    const result = createOrder(
      connect(),
      {
        offerId: "demo-offer-1",
        buyerId: "buyer-test",
        buyerAlias: "Comprador Prueba",
        blockCount: 4,
        termsAccepted: true,
      },
      "2031-01-01T00:00:00.000Z",
    );
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error.code).toBe("deadline_passed");
  });

  it("resets to the deterministic fixture and appends a reset event", () => {
    const result = resetState(LATER);
    if (!result.ok) throw new Error(result.error.message);
    expect(result.state.orders).toHaveLength(3);
    expect(result.state.wallet).toEqual({ address: null, network: null, connectedAt: null });
    expect(getOffer(result.state, "demo-offer-1")).toMatchObject({
      commercialStatus: "collecting",
      escrowStatus: "funding",
      operatorResponse: "pending",
    });
    expect(result.state.events).toHaveLength(5);
    expect(result.state.events[result.state.events.length - 1]).toMatchObject({
      actor: "system",
      action: "demo.reset",
      occurredAt: LATER,
      simulated: true,
    });
    expect(result.state.offers).toEqual(createInitialDemoState(LATER).offers);
    expect(result.state.orders).toEqual(createInitialDemoState(LATER).orders);
  });
});
