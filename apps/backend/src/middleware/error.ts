import type { NextFunction, Request, Response } from 'express';
export function notFound(req: Request, res: Response) { res.status(404).json({ message: `Route not found: ${req.method} ${req.path}` }); }
export function errorHandler(error: Error, _req: Request, res: Response, _next: NextFunction) { res.status(500).json({ message: 'Internal server error', detail: process.env.NODE_ENV === 'production' ? undefined : error.message }); }
