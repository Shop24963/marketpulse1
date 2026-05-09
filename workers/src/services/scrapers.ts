import * as cheerio from 'cheerio';
export function extractArticle(html: string) { const $ = cheerio.load(html); return { title: $('title').text(), body: $('p').map((_, p) => $(p).text()).get().join('\n') }; }
export const scraperSources = ['NSE filings', 'BSE filings', 'Moneycontrol', 'Economic Times', 'Livemint', 'Reddit', 'X/Twitter', 'Telegram'];
