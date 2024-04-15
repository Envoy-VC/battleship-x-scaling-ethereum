import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { type AppType } from 'next/app';
import { Inter } from 'next/font/google';

import { config } from '~/lib/viem';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import '~/styles/globals.css';

import { Toaster } from '~/components/ui/sonner';

const queryClient = new QueryClient();

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <main className={`font-sans ${inter.variable}`}>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <DndProvider backend={HTML5Backend}>
            <Component {...pageProps} />
            <Toaster />
          </DndProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </main>
  );
};

export default MyApp;
