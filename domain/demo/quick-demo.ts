export type Scenario = "success" | "rejection";
export type DemoRole = "buyer" | "importer" | "admin";
export type Stage = "collecting" | "funded" | "ratified" | "authorized" | "released" | "rejected" | "refund-available" | "refunded";
export type QuickDemoState = {
  scenario: Scenario;
  role: DemoRole;
  stage: Stage;
  blocks: number;
  accepted: boolean;
  fundedBlocks: number;
  ownBlocks: number;
  events: string[];
};
export type QuickDemoAction =
  | { type: "reset"; scenario: Scenario }
  | { type: "change-role"; role: DemoRole }
  | { type: "select"; blocks: number }
  | { type: "accept"; accepted: boolean }
  | { type: "contribute" | "complete" | "ratify" | "authorize" | "release" | "reject" | "enable-refund" | "refund" };

export const UNIT_PRICE = 50;
export const BLOCK_SIZE = 100;
export const BLOCK_PRICE = UNIT_PRICE * BLOCK_SIZE;
export const TOTAL_BLOCKS = 10;

export function createQuickDemo(scenario: Scenario = "success"): QuickDemoState {
  return {
    scenario,
    role: "buyer",
    stage: scenario === "success" ? "collecting" : "funded",
    blocks: 1,
    accepted: false,
    fundedBlocks: scenario === "success" ? 7 : 10,
    ownBlocks: scenario === "success" ? 0 : 1,
    events: [scenario === "success" ? "7 bloques precargados por otros compradores · Bs 35.000 simulados." : "Operación financiada · Tu aporte precargado: 1 bloque, Bs 5.000 simulados."],
  };
}

export function quickDemoReducer(state: QuickDemoState, action: QuickDemoAction): QuickDemoState {
  if (action.type === "reset") return createQuickDemo(action.scenario);
  if (action.type === "change-role") return { ...state, role: action.role };
  const requiredRole: Record<Exclude<QuickDemoAction["type"], "reset" | "change-role">, DemoRole> = {
    select: "buyer", accept: "buyer", contribute: "buyer", complete: "buyer", refund: "buyer",
    ratify: "importer", reject: "importer", authorize: "admin", release: "admin", "enable-refund": "admin",
  };
  if (state.role !== requiredRole[action.type]) return state;
  if (action.type === "select") {
    if (state.stage !== "collecting" || state.ownBlocks > 0 || !Number.isInteger(action.blocks) || action.blocks < 1 || action.blocks > TOTAL_BLOCKS - state.fundedBlocks) return state;
    return { ...state, blocks: action.blocks };
  }
  if (action.type === "accept") return state.stage === "collecting" && state.ownBlocks === 0 ? { ...state, accepted: action.accepted } : state;
  let stage = state.stage;
  let fundedBlocks = state.fundedBlocks;
  let ownBlocks = state.ownBlocks;
  let message = "";
  switch (action.type) {
    case "contribute":
      if (stage !== "collecting" || !state.accepted || ownBlocks > 0) return state;
      fundedBlocks += state.blocks;
      ownBlocks = state.blocks;
      stage = fundedBlocks === TOTAL_BLOCKS ? "funded" : "collecting";
      message = `Aporte simulado confirmado · ${state.blocks} bloque(s), Bs ${(state.blocks * BLOCK_PRICE).toLocaleString("es-BO")}.`;
      break;
    case "complete":
      if (stage !== "collecting" || ownBlocks === 0) return state;
      fundedBlocks = TOTAL_BLOCKS;
      stage = "funded";
      message = "Otros compradores completaron la meta · 10 bloques financiados (simulado).";
      break;
    case "ratify":
      if (stage !== "funded") return state;
      stage = "ratified";
      message = "El importador ratificó precio, cantidad y condiciones (simulado).";
      break;
    case "authorize":
      if (stage !== "ratified") return state;
      stage = "authorized";
      message = "CoBusiness autorizó el desembolso (simulado). Aún no se movió el saldo.";
      break;
    case "release":
      if (stage !== "authorized") return state;
      stage = "released";
      message = "Desembolso simulado completado · Bs 50.000 al importador ficticio.";
      break;
    case "reject":
      if (stage !== "funded") return state;
      stage = "rejected";
      message = "El importador rechazó la operación (simulado). No habrá compra ni desembolso.";
      break;
    case "enable-refund":
      if (stage !== "rejected") return state;
      stage = "refund-available";
      message = "Devolución habilitada · Ya puedes reclamar tu aporte simulado.";
      break;
    case "refund":
      if (stage !== "refund-available") return state;
      stage = "refunded";
      message = `Devolución completada · Bs ${(ownBlocks * BLOCK_PRICE).toLocaleString("es-BO")} simulados devueltos a tu saldo demo.`;
      break;
    default: return state;
  }
  return { ...state, stage, fundedBlocks, ownBlocks, events: [...state.events, message] };
}
