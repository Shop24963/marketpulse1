import type { Request, Response } from 'express';
import { Holding, MarketNews, PortfolioSnapshot, Watchlist } from '../models/index.js';
import { getPortfolioHealth } from '../services/risk.service.js';
export async function getDashboard(req: Request, res: Response) {
  const userId = req.user!.sub;
  const [holdings, snapshot, watchlists, news, health] = await Promise.all([
    Holding.find({ userId }).sort({ pnl: -1 }), PortfolioSnapshot.findOne({ userId }).sort({ capturedAt: -1 }), Watchlist.find({ userId }), MarketNews.find().sort({ publishedAt: -1 }).limit(10), getPortfolioHealth(userId)
  ]);
  res.json({ holdings, snapshot, watchlists, marketMovers: news, aiInsights: health.warnings.map((w) => ({ type: 'risk', text: w })), health });
}
