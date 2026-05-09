import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export interface JwtUser { sub: string; role: 'user' | 'analyst' | 'admin'; }
export function signAccessToken(payload: JwtUser) { return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: '15m' }); }
export function signRefreshToken(payload: JwtUser) { return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: '30d' }); }
export function verifyAccessToken(token: string) { return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtUser; }
