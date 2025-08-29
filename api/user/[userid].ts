import { VercelRequest, VercelResponse } from '@vercel/node';
import storage from '../../../server/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { userId } = req.query;
  if (req.method === "GET") {
    try {
      const user = await storage.getUser(userId as string);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
