import { createInitialDemoState } from "./fixtures";
import type { DemoRepository, DemoState } from "./types";

const STORAGE_KEY = "cobusiness.demo.v1";
const VERSION = 1;

export class DemoStorageError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options);
    this.name = "DemoStorageError";
  }
}

function isDemoState(value: unknown): value is DemoState {
  if (!value || typeof value !== "object") return false;
  const state = value as Record<string, unknown>;
  const isRecord = (item: unknown): item is Record<string, unknown> =>
    !!item && typeof item === "object" && !Array.isArray(item);
  const positiveInteger = (item: unknown) => Number.isSafeInteger(item) && (item as number) > 0;
  const minorAmount = (item: unknown) => typeof item === "string" && /^\d+$/.test(item);
  return Array.isArray(state.offers) && state.offers.every((offer: unknown) =>
    isRecord(offer) && typeof offer.id === "string" && typeof offer.title === "string" &&
    typeof offer.operatorName === "string" && positiveInteger(offer.unitsPerBlock) &&
    positiveInteger(offer.totalBlocks) && minorAmount(offer.blockPriceMinor) &&
    positiveInteger(offer.termsVersion) && typeof offer.deadline === "string" &&
    ["collecting", "awaiting_operator", "accepted", "declined"].includes(String(offer.commercialStatus))) &&
    Array.isArray(state.orders) && state.orders.every((order: unknown) =>
      isRecord(order) && typeof order.id === "string" && typeof order.offerId === "string" &&
      typeof order.buyerId === "string" && positiveInteger(order.blockCount) &&
      minorAmount(order.amountMinor) && ["pending", "confirmed", "failed"].includes(String(order.paymentStatus))) &&
    Array.isArray(state.events) && state.events.every((event: unknown) =>
      isRecord(event) && typeof event.id === "string" && typeof event.description === "string" &&
      typeof event.occurredAt === "string");
}

export function createLocalDemoRepository(storage: Storage): DemoRepository {
  function write(state: DemoState): void {
    if (!isDemoState(state)) throw new DemoStorageError("Cannot save invalid demo data.");
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify({ version: VERSION, data: state }));
    } catch (cause) {
      throw new DemoStorageError("Unable to save demo data.", { cause });
    }
  }

  return {
    read() {
      let raw: string | null;
      try {
        raw = storage.getItem(STORAGE_KEY);
      } catch (cause) {
        throw new DemoStorageError("Unable to read demo data.", { cause });
      }
      if (raw === null) return createInitialDemoState();
      try {
        const envelope: unknown = JSON.parse(raw);
        if (!envelope || typeof envelope !== "object") throw new Error("Invalid envelope");
        const record = envelope as Record<string, unknown>;
        if (record.version !== VERSION || !isDemoState(record.data)) throw new Error("Unsupported or invalid demo data");
        return record.data;
      } catch (cause) {
        throw new DemoStorageError("Demo data is invalid or has an unsupported version.", { cause });
      }
    },
    write,
    reset() {
      const state = createInitialDemoState();
      write(state);
      return state;
    },
  };
}
