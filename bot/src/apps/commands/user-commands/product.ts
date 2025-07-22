import { getProducts } from '@/apps/products';
import { Product } from '@/apps/products/schemas';
import { moneyFormatToIDR } from '@/lib/utils';

import { CommandHandler } from '../types';

const priceString = (product: Product) =>
  product.discountPrice > 0
    ? `Rp. ~${moneyFormatToIDR(product.price)}~ ${moneyFormatToIDR(product.discountPrice)}`
    : `Rp. ${moneyFormatToIDR(product.price)}`;

const productCommandHandler: CommandHandler = async (chat) => {
  await chat.sendStateTyping();

  const products = await getProducts();

  const jokiBundle: Product[] = [];
  const jokiPerbintang: Product[] = [];

  products.map((product) => {
    switch (product.type) {
      case 'Joki Bundle':
        jokiBundle.push(product);
        break;
      case 'Joki Perbintang':
        jokiPerbintang.push(product);
        break;
      case 'Joki Classic':
        break;
      case 'Joki MCL':
        break;
    }
  });

  const messages: string[] = [];

  messages.push(`➥ 🛍️ _*JOKI RANKED PER PAKET*_\n`);
  messages.push(`╔━━━━━━━━━━━━━━━\n`);
  jokiBundle.map((product, i) => {
    messages.push(
      `┃╭─〔 ${product.logo} *${product.name}* 〕\n`,
      `┃┊ 🏷️ *Harga:* ${priceString(product)}\n`,
      `╠┊ 🔐 *Kode:* *${product.code}*\n`,
      `┃┊ ✍️ *Ketik:* /buy ${product.code}\n`,
      `┃╰───────────────\n`,
    );

    if (jokiBundle.length - 1 !== i) {
      messages.push(`┃\n`);
    }
  });
  messages.push(`╚━━━━━━━━━━━━━━━\n\n`);

  messages.push(`➥ 🛍️ _*JOKI RANKED PER BINTANG*_\n`);
  messages.push(`╔━━━━━━━━━━━━━━━\n`);
  jokiPerbintang.map((product, i) => {
    messages.push(
      `┃╭─〔 ${product.logo} *${product.name}* 〕\n`,
      `┃┊ 🏷️ *Harga:* ${priceString(product)}\n`,
      `╠┊ 🔐 *Kode:* *${product.code}*\n`,
      `┃┊ ✍️ *Ketik:* /buy ${product.code}\n`,
      `┃╰───────────────\n`,
    );

    if (jokiPerbintang.length - 1 !== i) {
      messages.push(`┃\n`);
    }
  });
  messages.push(`╚━━━━━━━━━━━━━━━\n`);

  await chat.sendMessage(messages.join(''));
};

export default productCommandHandler;
