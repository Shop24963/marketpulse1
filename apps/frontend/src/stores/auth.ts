import { create } from 'zustand';
type User = { id: string; name: string; email: string; role: string } | null;
export const useAuthStore = create<{ user: User; setSession: (user: User, token: string) => void; logout: () => void }>((set) => ({ user: null, setSession: (user, token) => { localStorage.setItem('mp_access_token', token); set({ user }); }, logout: () => { localStorage.removeItem('mp_access_token'); set({ user: null }); } }));
