const { networkConfig } = require('../network-config');

task(
  'donate',
  'Donates the desired amount of given currency to the GitHub repo maintainers.'
)
  .addParam('repo', 'Link to the GitHub repository.')
  .addParam('stars', 'When given amount of stars are reached')
  .addParam('amount', 'Amount of matic to donate')
  .addParam('wallet', 'Wallet from which the donation comes from')
  .addParam('contract', 'Contract address')
  .setAction(async (taskArgs) => {
    try {
      /** @var {FunctionsConsumer} contract  */
      const contract = await ethers.getContractAt(
        'FunctionsConsumer',
        taskArgs.contract
      );
      const owner = await contract.owner();

      console.log(
        `Executed task for contract ${contract.address} with owner ${owner}`
      );
    } catch (e) {
      console.log(e.message);
    }
  });
