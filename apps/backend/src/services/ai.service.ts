import { GoogleGenerativeAI } from '@google/generative-ai';
import { sanitizeComplianceText } from '@marketpulse/shared';
import { env } from '../config/env.js';

const client = env.GEMINI_API_KEY ? new GoogleGenerativeAI(env.GEMINI_API_KEY) : undefined;
export async function summarizeMarketText(text: string) {
  if (!client) return { summary: sanitizeComplianceText(text.slice(0, 280)), sentimentScore: 55, risks: ['Gemini API key not configured'], themes: [], events: [] };
  const model = client.getGenerativeModel({ model: 'gemini-1.5-flash' });
  const result = await model.generateContent(`Return JSON with summary, sentimentScore 0-100, risks, themes, events. Keep wording informational and avoid directive investment language. Text: ${text.slice(0, 8000)}`);
  const raw = result.response.text().replace(/```json|```/g, '').trim();
  const parsed = JSON.parse(raw) as { summary: string; sentimentScore: number; risks: string[]; themes: string[]; events: string[] };
  return { ...parsed, summary: sanitizeComplianceText(parsed.summary) };
}
