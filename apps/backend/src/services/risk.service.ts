import { Holding, Transaction } from '../models/index.js';
export async function getPortfolioHealth(userId: string) {
  const holdings = await Holding.find({ userId });
  const total = holdings.reduce((s, h) => s + (h.quantity ?? 0) * (h.lastPrice ?? 0), 0);
  const sectors = holdings.reduce<Record<string, number>>((acc, h) => { acc[h.sector ?? 'Unclassified'] = (acc[h.sector ?? 'Unclassified'] ?? 0) + (h.quantity ?? 0) * (h.lastPrice ?? 0); return acc; }, {});
  const warnings = Object.entries(sectors).filter(([, v]) => v / Math.max(total, 1) > 0.35).map(([sector]) => `High ${sector} exposure`);
  return { diversificationScore: Math.max(0, 100 - Math.round(Math.max(...Object.values(sectors), 0) / Math.max(total, 1) * 100)), sectorAllocation: sectors, warnings, macroRisks: ['Interest-rate sensitive sectors require monitoring'] };
}
export async function getTaxLossHarvesting(userId: string) {
  const trades = await Transaction.find({ userId }).sort({ tradeDate: 1 });
  return { indianTaxYear: 'April 1 to March 31', method: 'FIFO', opportunities: trades.filter((t) => (t.price ?? 0) < 0), note: 'Educational analysis only; consult a tax professional.' };
}
