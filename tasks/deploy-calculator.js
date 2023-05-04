/* eslint-env node */
/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs/promises');
const path = require('node:path');

const { networkConfig } = require('../network-config');

task(
  'deploy-calculator',
  'Deploys the GitHub calculator smart contract.'
).setAction(async () => {
  try {
    const source = await fs.readFile(
      path.join(__dirname, '../Functions-GitHub-calculation.js'),
      { encoding: 'utf8' }
    );
    console.log(source);

    /** @var {FunctionsConsumer} contract  */
    const factory = await ethers.getContractFactory('GitHubFunctions');
    const contract = await factory.deploy(
      networkConfig.mumbai.functionsOracleProxy,
      source
    );
    await contract.deployTransaction.wait(1);

    console.log(`Deployed contract to ${contract.address}`);
  } catch (e) {
    console.log(e.message);
  }
});
