import { sanitizeComplianceText } from '@marketpulse/shared';
test('sanitizes directive language', () => { expect(sanitizeComplianceText('Buy now, sell later, guaranteed returns')).not.toMatch(/\bbuy\b|\bsell\b|guaranteed returns/i); });
