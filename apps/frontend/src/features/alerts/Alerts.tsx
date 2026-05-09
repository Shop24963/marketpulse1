import { useQuery } from 'react-query';
import { api } from '../../lib/api';
import { Card } from '../../components/ui/Card';
export function Alerts() { const { data = [] } = useQuery('alerts', async () => (await api.get('/alerts')).data); return <Card><h1 className="text-2xl font-bold">Advanced logic alerts</h1><p className="mt-2 text-slate-400">Redis-backed signals combine price, volume, sentiment, RSI, and insider activity.</p><div className="mt-4 space-y-3">{data.map((a: any) => <div key={a._id} className="rounded-2xl bg-white/5 p-4"><b>{a.name}</b><p className="text-sm text-slate-400">{a.symbol} · {a.joiner}</p></div>)}</div></Card>; }
