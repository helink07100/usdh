// react-query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
// react
import { Analytics } from '@vercel/analytics/react';
import { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
// react helmet
import { HelmetProvider } from 'react-helmet-async';
// eslint-disable-next-line import/no-unresolved
import 'virtual:svg-icons-register';
import { Buffer } from 'buffer/';
import { WagmiProvider } from 'wagmi';

import App from '@/App';

// import worker from './_mock';
// i18n
import './locales/i18n';
// tailwind css
import './theme/index.css';
import { config } from './wagmi';

const charAt = `
    ███████╗██╗      █████╗ ███████╗██╗  ██╗ 
    ██╔════╝██║     ██╔══██╗██╔════╝██║  ██║
    ███████╗██║     ███████║███████╗███████║
    ╚════██║██║     ██╔══██║╚════██║██╔══██║
    ███████║███████╗██║  ██║███████║██║  ██║
    ╚══════╝╚══════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝
  `;
if (!window.Buffer) {
  window.Buffer = Buffer as any;
}
console.info(`%c${charAt}`, 'color: #5BE49B');

// 创建一个 client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 3, // 失败重试次数
      gcTime: 300_000, // 缓存有效期 5m
    },
  },
});
// Extend BigInt prototype to handle JSON serialization
// eslint-disable-next-line no-extend-native
Object.defineProperty(BigInt.prototype, 'toJSON', {
  value() {
    return this.toString();
  },
  configurable: true,
  writable: true,
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <HelmetProvider>
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        <Suspense>
          <Analytics />
          <App />
        </Suspense>
      </QueryClientProvider>
    </WagmiProvider>
  </HelmetProvider>,
);

// 🥵 start service worker mock in development mode
// worker.start({ onUnhandledRequest: 'bypass' });
