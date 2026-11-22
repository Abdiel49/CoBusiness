export const DEMO_CURRENCY = "BOB";

const MINOR_PATTERN = /^\d+$/;

export function parseMinor(amountMinor: string): bigint {
  if (!MINOR_PATTERN.test(amountMinor)) {
    throw new Error("Amount must be a non-negative integer string in minor units.");
  }
  return BigInt(amountMinor);
}

export function multiplyMinor(amountMinor: string, quantity: number): string {
  if (!Number.isSafeInteger(quantity) || quantity < 0) {
    throw new Error("Quantity must be a non-negative integer.");
  }
  return (parseMinor(amountMinor) * BigInt(quantity)).toString();
}

export function calculateCommissionMinor(amountMinor: string, rateBps: number): string {
  if (!Number.isSafeInteger(rateBps) || rateBps < 0) {
    throw new Error("Commission rate must be a non-negative integer in basis points.");
  }
  return ((parseMinor(amountMinor) * BigInt(rateBps)) / BigInt(10000)).toString();
}

export function formatMinor(amountMinor: string): string {
  const amount = Number(parseMinor(amountMinor)) / 100;
  return new Intl.NumberFormat("es-BO", {
    style: "currency",
    currency: DEMO_CURRENCY,
    maximumFractionDigits: 2,
  }).format(amount);
}
