import { customAlphabet } from 'nanoid';

export const generateShortUUID = customAlphabet(
  '23456789ABCDEFGHJKLMNPQRSTUVWXYZ',
  12,
);

export const generateAdditionalPrice = (price: number) => {
  return parseFloat((price * 0.02).toFixed(0));
};

// export const generateRandomNumber = (min: number = 500, max: number = 1000) => {
//   return Math.floor(Math.random() * (max - min + 1)) + min;
// };
