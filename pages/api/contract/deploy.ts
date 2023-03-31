import { NextApiRequest, NextApiResponse } from 'next';

type ResponseData =
  | {
      message: string;
    }
  | { error: string };

export default async function depolyContract(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    // const result = await someAsyncOperation();
    res.status(200).json({ message: 'Hello from Next.js!' });
  } catch (err) {
    res.status(500).json({ error: 'failed to load data' });
  }
}
