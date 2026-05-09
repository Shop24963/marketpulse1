import { Worker } from 'bullmq';
import { socketEvents } from '@marketpulse/shared';
import { connection } from '../queues/index.js';
const compare = (actual: number, operator: string, expected: number) => ({ gt: actual > expected, gte: actual >= expected, lt: actual < expected, lte: actual <= expected, eq: actual === expected }[operator] ?? false);
export const alertWorker = new Worker('alert-evaluation', async (job) => {
  const { alert, marketState } = job.data;
  const results = alert.conditions.map((c: any) => compare(marketState[c.metric] ?? 0, c.operator, c.value));
  const triggered = alert.joiner === 'OR' ? results.some(Boolean) : results.every(Boolean);
  return { triggered, event: triggered ? socketEvents.alertTriggered : undefined };
}, { connection });
