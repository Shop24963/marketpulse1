import { NavLink, Route, Routes } from 'react-router-dom';
import { Dashboard } from '../features/dashboard/Dashboard';
import { Login } from '../features/auth/Login';
import { Alerts } from '../features/alerts/Alerts';
import { PaperTrading } from '../features/paper/PaperTrading';
import { Admin } from '../features/admin/Admin';
function Shell() { return <div className="min-h-screen"><aside className="fixed inset-x-0 bottom-0 z-10 flex justify-around border-t border-white/10 bg-slate-950/90 p-3 backdrop-blur md:inset-y-0 md:left-0 md:right-auto md:w-64 md:flex-col md:justify-start md:gap-3 md:border-r md:border-t-0"><b className="hidden p-3 text-2xl md:block">MarketPulse</b>{['/','/alerts','/paper','/admin'].map((to) => <NavLink key={to} to={to} className="rounded-2xl px-3 py-2 text-sm text-slate-300 hover:bg-white/10">{to === '/' ? 'Dashboard' : to.slice(1)}</NavLink>)}</aside><main className="p-4 pb-24 md:ml-64 md:p-8"><Routes><Route path="/" element={<Dashboard />} /><Route path="/alerts" element={<Alerts />} /><Route path="/paper" element={<PaperTrading />} /><Route path="/admin" element={<Admin />} /></Routes></main></div>; }
export function AppRouter() { return <Routes><Route path="/login" element={<Login />} /><Route path="/*" element={<Shell />} /></Routes>; }
