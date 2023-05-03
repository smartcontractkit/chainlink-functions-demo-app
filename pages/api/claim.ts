import { getServerSession } from 'next-auth/next';
import { createOAuthAppAuth } from '@octokit/auth-oauth-app';
import { GithubProfile } from 'next-auth/providers/github';
import { NextApiRequest, NextApiResponse } from 'next';
import { Octokit } from 'octokit';

import prisma from '@lib/prisma';
import { authOptions } from './auth/[...nextauth]';
import { ethers } from 'ethers';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).end();
  }
  if (!req.body.wallet) {
    return res.status(422).send('We need a wallet');
  }

  const octokit = new Octokit({
    authStrategy: createOAuthAppAuth,
    auth: {
      clientId: process.env.GITHUB_OAUTH_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_OAUTH_CLIENT_SECRET as string,
    },
  });
  const {
    data: { login },
  } = await octokit.request('GET /user/' + session.user.id);
  const repos = (
    await octokit.request('GET /users/' + login + '/repos')
  ).data.map((repo: GithubProfile) => `https://github.com/${repo.full_name}`);

  const donations = await prisma.donation.findMany({
    where: {
      AND: [
        {
          repo: {
            in: repos,
          },
        },
        { claimedAt: { isSet: false } },
      ],
    },
  });
  const value =
    '0x' +
    donations
      .reduce((sum, donation) => sum + parseInt(donation.amount, 16), 0)
      .toString(16);

  const provider = new ethers.providers.InfuraProvider('maticmum');
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || '');
  const signer = wallet.connect(provider);

  if (value !== '0x0') {
    await signer.sendTransaction({
      to: req.body.wallet,
      value,
    });
    await prisma.donation.updateMany({
      where: {
        id: {
          in: donations.map((donation) => donation.id),
        },
      },
      data: {
        claimedAt: new Date(),
      },
    });
  }

  res.end(JSON.stringify({ value }));
};
