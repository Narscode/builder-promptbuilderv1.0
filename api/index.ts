import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as express from 'express';
import { registerRoutes } from '../server/routes';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Initialize routes
let routesRegistered = false;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!routesRegistered) {
    await registerRoutes(app as any);
    routesRegistered = true;
  }

  // Handle the request with Express
  return new Promise((resolve) => {
    app(req as any, res as any, () => {
      resolve(undefined);
    });
  });
}