import { motion } from 'framer-motion';
import { Bell, Brain, Landmark, ShieldAlert, WalletCards } from 'lucide-react';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { socketEvents } from '@marketpulse/shared';
import { api } from '../../lib/api';
import { socket } from '../../lib/socket';
import { Card } from '../../components/ui/Card';
import { Skeleton } from '../../components/ui/Skeleton';

type DashboardData = { holdings: Array<{ symbol: string; pnl: number; quantity: number; lastPrice: number; sector: string }>; snapshot?: { value: number; pnl: number; riskScore: number; sectorAllocation: Record<string, number> }; aiInsights: Array<{ text: string }>; marketMovers: Array<{ title: string; sentimentScore: number }> };
export function Dashboard() {
  const { data, isLoading, refetch } = useQuery('dashboard', async () => (await api.get<DashboardData>('/dashboard')).data, { refetchInterval: 60_000 });
  useEffect(() => { socket.connect(); socket.on(socketEvents.portfolioUpdated, () => refetch()); return () => { socket.off(socketEvents.portfolioUpdated); }; }, [refetch]);
  if (isLoading) return <div className="grid gap-4 md:grid-cols-3"><Skeleton /><Skeleton /><Skeleton /></div>;
  const sectorData = Object.entries(data?.snapshot?.sectorAllocation ?? {}).map(([name, value]) => ({ name, value }));
  const trend = [1, 2, 3, 4, 5].map((day) => ({ day: `D${day}`, value: (data?.snapshot?.value ?? 100000) * (0.96 + day / 100) }));
  return <div className="space-y-6">
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 md:grid-cols-4">
      <Metric icon={<WalletCards />} label="Portfolio" value={`₹${Math.round(data?.snapshot?.value ?? 0).toLocaleString('en-IN')}`} />
      <Metric icon={<Landmark />} label="P&L" value={`₹${Math.round(data?.snapshot?.pnl ?? 0).toLocaleString('en-IN')}`} />
      <Metric icon={<ShieldAlert />} label="Risk Score" value={`${data?.snapshot?.riskScore ?? 0}/100`} />
      <Metric icon={<Brain />} label="AI Insights" value={`${data?.aiInsights.length ?? 0}`} />
    </motion.div>
    <div className="grid gap-4 lg:grid-cols-3">
      <Card className="lg:col-span-2"><h2 className="mb-4 text-xl font-semibold">Portfolio momentum</h2><ResponsiveContainer width="100%" height={260}><AreaChart data={trend}><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8}/><stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" stroke="#1e293b"/><XAxis dataKey="day"/><YAxis/><Tooltip/><Area type="monotone" dataKey="value" stroke="#22d3ee" fill="url(#g)" /></AreaChart></ResponsiveContainer></Card>
      <Card><h2 className="mb-4 text-xl font-semibold">Sector allocation</h2><ResponsiveContainer width="100%" height={260}><PieChart><Pie data={sectorData} dataKey="value" nameKey="name" innerRadius={55}>{sectorData.map((_, i) => <Cell key={i} fill={['#22d3ee','#a78bfa','#34d399','#f59e0b'][i % 4]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></Card>
    </div>
    <div className="grid gap-4 lg:grid-cols-2"><Card><h2 className="mb-4 flex items-center gap-2 text-xl font-semibold"><Bell /> Market movers</h2><ResponsiveContainer width="100%" height={260}><BarChart data={data?.marketMovers ?? []}><XAxis dataKey="title" hide/><YAxis/><Tooltip/><Bar dataKey="sentimentScore" fill="#22d3ee" /></BarChart></ResponsiveContainer></Card><Card><h2 className="mb-4 text-xl font-semibold">AI risk insights</h2><ul className="space-y-3">{data?.aiInsights.map((i, idx) => <li key={idx} className="rounded-2xl bg-white/5 p-3 text-sm text-slate-300">{i.text}</li>)}</ul></Card></div>
  </div>;
}
function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) { return <Card><div className="flex items-center justify-between text-cyan-300">{icon}<span className="text-xs uppercase tracking-widest text-slate-400">{label}</span></div><p className="mt-4 text-2xl font-bold">{value}</p></Card>; }
