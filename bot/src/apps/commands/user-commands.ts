import { Command } from './types';
import buyCommandHandler from './user-commands/buy';
import caraOrderCommandHandler from './user-commands/caraorder';
import userMenuCommandHandler from './user-commands/menu';
import productCommandHandler from './user-commands/product';

/**
 * List of all available user commands.
 * */
const userCommands: Command[] = [
  {
    name: 'menu',
    description: 'Menampilkan semua command user yang tersedia pada bot ini',
    shortDescription: 'Menampilkan menu',
    logo: '📌',
    handler: userMenuCommandHandler,
  },
  {
    name: 'caraorder',
    description: 'untuk menampilkan video tutorial cara order',
    shortDescription: 'Video cara order',
    logo: '🎥',
    handler: caraOrderCommandHandler,
  },
  {
    name: 'produk',
    description: 'Menampilkan produk apa saja yang ada di bot',
    shortDescription: 'Lihat produk',
    logo: '📦',
    handler: productCommandHandler,
  },
  {
    name: 'buy',
    description: 'Melakukan pemesanan dengan cara /buy codeProduk',
    shortDescription: 'Melakukan pemesanan',
    logo: '🛒',
    handler: buyCommandHandler,
  },
];

export default userCommands;
