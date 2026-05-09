import { z } from 'zod';

export const COMPLIANCE_BLOCKED_TERMS = ['buy', 'sell', 'guaranteed returns'] as const;
export const COMPLIANCE_ALLOWED_TERMS = ['insight', 'signal', 'momentum', 'watchlist', 'opportunity', 'risk'] as const;

export const socketEvents = {
  portfolioUpdated: 'portfolio:updated',
  alertTriggered: 'alert:triggered',
  newsScored: 'news:scored',
  corporateAction: 'corporate-action:updated',
  socialSignal: 'social:signal',
  paperTradeFilled: 'paper:trade-filled'
} as const;

export const brokerNames = ['zerodha', 'upstox', 'groww'] as const;
export type BrokerName = typeof brokerNames[number];

export const normalizedHoldingSchema = z.object({
  broker: z.enum(brokerNames),
  symbol: z.string().min(1),
  isin: z.string().optional(),
  quantity: z.number(),
  averagePrice: z.number(),
  lastPrice: z.number(),
  pnl: z.number(),
  sector: z.string().default('Unclassified'),
  asOf: z.coerce.date()
});

export const alertConditionSchema = z.object({
  metric: z.enum(['priceChangePct', 'sentimentScore', 'volumeMultiple', 'rsi', 'insiderScore']),
  operator: z.enum(['gt', 'gte', 'lt', 'lte', 'eq']),
  value: z.number()
});

export const createAlertSchema = z.object({
  name: z.string().min(3).max(120),
  symbol: z.string().min(1).max(24),
  conditions: z.array(alertConditionSchema).min(1).max(8),
  joiner: z.enum(['AND', 'OR']).default('AND'),
  channels: z.array(z.enum(['websocket', 'push', 'whatsapp', 'email'])).default(['websocket'])
});

export const paperOrderSchema = z.object({
  symbol: z.string().min(1),
  side: z.enum(['LONG_ENTRY', 'LONG_EXIT']),
  quantity: z.number().positive(),
  orderType: z.enum(['MARKET', 'LIMIT']).default('MARKET'),
  limitPrice: z.number().positive().optional(),
  strategyTag: z.string().max(80).optional()
});

export type NormalizedHolding = z.infer<typeof normalizedHoldingSchema>;
export type CreateAlertInput = z.infer<typeof createAlertSchema>;
export type PaperOrderInput = z.infer<typeof paperOrderSchema>;

export function sanitizeComplianceText(text: string): string {
  return text
    .replace(/\bbuy\b/gi, 'track as an opportunity')
    .replace(/\bsell\b/gi, 'review as a risk')
    .replace(/guaranteed returns/gi, 'potential outcomes');
}
