import { Router } from 'express';

import {
  createOrderDataHandler,
  createOrderHandler,
} from '@/apps/orders/entry-points/api/controller';

const r = Router();

r.post('/', createOrderHandler);
r.post('/data', createOrderDataHandler);

export { r as orderRoutes };
