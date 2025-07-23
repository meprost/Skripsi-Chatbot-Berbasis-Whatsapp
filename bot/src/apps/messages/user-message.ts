import { AxiosError } from 'axios';
import { Message } from 'whatsapp-web.js';

import userFormHandler from '@/apps/forms/user-form-handler';
import logger from '@/lib/logger';

import userCommandHandler from '../commands/user-command-handler';

const userMessageHandler = async (message: Message) => {
  try {
    if (message.body.startsWith('/')) {
      await userCommandHandler(message);

      return;
    }

    if (message.body.includes('FORM')) {
      await userFormHandler(message);

      return;
    }

    message.reply(
      'Silahkan ketik */menu* untuk melihat perintah yang ada di bot!!!',
    );
  } catch (err) {
    if (err instanceof AxiosError) {
      logger.error(
        {
          errName: err.name,
          errMessage: err.message,
          request: err.response?.request,
          status: err.response?.status,
          data: err.response?.data,
        },
        '[Api Error]',
      );

      return;
    }

    if (err instanceof Error) {
      logger.error(
        {
          errName: err.name,
          errMessage: err.message,
        },
        '[User Message]: Unknown Error',
      );

      return;
    }

    message.reply('error bang');
  }
};

export default userMessageHandler;
