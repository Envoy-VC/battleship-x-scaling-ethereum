import React from 'react';

import { BATTLESHIP_GAME_ABI } from '~/lib/abi';
import { BATTLESHIP_GAME_ADDRESS } from '~/lib/constants.json';

import { useAccount, useReadContracts } from 'wagmi';

interface Props extends React.PropsWithChildren {
  gameId: number;
  notStarted: React.ReactNode;
  started: React.ReactNode;
  ended: React.ReactNode;
}

const GameWrapper = ({ gameId, started, notStarted, ended }: Props) => {
  const { address } = useAccount();
  const contract = {
    abi: BATTLESHIP_GAME_ABI,
    address: BATTLESHIP_GAME_ADDRESS as `0x${string}`,
  } as const;
  const result = useReadContracts({
    contracts: [
      {
        ...contract,
        functionName: 'getGame',
        args: [BigInt(gameId)],
      },
    ],
  });

  const game = result?.data?.[0].result;
  const hasStarted = game?.hasStarted;
  const hasEnded = game?.hasEnded;
  const isPlayer =
    game?.player1?.playerAddress === address ||
    game?.player2?.playerAddress === address;

  if (!isPlayer) {
    return <div>Not a Player</div>;
  }

  if (hasStarted) {
    return <>{started}</>;
  } else if (!hasStarted) {
    return <>{notStarted}</>;
  } else if (hasEnded) {
    return <>{ended}</>;
  }
};

export default GameWrapper;
