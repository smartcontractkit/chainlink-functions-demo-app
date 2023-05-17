const networks = {
  mumbai: {
    linkToken: '0x326C977E6efc84E512bB9C30f76E30c160eD06FB',
    linkEthPriceFeed: '0x12162c3E810393dEC01362aBf156D7ecf6159528',
    functionsOracleProxy: '0xeA6721aC65BCeD841B8ec3fc5fEdeA6141a0aDE4',
    functionsBillingRegistryProxy: '0xEe9Bf52E5Ea228404bB54BCFbbDa8c21131b9039',
    functionsPublicKey:
      'a30264e813edc9927f73e036b7885ee25445b836979cb00ef112bc644bd16de2db866fa74648438b34f52bb196ffa386992e94e0a3dc6913cee52e2e98f1619c',
  },
};
const SHARED_DON_PUBLIC_KEY =
  'a30264e813edc9927f73e036b7885ee25445b836979cb00ef112bc644bd16de2db866fa74648438b34f52bb196ffa386992e94e0a3dc6913cee52e2e98f1619c';

module.exports = {
  networks,
  SHARED_DON_PUBLIC_KEY,
};
