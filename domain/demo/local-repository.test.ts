import { describe, expect, it } from "vitest";
import { createInitialDemoState } from "./fixtures";
import {
  DEMO_STORAGE_KEY,
  DEMO_STORAGE_VERSION,
  DemoStorageError,
  createLocalDemoRepository,
} from "./local-repository";
import type { DemoState } from "./types";

const NOW = "2026-02-01T12:00:00.000Z";
const LEGACY_KEY = "cobusiness.demo.v1";

function createMemoryStorage(initial: Record<string, string> = {}): Storage {
  const values = new Map(Object.entries(initial));
  return {
    get length() {
      return values.size;
    },
    clear() {
      values.clear();
    },
    getItem(key) {
      return values.has(key) ? (values.get(key) ?? null) : null;
    },
    key(index) {
      return Array.from(values.keys())[index] ?? null;
    },
    removeItem(key) {
      values.delete(key);
    },
    setItem(key, value) {
      values.set(key, value);
    },
  } as Storage;
}

describe("local demo repository", () => {
  it("round-trips a version 2 snapshot", () => {
    const storage = createMemoryStorage();
    const repository = createLocalDemoRepository(storage);
    const state = createInitialDemoState();
    repository.write(state);
    expect(JSON.parse(storage.getItem(DEMO_STORAGE_KEY) ?? "{}")).toMatchObject({ version: DEMO_STORAGE_VERSION });
    expect(repository.read()).toEqual(state);
  });

  it("resets to the fixture snapshot", () => {
    const storage = createMemoryStorage();
    const repository = createLocalDemoRepository(storage);
    repository.write({
      ...createInitialDemoState(),
      wallet: { address: "GDEMO-TEST", network: "TESTNET", connectedAt: NOW },
    });
    expect(repository.reset()).toEqual(createInitialDemoState());
    expect(repository.read()).toEqual(createInitialDemoState());
  });

  it("rejects invalid persisted data", () => {
    const storage = createMemoryStorage({
      [DEMO_STORAGE_KEY]: JSON.stringify({ version: DEMO_STORAGE_VERSION, data: { offers: [], orders: [], events: [] } }),
    });
    const repository = createLocalDemoRepository(storage);
    expect(() => repository.read()).toThrow(DemoStorageError);
  });

  it("rejects invalid writes", () => {
    const repository = createLocalDemoRepository(createMemoryStorage());
    expect(() => repository.write({ offers: [], orders: [], events: [] } as unknown as DemoState)).toThrow(DemoStorageError);
  });

  it("migrates a version 1 snapshot into the new shape", () => {
    const storage = createMemoryStorage({
      [LEGACY_KEY]: JSON.stringify({
        version: 1,
        data: {
          offers: [
            {
              id: "legacy-offer",
              title: "Oferta legada",
              operatorName: "Operador legado",
              unitsPerBlock: 10,
              totalBlocks: 100,
              blockPriceMinor: "12500000",
              termsVersion: 3,
              deadline: "2030-01-01T00:00:00.000Z",
              commercialStatus: "accepted",
            },
          ],
          orders: [
            {
              id: "legacy-order",
              offerId: "legacy-offer",
              buyerId: "legacy-buyer",
              blockCount: 10,
              amountMinor: "125000000",
              paymentStatus: "confirmed",
            },
          ],
          events: [
            {
              id: "legacy-event-1",
              description: "Evento legado.",
              occurredAt: "2025-01-01T00:00:00.000Z",
            },
          ],
        },
      }),
    });
    const repository = createLocalDemoRepository(storage);
    const state = repository.read();
    expect(state.wallet).toEqual({ address: null, network: null, connectedAt: null });
    expect(state.offers[0]).toMatchObject({
      id: "legacy-offer",
      productDescription: "Oferta legada",
      unitLabel: "unidades",
      termsVersion: 3,
      commercialStatus: "accepted",
      escrowStatus: "awaiting_authorization",
      operatorResponse: "continue",
      refundEnabled: false,
      commissionRateBps: 0,
    });
    expect(state.orders[0]).toMatchObject({
      buyerAlias: "legacy-buyer",
      termsVersion: 3,
      paymentStatus: "confirmed",
      receiptId: "REC-DEMO-001",
      network: "TESTNET",
      signatureStatus: "accepted",
      refundStatus: "none",
      seeded: false,
    });
    expect(state.events[0]).toMatchObject({ actor: "system", action: "legacy.event", simulated: true });
    expect(storage.getItem(DEMO_STORAGE_KEY)).not.toBeNull();
  });

  it("reports a clear error when legacy migration fails", () => {
    const storage = createMemoryStorage({
      [LEGACY_KEY]: JSON.stringify({ version: 1, data: { offers: [{}], orders: [], events: [] } }),
    });
    const repository = createLocalDemoRepository(storage);
    expect(() => repository.read()).toThrow(DemoStorageError);
  });

  it("wraps storage access failures", () => {
    const storage = {
      ...createMemoryStorage(),
      getItem() {
        throw new Error("blocked");
      },
    } as Storage;
    const repository = createLocalDemoRepository(storage);
    expect(() => repository.read()).toThrow(DemoStorageError);
  });
});
