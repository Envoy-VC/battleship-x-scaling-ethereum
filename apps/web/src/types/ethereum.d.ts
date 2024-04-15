import { config } from '~/lib/viem';

import { WalletClient } from 'viem';

declare global {
  interface Window {
    ethereum: WalletClient;
  }
}

declare module 'wagmi' {
  interface Register {
    config: typeof config;
  }
}
