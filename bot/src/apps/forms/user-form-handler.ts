import { Message } from 'whatsapp-web.js';

import orderFormHandler from '@/apps/forms/user-forms/order';
import logger from '@/lib/logger';

const userFormHandler = async (message: Message) => {
  const body = message.body;

  logger.info('[User Form]');

  if (body.includes('FORM PEMESANAN')) {
    await orderFormHandler(message);
    return;
  }
};

export default userFormHandler;
