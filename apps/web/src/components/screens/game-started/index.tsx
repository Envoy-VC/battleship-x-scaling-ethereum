import React from 'react';

import { getBoard } from '~/lib/api';
import { useGameStore } from '~/lib/stores';

import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

import { Board } from '~/components/game';
import { GameScreenProps } from '~/components/wrapper/GameStarted';

interface Props extends GameScreenProps {}
type PlayerType = 'player1' | 'player2';

const GameStarted = ({ game }: Props) => {
  const { setBoard } = useGameStore();
  const { address } = useAccount();
  if (!game) {
    return <></>;
  }

  const [playerType, opponentType]: [PlayerType, PlayerType] =
    game.player1.playerAddress === address
      ? ['player1', 'player2']
      : ['player2', 'player1'];

  useQuery({
    queryKey: ['player_board'],
    queryFn: async () => {
      if (game[playerType].storeId === '') {
        return null;
      }
      const board = await getBoard({
        store_id: game[playerType].storeId,
      });

      console.log(board);

      setBoard(board);
    },
  });

  return (
    <div className='flex flex-row gap-4 justify-center items-center max-w-screen-2xl mx-auto bg-white/80 p-6 rounded-xl my-12 w-full'>
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
        <Board
          isOpponent={false}
          moves={game[opponentType].moves as number[]}
          gameStarted={true}
        />
      </div>
    </div>
  );
};

export default GameStarted;
