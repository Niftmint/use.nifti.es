import { NextApiRequest, NextApiResponse } from 'next';

export function nope(res: NextApiResponse, status: number, message: string) {
  return res.status(status).json({ message });
}

export function yup(res: NextApiResponse, body: Record<string, any>) {
  return res.status(200).json(body);
}

export function guardOnlyGet(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return nope(res, 400, `<dog fetch meme> No ${req.method}. Only GET.`);
}

export function handler(handle: (req: NextApiRequest, res: NextApiResponse) => Promise<unknown>) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await handle(req, res);
    } catch (error) {
      console.error(error);
      const message =
        process.env.NODE_ENV === 'development' ? error.message : 'Internal Server Error';
      return nope(res, 500, message);
    }
  };
}
