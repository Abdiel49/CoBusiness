export type DemoRole = "buyer" | "operator" | "admin";
export type CommercialStatus = "collecting" | "goal_reached" | "accepted" | "declined" | "released" | "refunded";
export type EscrowStatus = "funding" | "funded" | "awaiting_authorization" | "refund_pending" | "refund_available" | "released" | "refunded";
export type OperatorResponse = "pending" | "continue" | "decline";
export type AuthorizationStatus = "pending" | "authorized" | "refund_enabled";
export type PaymentStatus = "pending" | "confirmed" | "failed";
export type RefundStatus = "none" | "claimed";
export type WalletNetwork = "TESTNET" | "PUBLIC";
export type SignatureStatus = "none" | "accepted" | "rejected";
export type FailureReason = "signature_rejected" | "network_error" | "cancelled";
export type RefundReason = "operator_declined" | "goal_not_reached" | null;

export interface DemoOffer {
  id: string;
  title: string;
  productDescription: string;
  unitLabel: string;
  operatorName: string;
  unitsPerBlock: number;
  totalBlocks: number;
  blockPriceMinor: string;
  termsVersion: number;
  termsSummary: string;
  deadline: string;
  commercialStatus: CommercialStatus;
  escrowStatus: EscrowStatus;
  goalReachedAt: string | null;
  operatorResponse: OperatorResponse;
  operatorRespondedAt: string | null;
  operatorResponseDeadline: string | null;
  authorizationStatus: AuthorizationStatus;
  authorizedAt: string | null;
  refundReason: RefundReason;
  refundEnabled: boolean;
  commissionRateBps: number;
  releasedAt: string | null;
  refundedAt: string | null;
  updatedAt: string;
}

export interface DemoOrder {
  id: string;
  offerId: string;
  buyerId: string;
  buyerAlias: string;
  blockCount: number;
  amountMinor: string;
  termsVersion: number;
  termsAcceptedAt: string;
  paymentStatus: PaymentStatus;
  receiptId: string | null;
  createdAt: string;
  confirmedAt: string | null;
  walletAddress: string;
  network: WalletNetwork;
  signatureStatus: SignatureStatus;
  failureReason: FailureReason | null;
  attempt: number;
  refundStatus: RefundStatus;
  refundedAt: string | null;
  refundAmountMinor: string | null;
  simulatedTxRef: string | null;
  seeded: boolean;
}

export interface DemoEvent {
  id: string;
  actor: DemoRole | "system";
  action: string;
  description: string;
  occurredAt: string;
  simulated: true;
  offerId?: string;
  orderId?: string;
}

export interface DemoWallet {
  address: string | null;
  network: WalletNetwork | null;
  connectedAt: string | null;
}

export interface DemoState {
  offers: DemoOffer[];
  orders: DemoOrder[];
  events: DemoEvent[];
  wallet: DemoWallet;
}

export interface DemoRepository {
  read(): DemoState;
  write(state: DemoState): void;
  reset(): DemoState;
}
