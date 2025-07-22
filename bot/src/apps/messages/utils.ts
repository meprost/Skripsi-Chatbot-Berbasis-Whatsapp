import env from '@/lib/env';
import whatsappClient from '@/lib/whatsapp-client';

export const sendMessageToAdmin = (message: string) =>
  whatsappClient.sendMessage(env.ADMIN_PHONE_NUMBER, message);

export const sendMessage = (
  phoneNumber: string,
  message: string,
  mentions?: string,
) =>
  whatsappClient.sendMessage(phoneNumber, message, {
    mentions: mentions ? [mentions] : undefined,
  });
