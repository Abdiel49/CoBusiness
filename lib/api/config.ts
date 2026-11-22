export type PublicEnvironment = Record<string, string | undefined>;

export function getApiBaseUrl(
  env: PublicEnvironment = process.env,
): string | undefined {
  const value = env.NEXT_PUBLIC_API_BASE_URL?.trim();
  if (!value) return undefined;

  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error("Unsupported API URL protocol.");
    }
    return url.toString();
  } catch {
    throw new Error("NEXT_PUBLIC_API_BASE_URL must be a valid absolute URL.");
  }
}

export type StellarClientConfig = {
  network: "TESTNET";
  contractId: string;
  assetContractId: string;
};

export function getStellarClientConfig(
  env: PublicEnvironment = process.env,
): StellarClientConfig | undefined {
  const network = env.NEXT_PUBLIC_STELLAR_NETWORK?.trim();
  const contractId = env.NEXT_PUBLIC_STELLAR_CONTRACT_ID?.trim();
  const assetContractId = env.NEXT_PUBLIC_STELLAR_ASSET_CONTRACT_ID?.trim();
  if (!network && !contractId && !assetContractId) return undefined;
  if (!network || !contractId || !assetContractId) {
    throw new Error(
      "Stellar network, contract ID, and asset contract ID must be configured together.",
    );
  }
  if (network !== "TESTNET") {
    throw new Error(
      "The MVP Web client only supports the Stellar TESTNET network.",
    );
  }

  return { network, contractId, assetContractId };
}
