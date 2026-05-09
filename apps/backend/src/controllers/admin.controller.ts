import type { Request, Response } from 'express';
import { AuditLog, User } from '../models/index.js';
export async function adminSummary(_req: Request, res: Response) { const [users, auditLogs] = await Promise.all([User.countDocuments(), AuditLog.find().sort({ createdAt: -1 }).limit(50)]); res.json({ users, auditLogs }); }
