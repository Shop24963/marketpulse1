import { useQuery } from 'react-query';
import { api } from '../../lib/api';
import { Card } from '../../components/ui/Card';
export function Admin() { const { data } = useQuery('admin', async () => (await api.get('/admin/summary')).data); return <Card><h1 className="text-2xl font-bold">Admin operations</h1><p className="mt-4">Users: {data?.users ?? 0}</p><p className="text-slate-400">Audit logs, queue health, broker sync status, and compliance review workflows live here.</p></Card>; }
