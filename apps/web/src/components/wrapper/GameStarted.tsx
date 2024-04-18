import React from 'react';

import { BATTLESHIP_GAME_ABI } from '~/lib/abi';
import { BATTLESHIP_GAME_ADDRESS } from '~/lib/constants.json';

import { AbiParameterToPrimitiveType } from 'abitype';
import { useAccount, useReadContracts } from 'wagmi';

const GetGameABI = Array.from(BATTLESHIP_GAME_ABI).find(
  (a) => a.type === 'function' && a.name === 'getGame'
)!;

export type GameType = AbiParameterToPrimitiveType<
  (typeof GetGameABI)['outputs']['0']
>;

// other props any number of props
export interface GameScreenProps {
  game: GameType | undefined;
}

type GameScreen = (props: GameScreenProps) => React.JSX.Element;

interface Props extends React.PropsWithChildren {
  gameId: number;
  NotStarted: GameScreen;
  Started: GameScreen;
  Ended: GameScreen;
}

const GameWrapper = ({ gameId, Started, NotStarted, Ended }: Props) => {
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

  if (!game) {
    return <></>;
  }
  const hasStarted = game?.hasStarted;
  const hasEnded = game?.hasEnded;
  const isPlayer =
    game?.player1?.playerAddress === address ||
    game?.player2?.playerAddress === address;

  if (!isPlayer) {
    return <div>Not a Player</div>;
  }

  if (hasStarted) {
    return <>{Started({ game })}</>;
  } else if (!hasStarted) {
    return <>{NotStarted({ game })}</>;
  } else if (hasEnded) {
    return <>{Ended({ game })}</>;
  }
};

export default GameWrapper;
