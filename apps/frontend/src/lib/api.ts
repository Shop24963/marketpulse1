import axios from 'axios';
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api/v1', withCredentials: true });
api.interceptors.request.use((config) => { const token = localStorage.getItem('mp_access_token'); if (token) config.headers.Authorization = `Bearer ${token}`; return config; });
