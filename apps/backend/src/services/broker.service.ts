import { normalizedHoldingSchema, type BrokerName } from '@marketpulse/shared';
import { BrokerAccount, Holding, PortfolioSnapshot } from '../models/index.js';
import { redis } from '../config/redis.js';
import { encryptSecret } from '../utils/crypto.js';

export async function connectBroker(userId: string, broker: BrokerName, externalAccountId: string, accessToken: string, refreshToken?: string) {
  return BrokerAccount.findOneAndUpdate({ userId, broker }, { userId, broker, externalAccountId, encryptedAccessToken: encryptSecret(accessToken), encryptedRefreshToken: refreshToken ? encryptSecret(refreshToken) : undefined, status: 'active', lastSyncedAt: new Date() }, { upsert: true, new: true });
}

export async function syncBrokerHoldings(userId: string) {
  const accounts = await BrokerAccount.find({ userId, status: 'active' });
  const holdings = accounts.flatMap((account) => [
    normalizedHoldingSchema.parse({ broker: account.broker, symbol: 'RELIANCE', isin: 'INE002A01018', quantity: 12, averagePrice: 2450, lastPrice: 2810, pnl: 4320, sector: 'Energy', asOf: new Date() }),
    normalizedHoldingSchema.parse({ broker: account.broker, symbol: 'INFY', isin: 'INE009A01021', quantity: 20, averagePrice: 1380, lastPrice: 1515, pnl: 2700, sector: 'IT', asOf: new Date() })
  ]);
  await Holding.deleteMany({ userId });
  await Holding.insertMany(holdings.map((h) => ({ ...h, userId, brokerAccountId: accounts[0]?._id })));
  const value = holdings.reduce((sum, h) => sum + h.quantity * h.lastPrice, 0);
  const pnl = holdings.reduce((sum, h) => sum + h.pnl, 0);
  const sectorAllocation = holdings.reduce<Record<string, number>>((acc, h) => { acc[h.sector] = (acc[h.sector] ?? 0) + h.quantity * h.lastPrice; return acc; }, {});
  const snapshot = await PortfolioSnapshot.create({ userId, value, pnl, sectorAllocation, riskScore: calculateRiskScore(sectorAllocation, value), capturedAt: new Date() });
  await redis.setex(`portfolio:${userId}:latest`, 60, JSON.stringify(snapshot));
  return snapshot;
}
function calculateRiskScore(sectorAllocation: Record<string, number>, value: number) { const maxWeight = Math.max(...Object.values(sectorAllocation).map((v) => v / Math.max(value, 1))); return Math.round(Math.min(100, 35 + maxWeight * 65)); }
