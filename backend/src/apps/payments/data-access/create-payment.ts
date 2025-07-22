import db from '@/lib/db';
import { payments } from '@/lib/db/schema/payments';

export const createPayment = (orderId: number, amount: number) =>
  db
    .insert(payments)
    .values({
      orderId,
      amount,
    })
    .returning();
