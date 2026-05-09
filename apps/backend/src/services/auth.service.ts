import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { User } from '../models/index.js';
import { signAccessToken, signRefreshToken } from '../utils/jwt.js';

export const registerSchema = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(10) });
export const loginSchema = z.object({ email: z.string().email(), password: z.string().min(1) });

export async function register(input: z.infer<typeof registerSchema>) {
  const passwordHash = await bcrypt.hash(input.password, 12);
  const user = await User.create({ name: input.name, email: input.email, passwordHash });
  const payload = { sub: user.id, role: user.role } as const;
  return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, accessToken: signAccessToken(payload), refreshToken: signRefreshToken(payload) };
}
export async function login(input: z.infer<typeof loginSchema>) {
  const user = await User.findOne({ email: input.email });
  if (!user || !(await bcrypt.compare(input.password, user.passwordHash))) throw new Error('Invalid credentials');
  const payload = { sub: user.id, role: user.role } as const;
  return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, accessToken: signAccessToken(payload), refreshToken: signRefreshToken(payload) };
}
