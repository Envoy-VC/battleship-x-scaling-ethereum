import { BATTLESHIP_GAME_ADDRESS } from '~/lib/constants.json';

import { cookieStorage, createConfig, createStorage, http } from 'wagmi';
import { arbitrumSepolia, foundry } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

import { BATTLESHIP_GAME_ABI } from '../abi';

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

export const battleShipContract = {
  abi: BATTLESHIP_GAME_ABI,
  address: BATTLESHIP_GAME_ADDRESS as `0x${string}`,
};
