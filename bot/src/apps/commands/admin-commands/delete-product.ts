import { z } from 'zod/v4';

import { CommandHandler } from '@/apps/commands/types';
import { sendMessageToAdmin } from '@/apps/messages/utils';
import { deleteProduct, getProducts } from '@/apps/products';
import logger from '@/lib/logger';

const deleteArgsProductSchema = z.string().min(1);

const deleteProductCommandHandler: CommandHandler = async (_chat, args) => {
  try {
    const parseProductCode = deleteArgsProductSchema.safeParse(args[0]);
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

    const deletedProduct = await deleteProduct({ code: product.code });

    const adminMessage =
      `*Produk dengan kode: ${deletedProduct.code}*\n` +
      `*telah dihapus!*\n\n` +
      `Gunakan perintah /add lagi untuk\n` +
      `menambahkan produk kembali!`;

    await sendMessageToAdmin(adminMessage);
  } catch (err) {
    if (err instanceof Error) {
      logger.error(err, `[Delete Product Command Handler]: ${err.message}`);

      if (err.message === 'Invalid Product Code') {
        await sendMessageToAdmin('Kode produk tidak valid');
        await sendMessageToAdmin('Contoh: /delete BETOL');
        return;
      }

      if (err.message === 'Product Not Found') {
        await sendMessageToAdmin('Product dengan kode tersebut tidak ada');
        return;
      }
    } else {
      logger.error(err, '[Delete Product Command Handler]: UNKNOWN ERROR');

      await sendMessageToAdmin('Mbuh error nyapo boy');
    }
  }
};

export default deleteProductCommandHandler;
