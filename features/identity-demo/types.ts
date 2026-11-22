import type { getCommission, getOfferProgress, getRefundSummary } from "@/domain/demo/selectors";

export type OfferProgress = ReturnType<typeof getOfferProgress>;
export type CommissionSummary = ReturnType<typeof getCommission>;
export type RefundSummary = ReturnType<typeof getRefundSummary>;

export type IdentityTab = "buyer" | "operator" | "admin";

export type DialogState =
  | { kind: "signature"; orderId: string }
  | { kind: "cancel-order"; orderId: string }
  | { kind: "claim-refund"; orderId: string }
  | { kind: "operator-continue" }
  | { kind: "operator-decline" }
  | { kind: "authorize-release" }
  | { kind: "enable-refund" }
  | { kind: "settle-refunds" }
  | { kind: "reset" }
  | null;

export type ServiceOutcome =
  | { ok: true; state: import("@/domain/demo/types").DemoState }
  | { ok: false; message: string };
