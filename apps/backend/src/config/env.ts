import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(8080),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),
  MONGODB_URI: z.string().default('mongodb://localhost:27017/marketpulse'),
  REDIS_URL: z.string().default('redis://localhost:6379'),
  JWT_ACCESS_SECRET: z.string().min(16).default('development-access-secret-change'),
  JWT_REFRESH_SECRET: z.string().min(16).default('development-refresh-secret-change'),
  AES_256_KEY_HEX: z.string().length(64).default('0000000000000000000000000000000000000000000000000000000000000000'),
  GEMINI_API_KEY: z.string().optional(),
  FCM_SERVER_KEY: z.string().optional(),
  WHATSAPP_TOKEN: z.string().optional()
});

export const env = envSchema.parse(process.env);
export const isProduction = env.NODE_ENV === 'production';
