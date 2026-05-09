import { Worker } from 'bullmq';
import { sanitizeComplianceText, socketEvents } from '@marketpulse/shared';
import { connection } from '../queues/index.js';
export const newsWorker = new Worker('news-sentiment', async (job) => {
  const { title, body, symbols = [] } = job.data;
  const sentimentScore = Math.min(100, Math.max(0, 50 + (body?.length ?? 0) % 45));
  return { title, symbols, summary: sanitizeComplianceText(String(body).slice(0, 240)), sentimentScore, event: socketEvents.newsScored };
}, { connection });
