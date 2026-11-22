import {
  authorizeRelease,
  claimRefund,
  confirmOrder,
  connectWallet,
  createOrder,
  disconnectWallet,
  enableRefund,
  failOrder,
  respondToOffer,
  retryOrder,
  setWalletNetwork,
  settleSeedRefunds,
  type CreateOrderInput,
  type FlowResult,
} from "./flow";
import type { DemoOffer, DemoOrder, DemoRepository, DemoState, FailureReason, WalletNetwork } from "./types";

export interface DemoOfferService {
  list(): DemoOffer[];
  find(id: string): DemoOffer | undefined;
  save(offer: DemoOffer): void;
  respond(id: string, response: "continue" | "decline"): FlowResult;
  authorizeRelease(id: string): FlowResult;
  enableRefund(id: string): FlowResult;
  settleSeedRefunds(id: string): FlowResult;
}

export interface DemoOrderService {
  list(): DemoOrder[];
  find(id: string): DemoOrder | undefined;
  save(order: DemoOrder): void;
  create(input: CreateOrderInput): FlowResult;
  confirm(id: string): FlowResult;
  fail(id: string, reason: FailureReason): FlowResult;
  retry(id: string): FlowResult;
  claimRefund(id: string): FlowResult;
}

export interface DemoWalletService {
  connect(address: string, network: WalletNetwork): FlowResult;
  disconnect(): FlowResult;
  setNetwork(network: WalletNetwork): FlowResult;
}

export interface DemoServices {
  offers: DemoOfferService;
  orders: DemoOrderService;
  wallet: DemoWalletService;
}

export function createDemoServices(repository: DemoRepository, onChange: () => void = () => {}): DemoServices {
  function run(flow: (state: DemoState, now: string) => FlowResult): FlowResult {
    const result = flow(repository.read(), new Date().toISOString());
    if (result.ok) {
      repository.write(result.state);
      onChange();
    }
    return result;
  }

  return {
    offers: {
      list: () => repository.read().offers,
      find: (id) => repository.read().offers.find((offer) => offer.id === id),
      save(offer) {
        const state = repository.read();
        const index = state.offers.findIndex((item) => item.id === offer.id);
        if (index < 0) state.offers.push(offer);
        else state.offers[index] = offer;
        repository.write(state);
        onChange();
      },
      respond: (id, response) => run((state, now) => respondToOffer(state, id, response, now)),
      authorizeRelease: (id) => run((state, now) => authorizeRelease(state, id, now)),
      enableRefund: (id) => run((state, now) => enableRefund(state, id, now)),
      settleSeedRefunds: (id) => run((state, now) => settleSeedRefunds(state, id, now)),
    },
    orders: {
      list: () => repository.read().orders,
      find: (id) => repository.read().orders.find((order) => order.id === id),
      save(order) {
        const state = repository.read();
        if (!state.offers.some((offer) => offer.id === order.offerId)) {
          throw new Error("Cannot save an order for an unknown offer.");
        }
        const index = state.orders.findIndex((item) => item.id === order.id);
        if (index < 0) state.orders.push(order);
        else state.orders[index] = order;
        repository.write(state);
        onChange();
      },
      create: (input) => run((state, now) => createOrder(state, input, now)),
      confirm: (id) => run((state, now) => confirmOrder(state, id, now)),
      fail: (id, reason) => run((state, now) => failOrder(state, id, reason, now)),
      retry: (id) => run((state, now) => retryOrder(state, id, now)),
      claimRefund: (id) => run((state, now) => claimRefund(state, id, now)),
    },
    wallet: {
      connect: (address, network) => run((state, now) => connectWallet(state, { address, network }, now)),
      disconnect: () => run((state, now) => disconnectWallet(state, now)),
      setNetwork: (network) => run((state, now) => setWalletNetwork(state, network, now)),
    },
  };
}
