import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import csrf from 'csurf';
import express from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import { env, isProduction } from './config/env.js';
import { openApiSpec } from './docs/openapi.js';
import { errorHandler, notFound } from './middleware/error.js';
import { router } from './routes/index.js';

const csrfProtection = csrf({ cookie: { httpOnly: true, sameSite: 'strict', secure: isProduction } });

export function createApp() {
  const app = express();
  app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
  app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
  app.use(rateLimit({ windowMs: 60_000, limit: 300 }));
  app.use(express.json({ limit: '1mb' }));
  app.use(cookieParser());
  app.use(compression());
  app.use(morgan(isProduction ? 'combined' : 'dev'));
  app.get('/api/v1/csrf-token', csrfProtection, (req, res) => res.json({ csrfToken: req.csrfToken() }));
  app.use((req, res, next) => {
    if (req.method === 'GET' || req.headers.authorization?.startsWith('Bearer ')) return next();
    return csrfProtection(req, res, next);
  });
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(openApiSpec));
  app.use('/api/v1', router);
  app.use(notFound);
  app.use(errorHandler);
  return app;
}
