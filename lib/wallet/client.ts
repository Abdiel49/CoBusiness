"use client";

export type WalletNetwork = "TESTNET";

export type WalletConnection = {
  publicKey: string;
  network: WalletNetwork;
};

export type WalletAdapter = {
  connect(): Promise<WalletConnection>;
  disconnect(): Promise<void>;
  signTransaction(transactionXdr: string): Promise<string>;
};
