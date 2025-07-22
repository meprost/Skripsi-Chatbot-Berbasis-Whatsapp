import { z, ZodError } from 'zod/v4';

import { sendMessage, sendMessageToAdmin } from '@/apps/messages/utils';
import env from '@/lib/env';
import logger from '@/lib/logger';

import { CommandHandler } from '../types';

const doneCommandHandler: CommandHandler = async (_chat, args) => {
  try {
    const customerPhoneNumber = z
      .string()
      .transform((v) => `${v}@c.us`)
      .parse(args[0]);

    const adminDoneMessage =
      `Pesan konfirmasi penyelesaian pesanan\n` +
      `telah dikirimkan kepada pelanggan\n` +
      `dengan nomor: ${customerPhoneNumber.replace('@c.us', '')}`;
    const customerDoneMessage =
      `*Pesanan telah selesai!*\n\n` +
      `Silahkan periksa kembali akun anda, jika ada pertanyaan lebih lanjut \n` +
      `silahkan hubungi nomor admin di @${env.ADMIN_PHONE_NUMBER.replace('@c.us', '')}`;

    await sendMessageToAdmin(adminDoneMessage);
    await sendMessage(
      customerPhoneNumber,
      customerDoneMessage,
      env.ADMIN_PHONE_NUMBER,
    );
  } catch (err) {
    if (err instanceof ZodError) {
      logger.warn('[Done Handler]: Failed to parse phone number');

      const warningMessage =
        'tolong sertakan nomor hp,\n' +
        `contoh: /done ${env.ADMIN_PHONE_NUMBER.replace('@c.us', '')}`;

      await sendMessageToAdmin(warningMessage);
    } else {
      logger.error(err, '[Done Handler]: UNKNOWN ERROR');

      await sendMessageToAdmin('Error boy');
    }
  }
};

export default doneCommandHandler;
