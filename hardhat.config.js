/* eslint-disable @typescript-eslint/no-var-requires */
require('@openzeppelin/hardhat-upgrades');

require('@typechain/hardhat');
require('@typechain/ethers-v5');

require('./tasks');

require('dotenv').config();

const config = {
  solidity: {
    compilers: [
      {
        version: '0.8.19',
        settings: {
          optimizer: {
            enabled: true,
            runs: 1_000,
          },
        },
      },
      {
        version: '0.4.26',
        settings: {
          optimizer: {
            enabled: true,
            runs: 1_000,
          },
        },
      },
    ],
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './build/artifacts',
  },
  defaultNetwork: 'mumbai',
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      hardfork: 'merge',
      chainId: 1337,
      accounts: process.env.PRIVATE_KEY
        ? [
            {
              privateKey: process.env.PRIVATE_KEY,
              balance: '10000000000000000000000',
            },
          ]
        : [],
    },
    mumbai: {
      url: 'https://polygon-mumbai.g.alchemy.com/v2/tCbwTAqlofFnmbVORepuHNcsrjNXWdRJ',
      accounts: [process.env.PRIVATE_KEY],
      saveDeployments: true,
      oracle: 'foo',
    },
  },
};

module.exports = config;
