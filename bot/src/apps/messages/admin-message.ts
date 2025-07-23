import { Message } from 'whatsapp-web.js';

import logger from '@/lib/logger';

import adminCommandHandler from '../commands/admin-command-handler';
import adminFormHandler from '../forms/admin-form-handler';

import { sendMessageToAdmin } from './utils';

const adminMessageHandler = async (message: Message) => {
  try {
    if (message.body.startsWith('/')) {
      await adminCommandHandler(message);

      return;
    }

    if (message.body.includes('FORM')) {
      await adminFormHandler(message);

      return;
    }

    await sendMessageToAdmin(
      'Silahkan ketik */menu* untuk melihat perintah untuk admin!!!',
    );
  } catch (err) {
    logger.error(err, '[Admin Message Handler]: Unknown Error');
  }
};

export default adminMessageHandler;
