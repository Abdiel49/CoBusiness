import { describe, expect, it } from "vitest";
import {
  getApiBaseUrl,
  getStellarClientConfig,
  type PublicEnvironment,
} from "./config";

describe("API and Stellar client configuration", () => {
  it("accepts an absolute API URL", () => {
    expect(
      getApiBaseUrl({
        NEXT_PUBLIC_API_BASE_URL: "http://localhost:3001",
      } satisfies PublicEnvironment),
    ).toBe("http://localhost:3001/");
  });

  it("rejects an invalid API URL", () => {
    expect(() =>
      getApiBaseUrl({
        NEXT_PUBLIC_API_BASE_URL: "not a URL",
      } satisfies PublicEnvironment),
    ).toThrow("NEXT_PUBLIC_API_BASE_URL must be a valid absolute URL.");
  });

  it("rejects non-HTTP API URL schemes", () => {
    expect(() =>
      getApiBaseUrl({ NEXT_PUBLIC_API_BASE_URL: "file:///tmp/api" }),
    ).toThrow("NEXT_PUBLIC_API_BASE_URL must be a valid absolute URL.");
  });

  it("allows the Stellar configuration to be absent for non-chain UI work", () => {
    expect(
      getStellarClientConfig({} satisfies PublicEnvironment),
    ).toBeUndefined();
  });

  it("requires complete Testnet configuration", () => {
    expect(() =>
      getStellarClientConfig({
        NEXT_PUBLIC_STELLAR_NETWORK: "TESTNET",
      } satisfies PublicEnvironment),
    ).toThrow(
      "Stellar network, contract ID, and asset contract ID must be configured together.",
    );
  });

  it("rejects production network configuration for the MVP client", () => {
    expect(() =>
      getStellarClientConfig({
        NEXT_PUBLIC_STELLAR_NETWORK: "PUBLIC",
        NEXT_PUBLIC_STELLAR_CONTRACT_ID: "contract",
        NEXT_PUBLIC_STELLAR_ASSET_CONTRACT_ID: "asset",
      } satisfies PublicEnvironment),
    ).toThrow("The MVP Web client only supports the Stellar TESTNET network.");
  });
});
