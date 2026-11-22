import { calculateCommissionMinor, parseMinor } from "./money";
import type { DemoOffer, DemoOrder, DemoState } from "./types";

export function getOffer(state: DemoState, id: string): DemoOffer | undefined {
  return state.offers.find((offer) => offer.id === id);
}

export function getConfirmedBlocks(state: DemoState, offerId: string): number {
  return state.orders
    .filter((order) => order.offerId === offerId && order.paymentStatus === "confirmed")
    .reduce((total, order) => total + order.blockCount, 0);
}

export function getPendingBlocks(state: DemoState, offerId: string): number {
  return state.orders
    .filter((order) => order.offerId === offerId && order.paymentStatus === "pending")
    .reduce((total, order) => total + order.blockCount, 0);
}

export function getAvailableBlocks(state: DemoState, offerId: string): number {
  const offer = getOffer(state, offerId);
  if (!offer) return 0;
  return Math.max(0, offer.totalBlocks - getConfirmedBlocks(state, offerId) - getPendingBlocks(state, offerId));
}

export function getOfferProgress(state: DemoState, offerId: string): {
  confirmedBlocks: number;
  pendingBlocks: number;
  availableBlocks: number;
  totalBlocks: number;
  percent: number;
  isGoalReached: boolean;
} {
  const offer = getOffer(state, offerId);
  const totalBlocks = offer?.totalBlocks ?? 0;
  const confirmedBlocks = getConfirmedBlocks(state, offerId);
  const pendingBlocks = getPendingBlocks(state, offerId);
  const availableBlocks = getAvailableBlocks(state, offerId);
  const percent = totalBlocks > 0 ? Math.min(100, Math.round((confirmedBlocks / totalBlocks) * 100)) : 0;
  return {
    confirmedBlocks,
    pendingBlocks,
    availableBlocks,
    totalBlocks,
    percent,
    isGoalReached: totalBlocks > 0 && confirmedBlocks >= totalBlocks,
  };
}

export function getBuyerOrders(state: DemoState, buyerId: string): DemoOrder[] {
  return state.orders.filter((order) => order.buyerId === buyerId);
}

function getConfirmedOrders(state: DemoState, offerId: string): DemoOrder[] {
  return state.orders.filter((order) => order.offerId === offerId && order.paymentStatus === "confirmed");
}

export function getCommission(state: DemoState, offerId: string): {
  rateBps: number;
  grossMinor: string;
  commissionMinor: string;
  netMinor: string;
} {
  const offer = getOffer(state, offerId);
  const rateBps = offer?.commissionRateBps ?? 0;
  const gross = getConfirmedOrders(state, offerId).reduce((total, order) => total + parseMinor(order.amountMinor), BigInt(0));
  const grossMinor = gross.toString();
  const commissionMinor = calculateCommissionMinor(grossMinor, rateBps);
  const netMinor = (gross - parseMinor(commissionMinor)).toString();
  return { rateBps, grossMinor, commissionMinor, netMinor };
}

export function getRefundSummary(state: DemoState, offerId: string): {
  eligibleOrders: number;
  totalRefundMinor: string;
  claimedOrders: number;
  claimedAmountMinor: string;
} {
  const confirmed = getConfirmedOrders(state, offerId);
  const claimed = confirmed.filter((order) => order.refundStatus === "claimed");
  const totalRefund = confirmed.reduce((total, order) => total + parseMinor(order.amountMinor), BigInt(0));
  const claimedAmount = claimed.reduce(
    (total, order) => total + parseMinor(order.refundAmountMinor ?? order.amountMinor),
    BigInt(0),
  );
  return {
    eligibleOrders: confirmed.length,
    totalRefundMinor: totalRefund.toString(),
    claimedOrders: claimed.length,
    claimedAmountMinor: claimedAmount.toString(),
  };
}
