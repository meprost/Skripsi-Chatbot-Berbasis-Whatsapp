import { Router } from 'express';

import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from '@/apps/products/entry-points/api/controller';

const r = Router();

r.get('/', getProducts);
r.post('/', createProduct);
r.put('/', updateProduct);
// eslint-disable-next-line
r.delete('/', deleteProduct);

export { r as productRoutes };
