# Chainlink Functions Reference App

This is an example dApp, designed to run on the Mumbai testnet (Polygon), that utilises [Chainlink Functions](https://docs.chain.link/chainlink-functions/). The functionality allows users to donate MATIC to their favourite GitHub repositories. Authors of those repositories can then claim their donations. Donations are made in an amount of MATIC per amount of Stars the repository has.

Chainlink Functions is used to determine the total donation amount by multiplying the MATIC amount by the star count. There's no back-end involved in the whole donation process.

**NOTE**: This example is not production ready, as edge cases are not handled.

## Usage

### Prerequisites

Before being able to deploy the application, you'll need [MetaMask](https://metamask.io/) installed and a wallet on the Mumbai testnet. The latter is used to create and manage the Ledger contract used by this dApp. Tracking interaction between accounts gives a better insight into the dApp's functioning. Therefore, using a different wallet for contract creation and dApp usage is preferable. After installing MetaMask, go to [chainlist.org](*https://chainlist.org/?testnets=true&search=polygon*) and select the Mumbai chain. This will open a prompt from MetaMask. Now either register your existing wallet or create a new account.

You'll need both MATIC and LINK for testing, deploying and funding. Testnet faucets can provide these. For example, Chainlink has [a faucet](https://faucets.chain.link/mumbai) that provides both tokens at once.

A supported Node.js version. This project has been built using Node.js hydrogen. For NVM users, simply run `nvm use`.

> **NOTE for Mac users** Apple's implementation of `tar` has the `--wildcards` flag implied. You'll either need to remove it from the package.json scripts, or use `gtar`.

### Steps

Run these from the project directory where you've cloned this repo.

1. `pnpm install`
  - No pnpm? No problem. `npm install -g pnpm` or npm / yarn classic work fine.
2. Create a `.env` file, either by making a copy of `.env.example` or starting from scratch. See the chapter [Configuration](#configuration) for more details on the available settings.
  - You'll need to set at least the `PRIVATE_KEY` variable. To get your key: click on the MetaMask icon; click the three dots; go to account details; and export your private key.
3. Generate and build all required files by running `pnpm build`. This downloads the required files, compiles the Solidity contracts and builds the Nextjs project.
4. Deploy the Ledger contract with `npx hardhat project:deploy`.
5. Store the returned address in the `NEXT_PUBLIC_CONTRACT_ADDRESS` environment variable.
6. (optional) Verify the contract. This allows you to decode the bytecode on Polygonscan.
  1. Create an account on [Polygonscan](polygonscan.com). Note that you'll need to create an account for the main network, which works just as well for the testnet.
  2. Under your account, go to "API Keys".
  3. Add a new key.
  4. Copy your token and save it as the `ETHERSCAN_API_KEY` environment variable.
  5. Verify the contract with `npx hardhat verify --constructor-args arguments.js $NEXT_PUBLIC_CONTRACT_ADDRESS`. (Replace `$NEXT_PUBLIC_CONTRACT_ADDRESS` with your contract address if you don't have the address in your shell environment).

7. Create a Chainlink Functions subscription and fund it. We have a task to simplify the basic setup and funding, run it with `npx hardhat project:fund`. For more information on how to manage your subscription, read [the official documentation](https://docs.chain.link/chainlink-functions/resources/subscriptions).
8. Store the subscription id in the `NEXT_PUBLIC_SUBSCRIPTION_ID` environment variable.
9. Run the application.
  1. Serve the build.
  2. Or run the dev server with `pnpm dev`.

### Configuration

- `PRIVATE_KEY` - Private key used for deploying contracts.
- `NEXT_PUBLIC_GA_TRACKING_ID` - Set to your Google Analytics tracking id to enable GA.
- `NEXT_PUBLIC_CONTRACT_ADDRESS` - Where the GH calculator is deployed.
- `NEXT_PUBLIC_SUBSCRIPTION_ID` - ID of the subscription which has the contract at `NEXT_PUBLIC_CONTRACT_ADDRESS` as a consumer.
- `ETHERSCAN_API_KEY` - API key for Polygonscan. Not required, it can be used to verify and read contracts.

### Scripts

- `build` - Creates a production-ready build.
- `dev` - Runs the local development server with HMR.
- `start` - Starts a server to host the build.
- `lint` - Searches for lint in the project.
- `test` - Runs the test suite; the project comes with tests for the functions.
- `update-beta` - Retrieves the latest beta files for Chainlink Functions.

## Architecture

This dApp consists of two parts: the contracts and the web UI.

Central to the web3 logic is the `Ledger` contract. It is an upgradeable and ownable contract that handles both donations and payouts. In order to verify GitHub metric data and authenticate GitHub users, it uses Chainlink Functions to make off-chain API calls. The contract can be used in a stand-alone fashion. The UI is just a simple app that allows users to interface with the contract. There is no required logic or storage in the web2 part.

### Overview

![A diagram outlining the structure of the application](./logic-overview.png)

### Donation flow

One can call the `donate` method of the `Ledger` contract directly. It requires a value to be sent along with it, which will then be stored in a new `Donation` contract.

The whole flow, however, includes making the calculation through Chainlink Functions first. The `Ledger` offers a `multiplyMetricWithEther` method which takes a repository, whether you want to use stars or forks as a metric, and the amount of MATIC to donate per target reached. When the calculation is done, the contract will emit an event and gives you the amount to donate in WEI.

The web UI takes this number and automatically calls the `donate` method with the found number.

### Payout flow

As the payout does not require additional confirmation from the end user, it consists of a single method on the `Ledger` contract. One can call `claim` with a gist URL. That gist should contain one file containing their own wallet address.

Chainlink Functions will then read that wallet address and the gist's owner (i.e., GitHub account). If the address found and the address of the requesting party does not match, the execution will stop. Otherwise, the values are returned to the contract, which, in turn, checks if it has any unclaimed donations made to a repository by the given GitHub account. These donations are paid out and removed from the list of donations to track.

### Folder Structure

- `contracts/` - Contains the GitHub calculator contract, which uses Chainlink Functions to calculate the total amount owed. It also contains the helper code provided by Chainlink.
- `functions/` - These are JavaScript scripts to be run off the chain by Chainlink Functions.
- `components`/`hooks`/`pages`/`public`/`sections`/`styles` - Are all part of the Next.JS application.
- `tasks/` - Contains the Hardhat tasks to assist in managing the dApp.

> :warning: **Disclaimer**: The code used in this Chainlink Functions quickstart template comes from Chainlink community members and has not been audited. The Chainlink team disclaims and shall have no liability with respect to any loss, malfunction, or any other result of deploying a Quickstart Template. By electing to deploy a Quickstart Template you hereby acknowledge and agree to the above.
