import crypto from 'node:crypto';
import { env } from '../config/env.js';

const algorithm = 'aes-256-gcm';
const key = Buffer.from(env.AES_256_KEY_HEX, 'hex');

export function encryptSecret(plainText: string) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  const encrypted = Buffer.concat([cipher.update(plainText, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted.toString('hex')}`;
}

export function decryptSecret(payload: string) {
  const [ivHex, tagHex, encryptedHex] = payload.split(':');
  const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(ivHex, 'hex'));
  decipher.setAuthTag(Buffer.from(tagHex, 'hex'));
  return Buffer.concat([decipher.update(Buffer.from(encryptedHex, 'hex')), decipher.final()]).toString('utf8');
}
