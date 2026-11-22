export type CreateOrderRequest = {
  blockCount: number;
  acceptedTermsVersion: number;
  idempotencyKey: string;
};

export type WalletVerifyRequest = {
  challengeId: string;
  publicKey: string;
  signature: string;
  network: string;
};

export type SubmitPaymentRequest = {
  txHash: string;
};

export type OperatorResponseRequest = {
  decision: "continue" | "decline";
};

export type ApiEnvelope<T> = {
  data: T;
  meta: { apiVersion: string; timestamp: string };
};

export type CreateOrderResponse = ApiEnvelope<{
  id: string;
  blockCount: number;
  units: number;
  amountMinor: string;
  termsVersion: number;
  status: string;
  receipt: { id: string; paymentStatus: string };
}>;
