import { Message } from 'whatsapp-web.js';
import { z, ZodError } from 'zod/v4';

import { FormData } from '@/apps/forms/types';
import { sendMessageToAdmin } from '@/apps/messages/utils';
import { updateProduct } from '@/apps/products';
import logger from '@/lib/logger';

const updateProductSchema = z.object({
  name: z.string(),
  price: z.coerce.number(),
  discountPrice: z.coerce.number(),
  code: z.string(),
  type: z.literal([
    'Joki Bundle',
    'Joki Perbintang',
    'Joki Classic',
    'Joki MCL',
  ]),
  logo: z.string(),
});

const updateProductFormHandler = async (message: Message) => {
  try {
    logger.info('[Update Product Form Handler]');

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

    const productUpdate = updateProductSchema.parse({
      name: formData['Product Name'],
      price: formData['Product Price'],
      discountPrice: formData['Product Discount'],
      code: formData['Product Code'],
      type: formData['Product Type'],
      logo: formData['Product Logo'],
    });

    const updatedProduct = await updateProduct(productUpdate);

    const updatedProductFormFormat =
      `📝 *PRODUCT UPDATED!* 📝\n\n` +
      `Product Name: ${updatedProduct.name}\n` +
      `Product Price: ${updatedProduct.price}\n` +
      `Product Discount: ${updatedProduct.discountPrice}\n` +
      `Product Code: ${updatedProduct.code}\n` +
      `Product Type: ${updatedProduct.type}\n` +
      `Product Logo: ${updatedProduct.logo}\n`;

    sendMessageToAdmin(updatedProductFormFormat);
  } catch (err) {
    if (err instanceof Error || err instanceof ZodError) {
      if (err.message === 'Validation Error') {
        logger.error(err, '[Update Product Form Handler]: Parse form error');
        const adminErrorMessage = `Tolong masukkan format form update produk yang valid`;

        await sendMessageToAdmin(adminErrorMessage);
        return;
      }
    } else {
      logger.error(err, '[Update Product Form Handler]: UNKNOWN ERROR');
      const adminErrorMessage = `Error boy`;

      await sendMessageToAdmin(adminErrorMessage);
    }
  }
};

export default updateProductFormHandler;
