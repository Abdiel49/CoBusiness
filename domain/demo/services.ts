import type { DemoOffer, DemoOrder, DemoRepository } from "./types";

export interface DemoOfferService {
  list(): DemoOffer[];
  find(id: string): DemoOffer | undefined;
  save(offer: DemoOffer): void;
}

export interface DemoOrderService {
  list(): DemoOrder[];
  find(id: string): DemoOrder | undefined;
  save(order: DemoOrder): void;
}

export function createDemoServices(repository: DemoRepository, onChange: () => void = () => {}): {
  offers: DemoOfferService;
  orders: DemoOrderService;
} {
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
    },
  };
}
