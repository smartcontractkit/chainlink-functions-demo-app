import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import '@openzeppelin/hardhat-upgrades';
import './tasks';
import dotenv from 'dotenv';

dotenv.config({ path: './.env.local' });

// Set one of the following RPC endpoints (required)
let MAINNET_RPC_URL = process.env.MAINNET_RPC_URL;
let POLYGON_MAINNET_RPC_URL = process.env.POLYGON_MAINNET_RPC_URL;
let MUMBAI_RPC_URL = process.env.MUMBAI_RPC_URL;
let SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;

// Ignore default values from .env.example
if (SEPOLIA_RPC_URL === 'https://sepolia.infura.io/v3/ExampleKey') {
  SEPOLIA_RPC_URL = undefined;
}
if (MUMBAI_RPC_URL === 'https://polygon-mumbai.g.alchemy.com/v2/ExampleKey') {
  MUMBAI_RPC_URL = undefined;
}

// Ensure one of the RPC endpoints has been set
if (
  !MAINNET_RPC_URL &&
  !POLYGON_MAINNET_RPC_URL &&
  !MUMBAI_RPC_URL &&
  !SEPOLIA_RPC_URL
) {
  throw Error(
    'One of the following environment variables must be set: MAINNET_RPC_URL, SEPOLIA_RPC_URL, POLYGON_MAINNET_RPC_URL, or MUMBAI_RPC_URL'
  );
}

// Set EVM private key (required)
const PRIVATE_KEY = process.env.PRIVATE_KEY;
if (!PRIVATE_KEY) {
  throw Error(
    'Set the PRIVATE_KEY environment variable with your EVM wallet private key'
  );
}

// Set a specific bock number to fork (optional)
// if (process.env.FORKING_BLOCK_NUMBER) {
//   const FORKING_BLOCK_NUMBER = isNaN(process.env.FORKING_BLOCK_NUMBER)
//     ? undefined
//     : parseInt(process.env.FORKING_BLOCK_NUMBER);
// }

// Your API key for Etherscan, obtain one at https://etherscan.io/ (optional)
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY;

// Enable gas reporting (optional)
const REPORT_GAS =
  process.env.REPORT_GAS?.toLowerCase() === 'true' ? true : false;

// This adds support for typescript paths mappings
import 'tsconfig-paths/register';

const config: HardhatUserConfig = {
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      hardfork: 'merge',
      // forking: {
      //   url:
      //     MAINNET_RPC_URL ??
      //     POLYGON_MAINNET_RPC_URL ??
      //     MUMBAI_RPC_URL ??
      //     SEPOLIA_RPC_URL,
      //   blockNumber: FORKING_BLOCK_NUMBER,
      //   enabled: true,
      // },
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
    mainnet: {
      url: MAINNET_RPC_URL ?? 'UNSET',
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      chainId: 1,
    },
    polygon: {
      url: POLYGON_MAINNET_RPC_URL ?? 'UNSET',
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      chainId: 137,
    },
    mumbai: {
      url: MUMBAI_RPC_URL ?? 'UNSET',
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
    },
    sepolia: {
      url: SEPOLIA_RPC_URL || 'UNSET',
      accounts: PRIVATE_KEY !== undefined ? [PRIVATE_KEY] : [],
      chainId: 11155111,
    },
  },
  etherscan: {
    // yarn hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <CONSTRUCTOR_PARAMETERS>
    apiKey: {
      mainnet: ETHERSCAN_API_KEY as string,
      polygon: POLYGONSCAN_API_KEY as string,
      sepolia: ETHERSCAN_API_KEY as string,
      polygonMumbai: POLYGONSCAN_API_KEY as string,
    },
  },
  gasReporter: {
    enabled: REPORT_GAS,
    currency: 'USD',
    outputFile: 'gas-report.txt',
    noColors: true,
  },
  // contractSizer: {
  //   runOnCompile: false,
  //   only: [
  //     'FunctionsConsumer',
  //     'AutomatedFunctionsConsumer',
  //     'FunctionsBillingRegistry',
  //   ],
  // },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './build/cache',
    artifacts: './build/artifacts',
  },
  mocha: {
    timeout: 200000, // 200 seconds max for running tests
  },
  solidity: {
    compilers: [
      {
        version: '0.8.7',
        settings: {
          optimizer: {
            enabled: true,
            runs: 1_000,
          },
        },
      },
      {
        version: '0.6.6',
        settings: {
          optimizer: {
            enabled: true,
            runs: 1_000,
          },
        },
      },
      {
        version: '0.4.24',
        settings: {
          optimizer: {
            enabled: true,
            runs: 1_000,
          },
        },
      },
    ],
  },
};

export default config;
