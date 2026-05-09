import { FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import { useAuthStore } from '../../stores/auth';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
export function Login() { const nav = useNavigate(); const setSession = useAuthStore((s) => s.setSession); const [email, setEmail] = useState('demo@marketpulse.ai'); const [password, setPassword] = useState('StrongPass123'); async function submit(e: FormEvent) { e.preventDefault(); const { data } = await api.post('/auth/login', { email, password }); setSession(data.user, data.accessToken); nav('/'); } return <main className="grid min-h-screen place-items-center p-4"><Card className="w-full max-w-md"><h1 className="text-3xl font-bold">MarketPulse</h1><p className="mt-2 text-slate-400">AI-powered Indian market intelligence.</p><form onSubmit={submit} className="mt-6 space-y-4"><input className="w-full rounded-2xl border border-white/10 bg-slate-900 p-3" value={email} onChange={(e) => setEmail(e.target.value)} /><input className="w-full rounded-2xl border border-white/10 bg-slate-900 p-3" type="password" value={password} onChange={(e) => setPassword(e.target.value)} /><Button className="w-full">Enter dashboard</Button></form></Card></main>; }
