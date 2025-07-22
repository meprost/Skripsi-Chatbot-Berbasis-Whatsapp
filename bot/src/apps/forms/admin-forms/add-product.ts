import { Message } from 'whatsapp-web.js';
import { z, ZodError } from 'zod/v4';

import { FormData } from '@/apps/forms/types';
import { sendMessageToAdmin } from '@/apps/messages/utils';
import { createProduct } from '@/apps/products';
import logger from '@/lib/logger';

const addProductSchema = z.object({
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

const addProductFormHandler = async (message: Message) => {
  try {
    logger.info('[Add Product Form Handler]');

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

    const productInfo = addProductSchema.parse({
      name: formData['Product Name'],
      price: formData['Product Price'],
      discountPrice: formData['Product Discount'],
      code: formData['Product Code'],
      type: formData['Product Type'],
      logo: formData['Product Logo'],
    });

    const createdProduct = await createProduct(productInfo);

    const newProductFormFormat =
      `📝 *NEW PRODUCT ADDED!* 📝\n\n` +
      `Product Name: ${createdProduct.name}\n` +
      `Product Price: ${createdProduct.price}\n` +
      `Product Discount: ${createdProduct.discountPrice}\n` +
      `Product Code: ${createdProduct.code}\n` +
      `Product Type: ${createdProduct.type}\n` +
      `Product Logo: ${createdProduct.logo}\n`;

    await sendMessageToAdmin(newProductFormFormat);
  } catch (err) {
    if (
      err instanceof ZodError ||
      (err instanceof Error && err.message === 'Validation Error')
    ) {
      logger.error(err, '[Add Product Form Handler]: Parse form error');
      const adminErrorMessage = `Tolong masukkan format form produk yang valid`;

      await sendMessageToAdmin(adminErrorMessage);
    } else {
      logger.error(err, '[Add Product Form Handler]: UNKNOWN ERROR');
      const adminErrorMessage = `Error boy`;

      await sendMessageToAdmin(adminErrorMessage);
    }
  }
};

export default addProductFormHandler;
