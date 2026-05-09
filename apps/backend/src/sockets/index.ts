import { Server } from 'socket.io';
import type { Server as HttpServer } from 'node:http';
import { env } from '../config/env.js';
import { socketEvents } from '@marketpulse/shared';
import { sub } from '../config/redis.js';
import { verifyAccessToken } from '../utils/jwt.js';

export function createSocketServer(server: HttpServer) {
  const io = new Server(server, { cors: { origin: env.FRONTEND_URL, credentials: true } });
  io.use((socket, next) => { const token = socket.handshake.auth.token; if (!token) return next(new Error('Unauthorized')); socket.data.user = verifyAccessToken(token); return next(); });
  io.on('connection', (socket) => { socket.join(`user:${socket.data.user.sub}`); socket.emit('connected', { ok: true }); });
  void sub.subscribe(...Object.values(socketEvents));
  sub.on('message', (channel, payload) => { const parsed = JSON.parse(payload); if (parsed.userId) io.to(`user:${parsed.userId}`).emit(channel, parsed); else io.emit(channel, parsed); });
  return io;
}
