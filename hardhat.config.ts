import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import dotenv from 'dotenv';

dotenv.config({ path: './.env.local' });

// This adds support for typescript paths mappings
import 'tsconfig-paths/register';

const config: HardhatUserConfig = {
  defaultNetwork: 'mumbai',
  networks: {
    hardhat: {
      // // If you want to do some forking, uncomment this
      // forking: {
      //   url: MAINNET_RPC_URL
      // }
    },
    localhost: {},
    mumbai: {
      url: process.env.MUMBAI_RPC_URL as string,
      accounts: [process.env.PRIVATE_KEY as string],
      saveDeployments: true,
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL as string,
      accounts: [process.env.PRIVATE_KEY as string],
      saveDeployments: true,
    },
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
