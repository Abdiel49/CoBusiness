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
    state = reduce(state, { type: "ratify" });
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
    expect(reduce(state, { type: "ratify" })).toBe(state);
    state = reduce(state, { type: "reject" });
    expect(reduce(state, { type: "refund" })).toBe(state);
    state = reduce(state, { type: "enable-refund" });
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
});
