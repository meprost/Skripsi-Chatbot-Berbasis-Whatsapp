import { MessageMedia } from 'whatsapp-web.js';
import { z } from 'zod/v4';

import { CommandHandler } from '@/apps/commands/types';
import { clearOrderId, setOrderId } from '@/apps/context/user-context';
import { createOrder } from '@/apps/orders';
import { sendOrderFormMessage } from '@/apps/orders/utilts';
import { checkPayment, createPayment } from '@/apps/payments/atlantic-pedia';
import { getProducts } from '@/apps/products';
import logger from '@/lib/logger';
import { getCurrentTimeAndDate, moneyFormatToIDR } from '@/lib/utils';

const qtyArgsSchema = z.coerce.number();

const buyCommandHandler: CommandHandler = async (chat, args) => {
  await chat.sendStateTyping();

  /* TODO: ADD QTY */
  const parseProductCode = z.string().safeParse(args[0]);
  if (!parseProductCode.success) {
    throw new Error('Failed to parse product code on buy command handler');
  }

  const productList = await getProducts();
  const product = productList.find(
    (product) => product.code === parseProductCode.data,
  );

  if (!product) {
    const warningMessage =
      `Produk dengan kode *${parseProductCode.data}* tidak dapat ditemukan,\n` +
      `Silahkan ketik */produk* untuk melihat semua produk/layanan yang tersedia`;

    await chat.sendMessage(warningMessage);
    return;
  }

  let qty: number = 1;
  if (product.type === 'Joki Perbintang') {
    const parseQty = qtyArgsSchema.safeParse(args[1]);

    if (!parseQty.success) {
      const parseErrorMessage =
        `Mohon masukkan jumlah bintang yang akan diorder, contoh: \n` +
        `/buy MASTER 4`;

      await chat.sendMessage(parseErrorMessage);
      return;
    }

    qty = parseQty.data;
  }

  const waitForQrMessage = await chat.sendMessage(
    'Sedang menggenerate QR code...',
  );
  await chat.sendStateTyping();

  const createdOrder = await createOrder(product.code);
  setOrderId(chat.id.user, createdOrder.orderId);

  const createdPayment = await createPayment({
    nominal:
      product.type === 'Joki Perbintang'
        ? (product.discountPrice > 0 ? product.discountPrice : product.price) *
            qty +
          parseFloat(
            (
              (product.discountPrice > 0
                ? product.discountPrice
                : product.price) *
              qty *
              0.02
            ).toFixed(0),
          )
        : createdOrder.totalPrice,
    reffId: createdOrder.orderReference,
  });

  // await chat.sendMessage(createPayment.toString())

  const qris = await MessageMedia.fromUrl(createdPayment.data.qrImage, {
    unsafeMime: true,
  });

  const { currentTime, currentDate } = getCurrentTimeAndDate(
    new Date(createdOrder.orderedAt),
  );

  const qrImageCaption =
    `Menunggu Pembayaran ⏳\n\n` +
    `*・Order Ref :* ${createdOrder.orderReference}\n` +
    `*・Kode Produk :* ${createdOrder.productCode}\n` +
    `*・Nama Produk :* ${createdOrder.productName}\n` +
    `*・Biaya Admin :* ${moneyFormatToIDR(
      product.type === 'Joki Perbintang'
        ? parseFloat(
            (
              (product.discountPrice > 0
                ? product.discountPrice
                : product.price) *
              qty *
              0.02
            ).toFixed(0),
          )
        : createdOrder.additionalPrice,
    )}\n` +
    `*・Total Harga :* ${moneyFormatToIDR(
      product.type === 'Joki Perbintang'
        ? product.price * qty +
            parseFloat(
              (
                (product.discountPrice > 0
                  ? product.discountPrice
                  : product.price) *
                qty *
                0.02
              ).toFixed(0),
            )
        : createdOrder.totalPrice,
    )}\n` +
    `*・Waktu :* ${currentTime}\n` +
    `*・Tanggal :* ${currentDate}\n`;

  const qrImageMessage = await chat.sendMessage(qris, {
    caption: qrImageCaption,
  });

  await waitForQrMessage.delete(true, true);

  /**
   * Polling and send format
   * */
  let totalPolling = 0;
  const pollingInterval = 5000;

  const intervalId = setInterval(async () => {
    try {
      const checkPaymentResponse = await checkPayment({
        id: createdPayment.data.id,
      });

      totalPolling++;
      if (totalPolling >= 120) {
        clearInterval(intervalId);
        clearOrderId(chat.id.user);

        await qrImageMessage.delete(true, true);

        const warningMessage =
          `Waktu pembayaran telah habis, silahkan melakukan\n` +
          `pemesanan kembali agar mendapatkan QR kembali`;

        await chat.sendMessage(warningMessage);
        return;
      }

      if (checkPaymentResponse.data.status === 'processing') {
        // send format
        clearInterval(intervalId);

        await qrImageMessage.delete(true, true);

        await chat.sendMessage('Pembayaran telah berhasil!');

        await sendOrderFormMessage(
          chat,
          createdOrder.productType,
          createdOrder.productCode,
        );

        const warningMessage =
          `*⚠️ COPY PESAN FORMAT PEMESANAN DIATAS DAN ISI DENGAN BENAR! ⚠️*\n` +
          `*⚠️ JANGAN SAMPAI MENGGANTI FORMAT PEMESANAN!!! ⚠️*`;

        await chat.sendMessage(warningMessage);
        return;
      }

      if (checkPaymentResponse.data.status === 'expired') {
        clearInterval(intervalId);
        clearOrderId(chat.id.user);

        const warningMessage =
          `Waktu pembayaran telah habis, silahkan melakukan\n` +
          `pemesanan kembali agar mendapatkan QR kembali`;

        await chat.sendMessage(warningMessage);
        return;
      }
    } catch (err) {
      if (err instanceof Error) {
        logger
          .child({ module: 'buyCommandHandler' })
          .error({ ...err }, '[Buy Handler]: Polling Error');
      }

      clearInterval(intervalId);

      throw new Error('Error polling check payment');
    }
  }, pollingInterval);
};

export default buyCommandHandler;
