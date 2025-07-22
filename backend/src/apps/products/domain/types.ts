export type ProductType =
  | 'Joki Bundle'
  | 'Joki Perbintang'
  | 'Joki Classic'
  | 'Joki MCL';

export type Product = {
  id: number;
  name: string;
  price: number;
  discountPrice: number;
  code: string;
  type: ProductType;
  logo: string;
};
