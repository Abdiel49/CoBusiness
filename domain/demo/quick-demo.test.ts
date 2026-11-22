import { describe, expect, it } from "vitest";
import { createQuickDemo, quickDemoReducer as reduce } from "./quick-demo";

describe("90-second simulated commercial demo", () => {
  it("requires terms, records a contribution, completes funding and requires both approvals before release", () => {
    let state = createQuickDemo();
    expect(reduce(state, { type: "contribute" })).toBe(state);
    expect(reduce(state, { type: "release" })).toBe(state);
    state = reduce(state, { type: "accept", accepted: true });
    state = reduce(state, { type: "contribute" });
    expect(state.fundedBlocks).toBe(8);
    expect(state.ownBlocks).toBe(1);
    expect(reduce(state, { type: "contribute" })).toBe(state);
    state = reduce(state, { type: "complete" });
    expect(state.stage).toBe("funded");
    expect(reduce(state, { type: "authorize" })).toBe(state);
    expect(reduce(state, { type: "release" })).toBe(state);
    state = reduce(state, { type: "change-role", role: "importer" });
    state = reduce(state, { type: "ratify" });
    state = reduce(state, { type: "change-role", role: "admin" });
    state = reduce(state, { type: "authorize" });
    state = reduce(state, { type: "release" });
    expect(state.stage).toBe("released");
    expect(state.events).toHaveLength(6);
    expect(reduce(state, { type: "release" })).toBe(state);
  });
  it("funds directly when the buyer chooses all remaining blocks", () => {
    let state = reduce(createQuickDemo(), { type: "select", blocks: 3 });
    state = reduce(state, { type: "accept", accepted: true });
    state = reduce(state, { type: "contribute" });
    expect(state.stage).toBe("funded");
    expect(state.fundedBlocks).toBe(10);
    expect(state.ownBlocks).toBe(3);
  });
  it("rejects invalid quantities", () => {
    const state = createQuickDemo();
    for (const blocks of [-1, 0, 4, 1.5, NaN]) expect(reduce(state, { type: "select", blocks })).toBe(state);
  });
  it("starts rejection fully funded and requires cancellation and eligibility before refund", () => {
    let state = createQuickDemo("rejection");
    expect(state.fundedBlocks).toBe(10);
    expect(state.ownBlocks).toBe(1);
    expect(reduce(state, { type: "refund" })).toBe(state);
    state = reduce(state, { type: "change-role", role: "importer" });
    state = reduce(state, { type: "reject" });
    expect(reduce(state, { type: "refund" })).toBe(state);
    state = reduce(state, { type: "change-role", role: "admin" });
    state = reduce(state, { type: "enable-refund" });
    state = reduce(state, { type: "change-role", role: "buyer" });
    state = reduce(state, { type: "refund" });
    expect(state.stage).toBe("refunded");
    expect(state.events).toHaveLength(4);
    expect(reduce(state, { type: "refund" })).toBe(state);
    expect(reduce(state, { type: "release" })).toBe(state);
  });
  it("resets every mutable value and switches scenarios without sharing progress", () => {
    let state = reduce(createQuickDemo(), { type: "accept", accepted: true });
    state = reduce(state, { type: "contribute" });
    expect(reduce(state, { type: "reset", scenario: "success" })).toEqual(createQuickDemo());
    expect(reduce(state, { type: "reset", scenario: "rejection" })).toEqual(createQuickDemo("rejection"));
  });
  it("preserves quantities, terms, balances, stage and history when switching roles", () => {
    let state = reduce(createQuickDemo(), { type: "select", blocks: 2 });
    state = reduce(state, { type: "accept", accepted: true });
    for (const role of ["importer", "admin", "buyer"] as const) {
      const previous = state;
      state = reduce(state, { type: "change-role", role });
      expect(state).toEqual({ ...previous, role });
    }
    state = reduce(state, { type: "contribute" });
    expect(reduce(state, { type: "change-role", role: "admin" })).toEqual({ ...state, role: "admin" });
  });
  it("enforces role boundaries even for out-of-view dispatched actions", () => {
    for (const role of ["buyer", "importer", "admin"] as const) {
      const funded = { ...createQuickDemo("rejection"), role };
      for (const type of ["ratify", "reject"] as const) {
        expect(reduce(funded, { type }).stage).toBe(role === "importer" ? type === "ratify" ? "ratified" : "rejected" : "funded");
      }
      for (const [stage, type] of [["ratified", "authorize"], ["authorized", "release"], ["rejected", "enable-refund"], ["refund-available", "refund"]] as const) {
        const state = { ...funded, stage };
        expect(reduce(state, { type }) === state).toBe(role !== (type === "refund" ? "buyer" : "admin"));
      }
      const collecting = { ...createQuickDemo(), role, accepted: true };
      expect(reduce(collecting, { type: "contribute" }) === collecting).toBe(role !== "buyer");
    }
  });
  it("allows importer rejection after a buyer contribution and refunds the actual amount", () => {
    let state = reduce(createQuickDemo(), { type: "select", blocks: 3 });
    state = reduce(state, { type: "accept", accepted: true });
    state = reduce(state, { type: "contribute" });
    state = reduce(state, { type: "change-role", role: "importer" });
    state = reduce(state, { type: "reject" });
    state = reduce(state, { type: "change-role", role: "admin" });
    state = reduce(state, { type: "enable-refund" });
    state = reduce(state, { type: "change-role", role: "buyer" });
    state = reduce(state, { type: "refund" });
    expect(state.stage).toBe("refunded");
    expect(state.events.at(-1)).toContain("15.000");
  });
});
