import React from 'react';

import { useRouter } from 'next/router';

import { getBoard } from '~/lib/api';
import { useGameStore } from '~/lib/stores';

import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

import { Board } from '~/components/game';
import OpponentBoard from '~/components/game/OpponentBoard';
import { GameScreenProps } from '~/components/wrapper/GameStarted';

import { GetBoardResponse } from '~/types/api';

interface Props extends GameScreenProps {}
type PlayerType = 'player1' | 'player2';

const GameStarted = ({ game }: Props) => {
  const router = useRouter();
  const { id } = router.query;
  const gameId = BigInt(id?.at(0) as string);
  const { setBoard } = useGameStore();
  const { address } = useAccount();
  if (!game) {
    return <></>;
  }

  const [opponentBoard, setOB] = React.useState<GetBoardResponse | null>(null);

  const [playerType, opponentType]: [PlayerType, PlayerType] =
    game.player1.playerAddress === address
      ? ['player1', 'player2']
      : ['player2', 'player1'];

  const nextTurn = game.next_turn === 0 ? 'player1' : 'player2';
  const nextTurnMsg = playerType === nextTurn ? 'Your turn' : 'Opponent turn';
  const isMyTurn = nextTurnMsg === 'Your turn';

  const { isPending } = useQuery({
    queryKey: [
      game[playerType].storeId,
      game[opponentType].storeId,
      'player_storeIds',
    ],
    queryFn: async () => {
      if (game[playerType].storeId === '') {
        return {};
      }
      if (game[opponentType].storeId === '') {
        return {};
      }

      const playerBoard = await getBoard({
        store_id: game[playerType].storeId,
      });

      const opponentBoard = await getBoard({
        store_id: game[opponentType].storeId,
      });
      setOB(opponentBoard);
      setBoard(playerBoard);
    },
    enabled: opponentBoard === null,
  });

  if (isPending) {
    return <div>Loading...</div>;
  } else
    return (
      <div className='flex flex-col gap-4 justify-center items-center max-w-screen-2xl mx-auto bg-white/80 p-6 rounded-xl my-12 w-full'>
        <div className='flex flex-row gap-4 justify-center items-center w-full'>
          <div className='basis-1/2 w-full flex flex-col gap-2 items-center'>
            <div className='text-neutral-800 font-battleship text-3xl text-center'>
              You
            </div>
            <Board
              isOpponent={false}
              moves={game[opponentType].moves as number[]}
              gameStarted={true}
            />
          </div>
          <div className='basis-1/2 w-full flex flex-col gap-2 items-center'>
            <div className='text-neutral-800 font-battleship text-3xl text-center'>
              Opponent
            </div>
            {opponentBoard && (
              <OpponentBoard
                gameId={gameId}
                playerType={opponentType === 'player2' ? 1 : 0}
                allowAttack={isMyTurn}
                board={opponentBoard}
                moves={game[playerType].moves as number[]}
              />
            )}
          </div>
        </div>
        <div className='text-neutral-800 font-battleship text-3xl text-center'>
          {nextTurnMsg}
        </div>
      </div>
    );
};

export default GameStarted;
