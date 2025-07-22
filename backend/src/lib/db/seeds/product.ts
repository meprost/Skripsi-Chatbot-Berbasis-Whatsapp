import { DB } from '@/lib/db';
import { products } from '@/lib/db/schema/products';

type Product = typeof products.$inferInsert;

const mock: Product[] = [
  /* Joki Bundle */
  {
    name: 'MASTER ➜ GM',
    price: 80000,
    discountPrice: 0,
    code: 'BMTOG',
    type: 'Joki Bundle',
    logo: '👑',
  },
  {
    name: 'GM ➜ EPIC',
    price: 120000,
    discountPrice: 0,
    code: 'BGTOE',
    type: 'Joki Bundle',
    logo: '🥈',
  },
  {
    name: 'EPIC ➜ LEGEND',
    price: 140000,
    discountPrice: 0,
    code: 'BETOL',
    type: 'Joki Bundle',
    logo: '🥈',
  },
  {
    name: 'LEGEND ➜ MYTHIC',
    price: 190000,
    discountPrice: 0,
    code: 'BLTOM',
    type: 'Joki Bundle',
    logo: '🥈',
  },

  /* Joki Perbintang */
  {
    name: 'Master',
    price: 4000,
    discountPrice: 0,
    code: 'MASTER',
    type: 'Joki Perbintang',
    logo: '⭐',
  },
  {
    name: 'GrandMaster',
    price: 5000,
    discountPrice: 0,
    code: 'GM',
    type: 'Joki Perbintang',
    logo: '⭐',
  },
  {
    name: 'Epic',
    price: 6000,
    discountPrice: 0,
    code: 'EPIC',
    type: 'Joki Perbintang',
    logo: '⭐',
  },
  {
    name: 'Legend',
    price: 8000,
    discountPrice: 0,
    code: 'LEGEND',
    type: 'Joki Perbintang',
    logo: '⭐',
  },
  {
    name: 'Mythic',
    price: 15000,
    discountPrice: 0,
    code: 'MYTHIC',
    type: 'Joki Perbintang',
    logo: '⭐',
  },
  {
    name: 'Honor',
    price: 20000,
    discountPrice: 0,
    code: 'HONOR',
    type: 'Joki Perbintang',
    logo: '⭐',
  },
  {
    name: 'Glory',
    price: 25000,
    discountPrice: 0,
    code: 'GLORY',
    type: 'Joki Perbintang',
    logo: '⭐',
  },
  {
    name: 'Immortal',
    price: 35000,
    discountPrice: 0,
    code: 'IMMORTAL',
    type: 'Joki Perbintang',
    logo: '⭐',
  },
];

export async function seed(db: DB) {
  await db.insert(products).values(mock);
}
