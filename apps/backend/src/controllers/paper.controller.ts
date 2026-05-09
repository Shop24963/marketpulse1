import type { Request, Response } from 'express';
import { PaperTrade } from '../models/index.js';
export async function placePaperOrder(req: Request, res: Response) { const price = req.body.limitPrice ?? 100; const trade = await PaperTrade.create({ ...req.body, userId: req.user!.sub, price, pnl: 0, executedAt: new Date() }); res.status(201).json(trade); }
export async function paperPortfolio(req: Request, res: Response) { const trades = await PaperTrade.find({ userId: req.user!.sub }).sort({ executedAt: -1 }); res.json({ trades, pnl: trades.reduce((s, t) => s + (t.pnl ?? 0), 0) }); }
