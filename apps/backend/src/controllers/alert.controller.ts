import type { Request, Response } from 'express';
import { Alert } from '../models/index.js';
export async function createAlert(req: Request, res: Response) { res.status(201).json(await Alert.create({ ...req.body, userId: req.user!.sub })); }
export async function listAlerts(req: Request, res: Response) { res.json(await Alert.find({ userId: req.user!.sub }).sort({ createdAt: -1 })); }
