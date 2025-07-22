import { paymentApi } from '@/lib/api';
import env from '@/lib/env';
import logger from '@/lib/logger';

import {
  AtlanticCheckDepositRequest,
  AtlanticCheckDepositResponseSchema,
  AtlanticCreateDepositRequest,
  AtlanticCreateDepositResponseSchema,
} from './type';

export const createPayment = async ({
  apiKey = env.PAYMENT_API_KEY,
  reffId,
  nominal,
  type = 'ewallet',
  metode = 'qris',
}: AtlanticCreateDepositRequest) => {
  const createDeposit = await paymentApi.post('/deposit/create', {
    api_key: apiKey,
    reff_id: reffId,
    nominal,
    type,
    metode,
  });

  if (!createDeposit.data) {
    throw new Error('Create paymeent error');
  }

  const createDepositResponse = AtlanticCreateDepositResponseSchema.parse(
    createDeposit.data,
  );

  logger
    .child({ module: 'createPayment' })
    .debug({ ...createDepositResponse }, '[Response Data]: Create Payment');

  return createDepositResponse;
};

export const checkPayment = async ({
  apiKey = env.PAYMENT_API_KEY,
  id,
}: AtlanticCheckDepositRequest) => {
  const checkDeposit = await paymentApi.post('/deposit/status', {
    api_key: apiKey,
    id,
  });

  if (!checkDeposit.data.status) {
    throw new Error('Check Payment Error');
  }

  const checkPaymentResponse = AtlanticCheckDepositResponseSchema.parse(
    checkDeposit.data,
  );

  logger
    .child({ module: 'checkPayment' })
    .debug({ ...checkPaymentResponse }, '[Response Data]: Check Payment');

  return checkPaymentResponse;
};
