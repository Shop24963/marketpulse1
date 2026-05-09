import { io } from 'socket.io-client';
export const socket = io(import.meta.env.VITE_WS_URL ?? 'http://localhost:8080', { autoConnect: false, auth: () => ({ token: localStorage.getItem('mp_access_token') }) });
