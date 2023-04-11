require('@nomicfoundation/hardhat-toolbox');
require('@openzeppelin/hardhat-upgrades');

require('./tasks');

require('dotenv').config({ path: './.env.local' });

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
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      hardfork: 'merge',
      chainId: 31337,
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
      url: process.env.MUMBAI_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      saveDeployments: true,
      oracle: 'foo',
    },
  },
};

module.exports = config;
