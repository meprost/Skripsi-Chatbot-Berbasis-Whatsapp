import { Message } from 'whatsapp-web.js';
import { z, ZodError } from 'zod/v4';

import { userContext } from '@/apps/context/user-context';
import type { FormData } from '@/apps/forms/types';
import { sendMessageToAdmin } from '@/apps/messages/utils';
import { createOrderData } from '@/apps/orders';
import env from '@/lib/env';
import logger from '@/lib/logger';

const createOrderDataSchema = z.object({
  orderId: z.number(),
  nickname: z.string(),
  accountId: z.string(),
  loginMethod: z.string(),
  email: z.email(),
  password: z.string(),
  heroesRequest: z.string(),
});

const orderFormHandler = async (message: Message) => {
  try {
    logger.info('[Order Form Handler]');

    const messageLines = message.body.split('\n');
    const formData: FormData = {};
    const formFieldRegex = /^([\w\s()+/]+):\s*(.+)$/;

    for (const message of messageLines) {
      const match = message.match(formFieldRegex);

      if (match) {
        const key = match[1]?.trim();
        const value = match[2]?.trim();

        if (!key || !value) {
          throw new Error('Validation Error');
        }

        formData[key] = value;
      }
    }

    const chat = await message.getChat();
    await chat.sendStateTyping();
    const userId = chat.id.user;

    const context = userContext.getContext(userId);
    if (!context?.currentOrder?.orderId) {
      await chat.sendMessage(`Silahkan melakukan pembayaran terlebih dahulu!`);
      return;
    }

    const parseFormData = createOrderDataSchema.parse({
      orderId: context.currentOrder.orderId,
      nickname: formData['Nickname'],
      accountId: formData['ID Akun'],
      loginMethod: formData['Login'],
      email: formData['Email'],
      password: formData['Password'],
      heroesRequest: formData['Req Hero (Max 3 Hero)'],
    });

    await createOrderData(parseFormData);
    userContext.clearContext(userId);

    const customerPhoneNumber = message.from.replace('@c.us', '');

    const formMessageForAdmin: string[] = [];
    formMessageForAdmin.push(`Pesanan baru dari ${customerPhoneNumber}: \n\n`);
    for (const key in formData) {
      formMessageForAdmin.push(`${key}: ${formData[key]}\n`);
    }
    formMessageForAdmin.push(
      `\n\nSilahkan ketik /konfirmasi ${customerPhoneNumber} untuk mengkonfirmasi pesanan.`,
    );

    const adminMessage = `Jangan lupa ketik /done ${customerPhoneNumber} jika pesanan sudah selesai`;
    const customerMessage =
      '*FORM PEMESANAN* telah dikirim ke admin, silahkan menunggu konfirmasi dari admin!';

    await sendMessageToAdmin(formMessageForAdmin.join(''));
    await sendMessageToAdmin(adminMessage);
    await chat.sendMessage(customerMessage);
  } catch (err) {
    const chat = await message.getChat();

    if (
      err instanceof ZodError ||
      (err instanceof Error && err.message === 'Validation Error')
    ) {
      logger.error(err, '[Order Form Handler]: Parse form error');
      const warningMessage = `Tolong masukkan format form pemesanan yang valid!`;

      await chat.sendMessage(warningMessage);
      return;
    }

    logger.error(err, '[Order Form Handler]: UNKNOWN ERROR');

    const warningMessage =
      `Bot sedang mengalami error, tolong hubungi admin di\n` +
      `@${env.ADMIN_PHONE_NUMBER.replace('@c.us', '')} untuk info lebih lanjut`;

    await chat.sendMessage(warningMessage, {
      mentions: [env.ADMIN_PHONE_NUMBER],
    });
  }
};

export default orderFormHandler;
