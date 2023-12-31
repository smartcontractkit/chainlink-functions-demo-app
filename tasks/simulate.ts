import fs from 'node:fs/promises';
import path from 'node:path';

import { task } from 'hardhat/config';
import { HARDHAT_NETWORK_NAME } from 'hardhat/plugins';

import {
  simulateRequest,
  getDecodedResultLog,
} from '../FunctionsSandboxLibrary';
import { SHARED_DON_PUBLIC_KEY } from '../networks';
import { FunctionsBillingRegistry, Ledger } from '../typechain-types';

task(
  'project:simulate',
  'Simulates an end-to-end fulfillment locally'
).setAction(async (taskArgs: [], hre) => {
  const { ethers, upgrades } = hre;

  // Simulation can only be conducted on a local fork of the blockchain
  if (hre.network.name !== HARDHAT_NETWORK_NAME) {
    throw Error(
      'Simulated requests can only be conducted using --network "hardhat"'
    );
  }
  const checkScriptPath = path.resolve(
    __dirname,
    '../',
    'functions',
    'get-wallet-and-repos-from-gist.js'
  );
  const checkScript = await fs.readFile(checkScriptPath, { encoding: 'utf-8' });

  // Deploy a mock oracle & registry contract to simulate a fulfillment
  const { oracle, registry, linkToken } = await deployMockOracle();

  // Deploy the client contract
  const clientFactory = await ethers.getContractFactory('Ledger');
  const client = await clientFactory.deploy(oracle.address);
  await client.deployTransaction.wait(1);
  const initTx = await (client as Ledger).initialize(
    oracle.address,
    '',
    checkScript
  );
  await initTx.wait(1);
  await (
    await (client as Ledger).donate('https://github.com/mbicknese/UID64', {
      value: 1_500_000_000_000,
    })
  ).wait(1);
  await (
    await (client as Ledger).donate('https://github.com/thisdot/starter.dev', {
      value: 2_100_000_000_000,
    })
  ).wait(1);
  await (
    await (client as Ledger).donate('https://github.com/mbicknese/dummy', {
      value: 400_000_000_000,
    })
  ).wait(1);

  const accounts = await ethers.getSigners();
  const deployer = accounts[0];
  // Add the wallet initiating the request to the oracle allowlist to authorize a simulated fulfillment
  const allowlistTx = await oracle.addAuthorizedSenders([deployer.address]);
  await allowlistTx.wait(1);

  // Create & fund a subscription
  const createSubscriptionTx = await registry.createSubscription();
  const createSubscriptionReceipt = await createSubscriptionTx.wait(1);
  const subscriptionId =
    createSubscriptionReceipt.events[0].args['subscriptionId'].toNumber();
  const juelsAmount = ethers.utils.parseUnits('10');
  await linkToken.transferAndCall(
    registry.address,
    juelsAmount,
    ethers.utils.defaultAbiCoder.encode(['uint64'], [subscriptionId])
  );
  // Authorize the client contract to use the subscription
  await registry.addConsumer(subscriptionId, client.address);

  // Make a request & simulate a fulfillment
  await new Promise<void>(async (resolve) => {
    // Initiate the request from the client contract
    const clientContract = clientFactory.attach(client.address);
    const requestTx = await (clientContract as Ledger).claim(
      'https://gist.github.com/mbicknese/068238d6461483d7b1eeaf20ddd870cd',
      subscriptionId
    );
    const requestTxReceipt = await requestTx.wait(1);
    const requestId = requestTxReceipt?.events?.[2]?.args?.id;
    const requestConfig = {
      source: checkScript,
      codeLocation: 0,
      codeLanguage: 0,
      numAllowedQueries: 1,
      args: [
        'https://gist.github.com/mbicknese/068238d6461483d7b1eeaf20ddd870cd',
        '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266',
      ],
      secrets: [],
    };

    // Simulating the JavaScript code locally
    console.log('\nExecuting JavaScript request source code locally...');

    const { success, result, resultLog } = await simulateRequest(requestConfig);
    console.log(`\n${resultLog}`);

    // Simulate a request fulfillment
    const accounts = await ethers.getSigners();
    const dummyTransmitter = accounts[0].address;
    const dummySigners = Array(31).fill(dummyTransmitter);

    try {
      const fulfillTx = await (
        registry as FunctionsBillingRegistry
      ).fulfillAndBill(
        requestId,
        success ? result : '0x',
        success ? '0x' : result,
        dummyTransmitter,
        dummySigners,
        4,
        100_000,
        500_000,
        {
          gasLimit: 500_000,
        }
      );
      await fulfillTx.wait(1);
    } catch (fulfillError) {
      // Catch & report any unexpected fulfillment errors
      console.log(
        '\nUnexpected error encountered when calling fulfillRequest in client contract.'
      );
      console.log(fulfillError);
      resolve();
    }

    // Listen for the OCRResponse event & log the simulated response returned to the client contract
    client.on('OCRResponse', async (eventRequestId, result, err) => {
      console.log('__Simulated On-Chain Response__');
      if (eventRequestId !== requestId) {
        throw new Error(`${eventRequestId} is not equal to ${requestId}`);
      }
      // Check for & log a successful request
      if (result !== '0x') {
        console.log(
          `Response returned to client contract represented as a hex string: ${result}\n${getDecodedResultLog(
            requestConfig,
            result
          )}`
        );
      }
      // Check for & log a request that returned an error message
      if (err !== '0x') {
        console.log(
          `Error message returned to client contract: "${Buffer.from(
            err.slice(2),
            'hex'
          )}"\n`
        );
      }
    });

    // Listen for the BillingEnd event & log the estimated billing data
    registry.on(
      'BillingEnd',
      async (
        eventRequestId: number,
        eventSubscriptionId: number,
        eventSignerPayment: string,
        eventTransmitterPayment: string,
        eventTotalCost: number,
        eventSuccess: boolean
      ) => {
        if (requestId == eventRequestId) {
          // Check for a successful request & log a message if the fulfillment was not successful
          if (!eventSuccess) {
            console.log(
              '\nError encountered when calling fulfillRequest in client contract.\n' +
                'Ensure the fulfillRequest function in the client contract is correct and the --gaslimit is sufficient.\n'
            );
          }

          resolve();
        }
      }
    );
  });
  async function deployMockOracle() {
    // Deploy mocks: LINK token & LINK/ETH price feed
    const linkTokenFactory = await ethers.getContractFactory('LinkToken');
    const linkPriceFeedFactory = await ethers.getContractFactory(
      'MockV3Aggregator'
    );
    const linkToken = await linkTokenFactory.deploy();
    const linkPriceFeed = await linkPriceFeedFactory.deploy(
      0,
      ethers.BigNumber.from(5021530000000000)
    );
    // Deploy proxy admin
    await upgrades.deployProxyAdmin();
    // Deploy the oracle contract
    const oracleFactory = await ethers.getContractFactory(
      'contracts/dev/functions/FunctionsOracle.sol:FunctionsOracle'
    );
    const oracleProxy = await upgrades.deployProxy(oracleFactory, [], {
      kind: 'transparent',
    });
    await oracleProxy.deployTransaction.wait(1);
    // Set the secrets encryption public DON key in the mock oracle contract
    await oracleProxy.setDONPublicKey('0x' + SHARED_DON_PUBLIC_KEY);
    // Deploy the mock registry billing contract
    const registryFactory = await ethers.getContractFactory(
      'contracts/dev/functions/FunctionsBillingRegistry.sol:FunctionsBillingRegistry'
    );
    const registryProxy = await upgrades.deployProxy(
      registryFactory,
      [linkToken.address, linkPriceFeed.address, oracleProxy.address],
      {
        kind: 'transparent',
      }
    );
    await registryProxy.deployTransaction.wait(1);
    // Set registry configuration
    const config = {
      maxGasLimit: 300_000,
      stalenessSeconds: 86_400,
      gasAfterPaymentCalculation: 39_173,
      weiPerUnitLink: ethers.BigNumber.from('5000000000000000'),
      gasOverhead: 519_719,
      requestTimeoutSeconds: 300,
    };
    await registryProxy.setConfig(
      config.maxGasLimit,
      config.stalenessSeconds,
      config.gasAfterPaymentCalculation,
      config.weiPerUnitLink,
      config.gasOverhead,
      config.requestTimeoutSeconds
    );
    // Set the current account as an authorized sender in the mock registry to allow for simulated local fulfillments
    const accounts = await ethers.getSigners();
    const deployer = accounts[0];
    await registryProxy.setAuthorizedSenders([
      oracleProxy.address,
      deployer.address,
    ]);
    await oracleProxy.setRegistry(registryProxy.address);
    return { oracle: oracleProxy, registry: registryProxy, linkToken };
  }
});
