export type DemoRole = "buyer" | "operator" | "admin";

export interface DemoOffer {
  id: string;
  title: string;
  operatorName: string;
  unitsPerBlock: number;
  totalBlocks: number;
  blockPriceMinor: string;
  termsVersion: number;
  deadline: string;
  commercialStatus: "collecting" | "awaiting_operator" | "accepted" | "declined";
}

export interface DemoOrder {
  id: string;
  offerId: string;
  buyerId: string;
  blockCount: number;
  amountMinor: string;
  paymentStatus: "pending" | "confirmed" | "failed";
}

export interface DemoState {
  offers: DemoOffer[];
  orders: DemoOrder[];
  events: Array<{ id: string; description: string; occurredAt: string }>;
}

export interface DemoRepository {
  read(): DemoState;
  write(state: DemoState): void;
  reset(): DemoState;
}
