import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import dotenv from 'dotenv';
dotenv.config();
export const connection = new IORedis(process.env.REDIS_URL ?? 'redis://localhost:6379', { maxRetriesPerRequest: null });
export const brokerSyncQueue = new Queue('broker-sync', { connection });
export const newsQueue = new Queue('news-sentiment', { connection });
export const alertQueue = new Queue('alert-evaluation', { connection });
export const notificationQueue = new Queue('notifications', { connection });
