import { VercelRequest, VercelResponse } from '@vercel/node';
import storage from '../server/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === "GET") {
    try {
      const missions = await storage.getAllMissions();
      res.status(200).json(missions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch missions" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
