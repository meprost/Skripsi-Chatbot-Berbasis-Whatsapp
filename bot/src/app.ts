import qrcode from 'qrcode-terminal';

import adminMessageHandler from './apps/messages/admin-message';
import userMessageHandler from './apps/messages/user-message';
import env from './lib/env';
import logger from './lib/logger';
import whatsappClient from './lib/whatsapp-client';
import { UserRole } from './types/user';

export default async function initializeWhatsappClient() {
  /**
   * SHOW THE QR TO THE TERMINAL
   * */
  whatsappClient.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
  });

  /**
   * LOG THE AUTH FAILURE MESSAGE
   * */
  whatsappClient.on('auth_failure', (message) => {
    logger.error('Authentication Failure', message);
  });

  /**
   * LOG ON AUTH SUCCEED
   * */
  whatsappClient.on('authenticated', () => {
    logger.info('Authentication Success');
  });

  /**
   * LOG ON DISCONNECTION
   * */
  whatsappClient.on('disconnected', (reason) => {
    if (reason === 'LOGOUT') {
      logger.error('Whatsapp Client Logged Out');
    } else {
      logger.error('Whatsapp Client Disconnected');
    }
  });

  /**
   * LOG ON WHATSAPP STATE CHANGE
   * */
  whatsappClient.on('change_state', (state) => {
    logger.warn(`Connection State Change, state: ${state}`);
  });

  /**
   * LOG LOADING MESSAGE
   * */
  whatsappClient.on('loading_screen', (percentage, message) => {
    logger.info(`Whatsapp Client loading: ${percentage}%, message: ${message}`);
  });

  /**
   * LOG ON WHATSAPP CLIENT READY
   * */
  whatsappClient.on('ready', () => {
    logger.info('Whatsapp Client Ready');
  });

  /**
   * MESSAGE EVENT LISTENER
   * */
  whatsappClient.on('message', async (message) => {
    const userRole: UserRole =
      env.ADMIN_PHONE_NUMBER === message.from ? 'ADMIN' : 'USER';

    try {
      /**
       * Skip every messages from group and broadcast
       * */
      if (message.author || message.from === 'status@broadcast') {
        logger.warn(
          {
            from: message.from,
          },
          '[Skipping Message]',
        );

        return;
      }

      /**
       * Specific role message handler
       * Every message that known by the bot goes here
       * */
      if (userRole === 'USER') {
        await userMessageHandler(message);
        return;
      }

      if (userRole === 'ADMIN') {
        await adminMessageHandler(message);
        return;
      }
    } catch (err) {
      logger.error(err, '[Message Handler Error]');
    }
  });

  whatsappClient.initialize();
}
