import { z } from 'zod/v4';

import { CommandHandler } from '@/apps/commands/types';
import { sendMessageToAdmin } from '@/apps/messages/utils';
import { getProducts } from '@/apps/products';
import logger from '@/lib/logger';

const updateArgsProductSchema = z.string().min(1);

/**
 * TODO: GET PRODUCT BY CODE
 * */
const updateProductCommandHandler: CommandHandler = async (_chat, args) => {
  try {
    const parseProductCode = updateArgsProductSchema.safeParse(args[0]);
    if (!parseProductCode.success) {
      throw new Error('Invalid Product Code');
    }

    const availableProducts = await getProducts();
    const product = availableProducts.find(
      (p) => p.code === parseProductCode.data,
    );
    if (!product) {
      throw new Error('Product Not Found');
    }

    const adminWarningMessage =
      `*⚠️ COPY PESAN FORMAT UPDATE PRODUK DIATAS DAN ISI DENGAN BENAR! ⚠️*\n` +
      `*⚠️ HANYA GANTI YANG PERLU DIGANTI!!! ⚠️*`;
    const updateProductFormFormat =
      `📝 *FORM UPDATE PRODUCT* 📝\n\n` +
      `Product Name: ${product.name}\n` +
      `Product Price: ${product.price}\n` +
      `Product Discount: ${product.discountPrice}\n` +
      `Product Code: ${product.code}\n` +
      `Product Type: ${product.type}\n` +
      `Product Logo: ${product.logo}\n`;

    await sendMessageToAdmin(updateProductFormFormat);
    await sendMessageToAdmin(adminWarningMessage);
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err, `[Update Product Command Handler]: ${err.message}`);

      if (err.message === 'Invalid Product Code') {
        await sendMessageToAdmin('Kode produk tidak valid');
        await sendMessageToAdmin('Contoh: /update BETOL');
        return;
      }

      if (err.message === 'Product Not Found') {
        await sendMessageToAdmin('Product dengan kode tersebut tidak ada');
        return;
      }
    } else {
      logger.error(err, '[Update Product Command Handler]: UNKNOWN ERROR');

      await sendMessageToAdmin('Mbuh error nyapo boy');
    }
  }
};

export default updateProductCommandHandler;
