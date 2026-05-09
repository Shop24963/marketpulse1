import type { Request, Response } from 'express';
import { CorporateAction, EarningsSummary, InsiderTrade, MarketNews, SocialMention, Theme } from '../models/index.js';
import { getPortfolioHealth, getTaxLossHarvesting } from '../services/risk.service.js';
export async function news(req: Request, res: Response) { res.json(await MarketNews.find(req.query.symbol ? { symbols: req.query.symbol } : {}).sort({ publishedAt: -1 }).limit(50)); }
export async function corporateActions(_req: Request, res: Response) { res.json(await CorporateAction.find().sort({ eventDate: 1 }).limit(100)); }
export async function insiderTrades(_req: Request, res: Response) { res.json(await InsiderTrade.find().sort({ reportedAt: -1 }).limit(100)); }
export async function themes(_req: Request, res: Response) { res.json(await Theme.find().sort({ sectorMomentum: -1 })); }
export async function earnings(_req: Request, res: Response) { res.json(await EarningsSummary.find().sort({ createdAt: -1 }).limit(50)); }
export async function social(_req: Request, res: Response) { res.json(await SocialMention.find().sort({ mentionedAt: -1 }).limit(200)); }
export async function health(req: Request, res: Response) { res.json(await getPortfolioHealth(req.user!.sub)); }
export async function tax(req: Request, res: Response) { res.json(await getTaxLossHarvesting(req.user!.sub)); }
