import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import '@nomiclabs/hardhat-ethers';
import '@openzeppelin/hardhat-upgrades';
import '@nomiclabs/hardhat-etherscan';

import dotenv from 'dotenv';
dotenv.config();

import './tasks/index.ts';

const settings = {
  optimizer: {
    enabled: true,
    runs: 1_000,
  },
};
const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.18',
        settings,
      },
      {
        version: '0.7.6',
        settings,
      },
      {
        version: '0.4.24',
        settings,
      },
    ],
  },
  networks: {
    mumbai: {
      url: 'https://polygon-mumbai.g.alchemy.com/v2/tCbwTAqlofFnmbVORepuHNcsrjNXWdRJ',
      accounts: [process.env.PRIVATE_KEY || ''],
    },
  },
  defaultNetwork: 'mumbai',
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './build/artifacts',
  },
};

export default config;
