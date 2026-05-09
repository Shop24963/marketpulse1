import http from 'node:http';
import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './config/db.js';
import { createSocketServer } from './sockets/index.js';

await connectDatabase();
const server = http.createServer(createApp());
createSocketServer(server);
server.listen(env.PORT, () => console.log(`MarketPulse API listening on ${env.PORT}`));
