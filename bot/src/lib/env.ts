import { config } from 'dotenv';
import { expand } from 'dotenv-expand';
import { z } from 'zod/v4';

const EnvSchema = z.object({
  ADMIN_PHONE_NUMBER: z.string().transform((v) => `${v}@c.us`),

  BACKEND_API_URL: z.string(),

  PAYMENT_API_URL: z.string(),
  PAYMENT_API_KEY: z.string(),

  NODE_ENV: z
    .literal(['production', 'development', 'test'])
    .default('development'),
});

expand(config());

const env = EnvSchema.parse(process.env);

export type Env = z.infer<typeof EnvSchema>;

export default env;
