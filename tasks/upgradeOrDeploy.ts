import { task } from 'hardhat/config';
import dotenv from 'dotenv';
dotenv.config();

import { networks } from '../networks';
import { Ledger } from '../typechain-types';
import path from 'node:path';
import fs from 'node:fs/promises';

task(
  'project:deploy',
  'Deploys or upgrades the latest version of the Ledger and Donation'
)
  .addOptionalParam('address', 'Where the current proxy is deployed')
  .setAction(async (taskArgs, { network, ethers, upgrades }) => {
    const proxyAddress =
      taskArgs.address || process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    const factory = await ethers.getContractFactory('Ledger');
    const functionsPath = path.resolve(__dirname, '../', 'functions');
    const checkScriptPath = path.resolve(
      functionsPath,
      'get-wallet-and-repos-from-gist.js'
    );
    const calculateScriptPath = path.resolve(
      functionsPath,
      'github-metric-times-ether.js'
    );
    const checkScript = await fs.readFile(checkScriptPath, {
      encoding: 'utf-8',
    });
    const calculateScript = await fs.readFile(calculateScriptPath, {
      encoding: 'utf-8',
    });

    if (!proxyAddress) {
      const ledger = await upgrades.deployProxy(
        factory,
        [
          networks?.[network.name].functionsOracleProxy,
          calculateScript,
          checkScript,
        ],
        {
          initializer: 'initialize',
          constructorArgs: [networks?.[network.name].functionsOracleProxy],
          unsafeAllow: ['constructor'],
          kind: 'uups',
        }
      );
      await ledger.deployed();

      console.log('Ledger deployed to:', ledger.address);
    } else {
      const ledger = await upgrades.upgradeProxy(proxyAddress, factory, {
        constructorArgs: [networks?.[network.name].functionsOracleProxy],
        unsafeAllow: ['constructor'],
        kind: 'uups',
      });
      const version = await (ledger as Ledger).getVersion();

      console.log(`Ledger upgraded to version ${version} at ${proxyAddress}`);
    }
  });
