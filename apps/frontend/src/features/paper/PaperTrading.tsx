import { useQuery } from 'react-query';
import { api } from '../../lib/api';
import { Card } from '../../components/ui/Card';
export function PaperTrading() { const { data } = useQuery('paper', async () => (await api.get('/paper/portfolio')).data); return <Card><h1 className="text-2xl font-bold">Paper trading sandbox</h1><p className="mt-2 text-slate-400">Simulated portfolios, historical replay, AI strategy notes, leaderboards, and journals.</p><p className="mt-6 text-3xl font-bold">P&L ₹{Math.round(data?.pnl ?? 0).toLocaleString('en-IN')}</p></Card>; }
