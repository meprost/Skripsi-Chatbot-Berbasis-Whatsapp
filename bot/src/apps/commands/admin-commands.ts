import addProductCommandHandler from '@/apps/commands/admin-commands/add-product';
import confirmationCommandHandler from '@/apps/commands/admin-commands/confirmation';
import deleteProductCommandHandler from '@/apps/commands/admin-commands/delete-product';
import doneCommandHandler from '@/apps/commands/admin-commands/done';
import adminMenuCommandHandler from '@/apps/commands/admin-commands/menu';
import updateProductCommandHandler from '@/apps/commands/admin-commands/update-product';
import { Command } from '@/apps/commands/types';
import productCommandHandler from '@/apps/commands/user-commands/product';

/**
 * List of all available admin commands.
 * */
const adminCommands: Command[] = [
  {
    name: 'menu',
    description: 'Menampilkan semua command admin yang tersedia pada bot ini',
    shortDescription: 'Menampilkan menu ini',
    logo: '📌',
    handler: adminMenuCommandHandler,
  },
  {
    name: 'produk',
    description: 'Menampilkan produk apa saja yang ada di bot',
    shortDescription: 'Lihat produk',
    logo: '📦',
    handler: productCommandHandler,
  },
  {
    name: 'konfirmasi',
    description:
      'Mengkonfirmasi pesana dari pelanggan dengan cara /konfirmasi nomorHpPelanggan',
    shortDescription: 'Mengkonfirmasi pesanan',
    logo: '🤝',
    handler: confirmationCommandHandler,
  },
  {
    name: 'done',
    description: 'Memberitahu pelanggan bahwa pesanan sudah selesai',
    shortDescription: 'Kirim penyelesaian pesanan',
    logo: '✅',
    handler: doneCommandHandler,
  },
  {
    name: 'add',
    description: 'Add product jing',
    shortDescription: 'Add Produk',
    logo: '➕',
    handler: addProductCommandHandler,
  },
  {
    name: 'update',
    description: 'Update product jing',
    shortDescription: 'Update Produk',
    logo: '📝',
    handler: updateProductCommandHandler,
  },
  {
    name: 'delete',
    description: 'Delete product jing',
    shortDescription: 'Delete Produk',
    logo: '🗑️',
    handler: deleteProductCommandHandler,
  },
];

export default adminCommands;
