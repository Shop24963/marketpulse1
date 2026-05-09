import type { NextFunction, Request, Response } from 'express';
import { verifyAccessToken, type JwtUser } from '../utils/jwt.js';

declare global { namespace Express { interface Request { user?: JwtUser } } }
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ message: 'Authentication required' });
  req.user = verifyAccessToken(header.slice(7));
  return next();
}
export function requireRole(roles: JwtUser['role'][]) { return (req: Request, res: Response, next: NextFunction) => req.user && roles.includes(req.user.role) ? next() : res.status(403).json({ message: 'Insufficient privileges' }); }
