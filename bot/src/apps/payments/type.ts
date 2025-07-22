import { z } from 'zod/v4';

export const AtlanticCreateDepositResponseSchema = z
  .object({
    status: z.boolean(),
    data: z.object({
      id: z.string(),
      reff_id: z.string(),
      nominal: z.number(),
      tambahan: z.number(),
      fee: z.number(),
      get_balance: z.number(),
      qr_string: z.string(),
      qr_image: z.string(),
      status: z.string(),
      created_at: z.string(),
      expired_at: z.string(),
    }),
    code: z.number(),
  })
  .transform(({ status, data, code }) => ({
    status,
    data: {
      id: data.id,
      reffId: data.reff_id,
      nominal: data.nominal,
      tambahan: data.tambahan,
      fee: data.fee,
      getBalance: data.get_balance,
      qrString: data.qr_string,
      qrImage: data.qr_image,
      status: data.status,
      createdAt: data.created_at,
      expiredAt: data.expired_at,
    },
    code,
  }));

export const AtlanticCheckDepositResponseSchema = z
  .object({
    status: z.boolean(),
    data: z.object({
      id: z.string(),
      reff_id: z.string(),
      nominal: z.string(),
      tambahan: z.string(),
      fee: z.string(),
      get_balance: z.string(),
      metode: z.string(),
      status: z.string(),
      created_at: z.string(),
    }),
    code: z.number(),
  })
  .transform(({ status, data, code }) => ({
    status,
    data: {
      id: data.id,
      reffId: data.reff_id,
      nominal: data.nominal,
      tambahan: data.tambahan,
      fee: data.fee,
      getBalance: data.get_balance,
      metode: data.metode,
      status: data.status,
      createdAt: data.created_at,
    },
    code,
  }));

export type AtlanticCreateDepositRequest = {
  apiKey?: string;
  reffId: string;
  nominal: number;
  type?: string;
  metode?: string;
};

export type AtlanticCheckDepositRequest = {
  apiKey?: string;
  id: string;
};

export type AtlanticCreateDepositResponse = z.infer<
  typeof AtlanticCreateDepositResponseSchema
>;

export type AtlanticCheckDepositResponse = z.infer<
  typeof AtlanticCheckDepositResponseSchema
>;
