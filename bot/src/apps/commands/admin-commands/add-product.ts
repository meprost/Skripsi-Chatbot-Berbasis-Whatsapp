import { CommandHandler } from '@/apps/commands/types';
import { sendMessageToAdmin } from '@/apps/messages/utils';

const addProductCommandHandler: CommandHandler = async () => {
  const adminWarningMessage =
    `*⚠️ COPY PESAN FORMAT ADD PRODUK DIATAS DAN ISI DENGAN BENAR! ⚠️*\n` +
    `*⚠️ HANYA ISI YANG PERLU DIISI!!! ⚠️*`;
  const addProductFormFormat =
    `📝 *FORM ADD PRODUCT* 📝\n\n` +
    `Product Name: \n` +
    `Product Price: \n` +
    `Product Discount: 0\n` +
    `Product Code: \n` +
    `Product Type: Joki Bundle\n` +
    `Product Logo: \n`;
  const productTypeFormat =
    `Contoh product type: \n\n` +
    `Joki Bundle, Joki Perbintang, Joki Classic, Joki MCL`;

  await sendMessageToAdmin(addProductFormFormat);
  await sendMessageToAdmin(productTypeFormat);
  await sendMessageToAdmin(adminWarningMessage);
};

export default addProductCommandHandler;
