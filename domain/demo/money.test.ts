import { describe, expect, it } from "vitest";
import { calculateCommissionMinor, DEMO_CURRENCY, formatMinor, multiplyMinor, parseMinor } from "./money";

describe("demo money", () => {
  it("parses minor units as bigint", () => {
    expect(parseMinor("12500000")).toBe(BigInt(12500000));
    expect(parseMinor("0")).toBe(BigInt(0));
  });

  it("rejects invalid minor units", () => {
    expect(() => parseMinor("12.5")).toThrow();
    expect(() => parseMinor("-1")).toThrow();
    expect(() => parseMinor("abc")).toThrow();
  });

  it("multiplies minor amounts without fractions", () => {
    expect(multiplyMinor("12500000", 4)).toBe("50000000");
    expect(multiplyMinor("12500000", 0)).toBe("0");
    expect(() => multiplyMinor("12500000", 1.5)).toThrow();
  });

  it("calculates commission with floor", () => {
    expect(calculateCommissionMinor("50000000", 500)).toBe("2500000");
    expect(calculateCommissionMinor("1", 500)).toBe("0");
    expect(calculateCommissionMinor("50000000", 0)).toBe("0");
  });

  it("formats minor units as Bolivian currency", () => {
    expect(DEMO_CURRENCY).toBe("BOB");
    expect(formatMinor("12500000")).toContain("125.000");
    expect(formatMinor("123456")).toContain("1.234,56");
  });
});
