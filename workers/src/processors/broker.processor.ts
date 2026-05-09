import { Worker } from 'bullmq';
import { socketEvents } from '@marketpulse/shared';
import { connection } from '../queues/index.js';
export const brokerWorker = new Worker('broker-sync', async (job) => ({ userId: job.data.userId, syncedAt: new Date().toISOString(), event: socketEvents.portfolioUpdated }), { connection });
