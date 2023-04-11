import { NextApiRequest, NextApiResponse } from 'next';
// @ts-ignore
import { run, ethers } from 'hardhat';
import { FunctionsConsumer } from '../../../typechain-types';

type ResponseData =
  | {
      message: string;
    }
  | { error: string }
  | string;

const oracleAddress = '0xeA6721aC65BCeD841B8ec3fc5fEdeA6141a0aDE4'; // hardcoded Mumbai oracle
const contractName = 'FunctionsConsumer';

export default async function deployContract(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== 'POST') {
    res.status(404).send('This page could not be found.');
    return;
  }

  const { repo, stars, amount, wallet } = req.body;
  // TODO: Sanitize inputs
  if (!repo || !stars || !amount || !wallet) {
    res
      .status(422)
      .send(
        'Please be logged in and send a repo, amount of stars, and amount to donate.'
      );
    return;
  }

  try {
    const factory = await ethers.getContractFactory(contractName);
    const functionsContract: FunctionsConsumer = await factory.deploy(
      oracleAddress
    );
    await functionsContract.deployTransaction.wait();

    await run('donate', {
      repo,
      stars,
      amount,
      wallet,
      contract: functionsContract.address,
    });

    res
      .status(200)
      .json({ message: `Deployed donation to ${functionsContract.address}.` });
  } catch (err) {
    if (!(err instanceof Error)) throw err;
    res.status(500).json({ error: err.message });
  }
}

export const config = {
  api: {},
};
