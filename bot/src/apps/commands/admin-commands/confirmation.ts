import { z, ZodError } from 'zod/v4';

import { sendMessage, sendMessageToAdmin } from '@/apps/messages/utils';
import env from '@/lib/env';
import logger from '@/lib/logger';

import { CommandHandler } from '../types';

const confirmationCommandHandler: CommandHandler = async (_chat, args) => {
  try {
    const customerPhoneNumber = z
      .string()
      .transform((v) => `${v}@c.us`)
      .parse(args[0]);

    const adminConfirmationMessage =
      `Pesan konfirmasi akan dikirim kepada pelanggan\n` +
      `dengan nomor tersebut. (${customerPhoneNumber.replace('@c.us', '')})\n\n` +
      `Ketik perintah /done ${customerPhoneNumber.replace('@c.us', '')}\n` +
      `saat pesanan telah seleasi untuk mengirimkan pemberitahuan kepada pelanggan`;

    const customerConfirmationMessage =
      `Pesanan telah dikonfirmasi dan sedang diproses oleh admin!\n` +
      `Silahkan tunggu informasi lebih lanjut dari admin.\n` +
      `Hubungi nomor admin di @${env.ADMIN_PHONE_NUMBER.replace('@c.us', '')}`;

    await sendMessageToAdmin(adminConfirmationMessage);
    await sendMessage(
      customerPhoneNumber,
      customerConfirmationMessage,
      env.ADMIN_PHONE_NUMBER,
    );
  } catch (err) {
    if (err instanceof ZodError) {
      logger.warn('[Confirmation Handler]: Failed to parse phone number');

      const warningMessage =
        'tolong sertakan nomor hp,\n' +
        `contoh: /konfirmasi ${env.ADMIN_PHONE_NUMBER.replace('@c.us', '')}`;

      await sendMessageToAdmin(warningMessage);
    } else {
      logger.error(err, '[Confirmation Handler]: UNKNOWN ERROR');

      await sendMessageToAdmin('Error boy');
    }
  }
};

export default confirmationCommandHandler;
