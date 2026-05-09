import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter } from 'react-router-dom';
import { AppRouter } from './routes/AppRouter';
it('renders login route', () => { render(<QueryClientProvider client={new QueryClient()}><MemoryRouter initialEntries={["/login"]}><AppRouter /></MemoryRouter></QueryClientProvider>); });
