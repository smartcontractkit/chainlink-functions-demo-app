export type Network = {
  linkToken: string;
  linkEthPriceFeed: string;
  functionsOracleProxy: string;
  functionsBillingRegistryProxy: string;
  functionsPublicKey: string;
};

export const networks: Record<string, Network>;
export const SHARED_DON_PUBLIC_KEY: string;
