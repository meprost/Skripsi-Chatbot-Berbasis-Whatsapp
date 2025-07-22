import { Chat } from 'whatsapp-web.js';

import { OrderFormMessageTemplate } from '@/apps/messages/message-templates';
import { ProductType } from '@/apps/products/types';

export const sendOrderFormMessage = async (
  chat: Chat,
  productType: ProductType,
  productCode: string,
) => {
  let orderFormFormat: string = '';

  switch (productType) {
    case 'Joki Bundle':
      orderFormFormat = OrderFormMessageTemplate.jokiBundle(productCode);
      break;
    case 'Joki Perbintang':
      orderFormFormat = OrderFormMessageTemplate.jokiPerbintang(productCode);
      break;
    case 'Joki Classic':
      break;
    case 'Joki MCL':
      break;
  }

  await chat.sendStateTyping();
  await chat.sendMessage(orderFormFormat);
};
