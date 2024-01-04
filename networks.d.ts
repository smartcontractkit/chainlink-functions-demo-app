export type Network = {
  linkToken: string;
  linkEthPriceFeed: string;
  functionsRouter: string;
  donId: string;
};

export const networks: Record<string, Network>;
