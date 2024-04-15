import { cookieStorage, createConfig, createStorage, http } from 'wagmi';
import { arbitrumSepolia, foundry } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

export const config = createConfig({
  chains: [foundry],
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  connectors: [injected()],
  transports: {
    [foundry.id]: http(),
  },
});
