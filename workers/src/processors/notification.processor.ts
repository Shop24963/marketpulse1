import { Worker } from 'bullmq';
import { connection } from '../queues/index.js';
export const notificationWorker = new Worker('notifications', async (job) => ({ delivered: true, channel: job.data.channel, at: new Date().toISOString() }), { connection });
