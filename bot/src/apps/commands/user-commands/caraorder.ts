import { MessageMedia } from 'whatsapp-web.js';

import { CommandHandler } from '../types';

const caraOrderCommandHandler: CommandHandler = async (chat) => {
  await chat.sendStateTyping();

  const video = MessageMedia.fromFilePath('./assets/videos/caraorder.mp4');
  const caption =
    `🛍️ Halo!, berikut adalah panduan cara melakukan pemesanan di bot kami:\n\n` +
    `1️⃣ Ketik Perintah dulu */caraorder* untuk melihat tutorial cara beli di bot\n` +
    `2️⃣ Ketik Perintah */produk* untuk melihat produk yang ada di bot\n` +
    `3️⃣ Lalu :\n` +
    `  ・Pilih Produk yang ini di beli\n` +
    `  ・Misal ingin order EPIC ➜ LEGEND\n` +
    `4️⃣ Ketik Perintah */buy* untuk beli\n` +
    `  ・Jika sudah memilih produk yang ingin dibeli,\n` +
    `  ・Ketik Perintah */buy <kode>*\n` +
    `  ・Contoh : */buy BGMTE*\n` +
    `5️⃣ Bot akan mengirimkan QRIS senilai harga produk yang dipilih\n` +
    `6️⃣ Setelah selesai melalukan pembayaran,\n` +
    `7️⃣ Lalu Bot akan mengirimkan *Format Pemesanan*, dan *copy* *Form Pemesanan*, lalu isi dengan benar\n` +
    `8️⃣ Bot akan mengirimkan notifikasi jika admin sudah mengkonfirmasi pemesanan\n` +
    `9️⃣ Lalu tunggu admin mengirimkan notifikasi pesanan selesai\n`;

  await chat.sendMessage(video, {
    caption,
  });
};

export default caraOrderCommandHandler;
