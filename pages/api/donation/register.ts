import { randomUUID } from 'node:crypto';
import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@lib/prisma';
export default async function registerDonation(
  req: NextApiRequest,
  res: NextApiResponse<undefined | string>
) {
  if (req.method !== 'POST') {
    res.status(404).send('This page could not be found.');
    return;
  }
  const { repo, stars, amount } = req.body;
  if (!repo || +stars <= 0 || !amount) {
    res
      .status(422)
      .send('Please send a valid repo, number of stars and amount.');
    return;
  }

  // This is where one would validate the pledge to have actually been transferred

  const data = {
    id: randomUUID(),
    repo,
    stars,
    amount,
  };
  await prisma.donation.create({ data });

  res.status(204).send(undefined);
}
