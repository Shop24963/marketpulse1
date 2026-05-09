import mongoose, { Schema, model } from 'mongoose';

const timestamps = { timestamps: true };
export type Role = 'user' | 'analyst' | 'admin';

export const User = model('User', new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['user', 'analyst', 'admin'], default: 'user', index: true },
  mfaEnabled: { type: Boolean, default: false },
  riskProfile: { type: String, enum: ['conservative', 'balanced', 'growth'], default: 'balanced' },
  notificationTokens: [{ type: String }]
}, timestamps));

const brokerAccountSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  broker: { type: String, enum: ['zerodha', 'upstox', 'groww'], required: true, index: true },
  externalAccountId: { type: String, required: true },
  encryptedAccessToken: { type: String, required: true },
  encryptedRefreshToken: String,
  scopes: [String],
  tokenExpiresAt: Date,
  lastSyncedAt: Date,
  status: { type: String, enum: ['active', 'expired', 'revoked'], default: 'active', index: true }
}, timestamps);
brokerAccountSchema.index({ userId: 1, broker: 1 }, { unique: true });
export const BrokerAccount = model('BrokerAccount', brokerAccountSchema);

const holdingSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  brokerAccountId: { type: Schema.Types.ObjectId, ref: 'BrokerAccount', required: true },
  symbol: { type: String, required: true, index: true },
  isin: String, sector: { type: String, index: true }, quantity: Number, averagePrice: Number, lastPrice: Number,
  pnl: Number, dayChangePct: Number, riskFlags: [String], asOf: { type: Date, index: true }
}, timestamps);
holdingSchema.index({ userId: 1, symbol: 1 });
export const Holding = model('Holding', holdingSchema);

const transactionSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', index: true }, symbol: { type: String, index: true }, broker: String,
  side: { type: String, enum: ['LONG_ENTRY', 'LONG_EXIT'] }, quantity: Number, price: Number, charges: Number,
  tradeDate: { type: Date, index: true }, settlementDate: Date, taxLotId: String
}, timestamps);
transactionSchema.index({ userId: 1, tradeDate: -1 });
export const Transaction = model('Transaction', transactionSchema);

export const Watchlist = model('Watchlist', new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', index: true }, name: String,
  symbols: [{ symbol: String, sector: String, notes: String, addedAt: Date }]
}, timestamps));

const alertSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', index: true }, name: String, symbol: { type: String, index: true },
  conditions: [{ metric: String, operator: String, value: Number }], joiner: { type: String, enum: ['AND', 'OR'], default: 'AND' },
  channels: [String], enabled: { type: Boolean, default: true, index: true }, lastTriggeredAt: Date
}, timestamps);
alertSchema.index({ symbol: 1, enabled: 1 });
export const Alert = model('Alert', alertSchema);

const marketNewsSchema = new Schema({
  source: { type: String, index: true }, url: { type: String, unique: true }, title: String, body: String,
  symbols: [{ type: String, index: true }], publishedAt: { type: Date, index: true }, summary: String,
  sentimentScore: { type: Number, min: 0, max: 100, index: true }, sentimentLabel: { type: String, enum: ['Positive', 'Neutral', 'Negative'] },
  momentumSignals: [String], themes: [String], risks: [String], embedding: [Number]
}, timestamps);
marketNewsSchema.index({ title: 'text', body: 'text', summary: 'text' });
export const MarketNews = model('MarketNews', marketNewsSchema);

const corporateActionSchema = new Schema({
  symbol: { type: String, index: true }, type: { type: String, enum: ['earnings', 'dividend', 'split', 'bonus', 'agm', 'board_meeting'], index: true },
  eventDate: { type: Date, index: true }, recordDate: Date, details: Schema.Types.Mixed, sourceUrl: String, reminderSentAt: Date
}, timestamps);
corporateActionSchema.index({ symbol: 1, eventDate: 1 });
export const CorporateAction = model('CorporateAction', corporateActionSchema);

export const SentimentScore = model('SentimentScore', new Schema({
  symbol: { type: String, index: true }, sourceType: { type: String, enum: ['news', 'social', 'filing'], index: true },
  score: Number, label: String, confidence: Number, measuredAt: { type: Date, index: true }, drivers: [String]
}, { timeseries: { timeField: 'measuredAt', metaField: 'symbol', granularity: 'minutes' }, expireAfterSeconds: 60 * 60 * 24 * 730 }));

export const Theme = model('Theme', new Schema({
  name: { type: String, unique: true }, description: String, symbols: [String], sentimentScore: Number,
  sectorMomentum: Number, heatmap: [{ symbol: String, score: Number, contractWins: Number }], insights: [String], updatedAt: Date
}, timestamps));

export const InsiderTrade = model('InsiderTrade', new Schema({
  symbol: { type: String, index: true }, participant: String, category: { type: String, enum: ['promoter', 'institution', 'whale', 'other'], index: true },
  quantity: Number, value: Number, transactionType: String, reportedAt: { type: Date, index: true }, unusualActivityScore: Number, insight: String
}, timestamps));

export const SectorData = model('SectorData', new Schema({ sector: { type: String, unique: true }, beta: Number, volatility: Number, macroRisks: [String], momentumScore: Number, updatedAt: Date }, timestamps));
export const EarningsSummary = model('EarningsSummary', new Schema({ symbol: { type: String, index: true }, period: String, bullets: [String], outlook: String, risks: [String], capexInsights: [String], guidanceChanges: [String], sentimentScore: Number, confidence: Number, sourceUrl: String }, timestamps));
export const SocialMention = model('SocialMention', new Schema({ symbol: { type: String, index: true }, platform: { type: String, index: true }, text: String, authorHash: String, spamScore: Number, botScore: Number, retailHypeScore: Number, smartMoneyScore: Number, mentionedAt: { type: Date, index: true } }, { timeseries: { timeField: 'mentionedAt', metaField: 'symbol', granularity: 'minutes' }, expireAfterSeconds: 60 * 60 * 24 * 180 }));
export const Notification = model('Notification', new Schema({ userId: { type: Schema.Types.ObjectId, ref: 'User', index: true }, channel: String, title: String, body: String, readAt: Date, sentAt: Date, metadata: Schema.Types.Mixed }, timestamps));
export const PaperTrade = model('PaperTrade', new Schema({ userId: { type: Schema.Types.ObjectId, ref: 'User', index: true }, symbol: { type: String, index: true }, side: String, quantity: Number, price: Number, pnl: Number, strategyTag: String, journal: String, executedAt: { type: Date, index: true } }, timestamps));
export const PortfolioSnapshot = model('PortfolioSnapshot', new Schema({ userId: { type: Schema.Types.ObjectId, ref: 'User', index: true }, value: Number, pnl: Number, allocation: Schema.Types.Mixed, sectorAllocation: Schema.Types.Mixed, riskScore: Number, capturedAt: { type: Date, index: true } }, { timeseries: { timeField: 'capturedAt', metaField: 'userId', granularity: 'minutes' }, expireAfterSeconds: 60 * 60 * 24 * 365 * 5 }));
const auditLogSchema = new Schema({ actorId: { type: Schema.Types.ObjectId, ref: 'User', index: true }, action: { type: String, index: true }, entity: String, entityId: String, ip: String, userAgent: String, metadata: Schema.Types.Mixed, createdAt: { type: Date, default: Date.now, index: true } });
auditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 365 * 7 });
export const AuditLog = model('AuditLog', auditLogSchema);

export async function ensureTimeSeriesCollections() { await mongoose.connection.asPromise(); }
