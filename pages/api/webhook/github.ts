import { NextApiRequest, NextApiResponse } from 'next';
import { buffer } from 'micro';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const body = (await buffer(req)).toString();
  const data = JSON.parse(body);
  const signature = req.headers['github-sig']?.toString();
};

export const config = {
  api: {
    bodyParser: false,
  },
};
