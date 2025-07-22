import { Message } from 'whatsapp-web.js';

import updateProductFormHandler from '@/apps/forms/admin-forms/update-product';
import logger from '@/lib/logger';

import addProductFormHandler from './admin-forms/add-product';

const adminFormHandler = async (message: Message) => {
  const body = message.body;

  logger.info('[Admin Form]');

  if (body.includes('FORM ADD PRODUCT')) {
    await addProductFormHandler(message);

    return;
  }

  if (body.includes('FORM UPDATE PRODUCT')) {
    await updateProductFormHandler(message);

    return;
  }
};

export default adminFormHandler;
