import type { DemoState } from "./types";

export function createInitialDemoState(): DemoState {
  return {
    offers: [{ id: "demo-offer-1", title: "Oferta de ejemplo", operatorName: "Operador de ejemplo", unitsPerBlock: 10, totalBlocks: 100, blockPriceMinor: "12500000", termsVersion: 1, deadline: "2030-01-01T00:00:00.000Z", commercialStatus: "collecting" }],
    orders: [],
    events: [],
  };
}
