import type { Request, Response } from 'express';
import { connectBroker, syncBrokerHoldings } from '../services/broker.service.js';
import { pub } from '../config/redis.js';
import { socketEvents } from '@marketpulse/shared';
export async function oauthCallback(req: Request, res: Response) { const account = await connectBroker(req.user!.sub, req.params.broker as never, req.body.externalAccountId, req.body.accessToken, req.body.refreshToken); res.status(201).json(account); }
export async function sync(req: Request, res: Response) { const snapshot = await syncBrokerHoldings(req.user!.sub); await pub.publish(socketEvents.portfolioUpdated, JSON.stringify({ userId: req.user!.sub, snapshot })); res.json(snapshot); }
