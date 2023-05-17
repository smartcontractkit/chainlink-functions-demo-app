import { task } from 'hardhat/config';
import { networks } from '../networks';

task(
  'project:fund',
  'Subscribes to Chainlink Functions and ensures the subscription is funded'
)
  .addOptionalParam('address', 'Where the current proxy is deployed')
  .addOptionalParam('subscription', 'ID of existing subscription')
  .addOptionalParam('amount', 'Amount of LINK to add to the subscription', '5')
  .setAction(async (taskArgs, { network, ethers, upgrades }) => {
    const contractAddress =
      taskArgs.address || process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;
    const networkConfig = networks[network.name];
    let subscriptionId =
      taskArgs.subscription || process.env.NEXT_PUBLIC_SUBSCRIPTION_ID;

    if (!contractAddress) {
      throw new Error('Cannot fund without knowing the contract address');
    }
    if (networkConfig == null) {
      throw new Error(
        `Network ${network.name} is not configured to work with this project`
      );
    }

    const billingRegistry = await ethers.getContractAt(
      'FunctionsBillingRegistry',
      networkConfig.functionsBillingRegistryProxy
    );
    const linkToken = await ethers.getContractAt(
      'LinkToken',
      networkConfig.linkToken
    );

    if (!subscriptionId) {
      const createSubscriptionTx = await billingRegistry.createSubscription();
      const createSubscriptionReceipt = await createSubscriptionTx.wait();
      subscriptionId =
        createSubscriptionReceipt.events[0].args['subscriptionId'];

      const addTx = await billingRegistry.addConsumer(
        subscriptionId,
        contractAddress
      );
      await addTx.wait(1);
    }

    // fund subscription
    await (
      await linkToken.transferAndCall(
        networks[network.name].functionsBillingRegistryProxy,
        ethers.utils.parseUnits(taskArgs.amount),
        ethers.utils.defaultAbiCoder.encode(['uint64'], [subscriptionId])
      )
    ).wait(1);
    console.log(
      `Subscription ${subscriptionId} funded with ${taskArgs.amount} LINK`
    );
  });
