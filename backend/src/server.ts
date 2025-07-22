import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';

import { orderRoutes } from '@/apps/orders/entry-points/api';
import { productRoutes } from '@/apps/products/entry-points/api';
import { RouteNotFound } from '@/lib/custom-errors/route-error';
import errorHandler from '@/lib/http/http-error-handler';
// import { httpLogger } from '@/lib/logger';

const app = express();

app.disable('x-powered-by');

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(httpLogger);

app.use('/product', productRoutes);
app.use('/order', orderRoutes);

app.get('/ping', (_req, res) => {
  res.status(200).json({ message: 'pong' });
});

app.use((_req: Request, _res: Response, _next: NextFunction) => {
  throw new RouteNotFound();
});

app.use(
  async (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    await errorHandler.handleError(err, res);
  },
);

export default app;
