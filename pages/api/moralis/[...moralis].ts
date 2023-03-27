import { MoralisNextApi } from '@moralisweb3/next';
import { EvmChain } from 'moralis/common-evm-utils';

export default MoralisNextApi({
  defaultEvmApiChain: EvmChain.POLYGON,
  apiKey: process.env.MORALIS_API_KEY,
  authentication: {
    domain: 'amazing.dapp',
    uri: process.env.NEXTAUTH_URL,
    timeout: 120,
  },
});
