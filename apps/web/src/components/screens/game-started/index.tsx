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

  // const [ob, setOB] = React.useState<GetBoardResponse | null>(null);
  // const [pb, setPb] = React.useState<GetBoardResponse | null>(null);

  const [playerType, opponentType]: [PlayerType, PlayerType] =
    game.player1.playerAddress === address
      ? ['player1', 'player2']
      : ['player2', 'player1'];

  const player = game[playerType];
  const opponent = game[opponentType];

  const nextTurn = game.next_turn === 0 ? 'player1' : 'player2';
  const nextTurnMsg = playerType === nextTurn ? 'Your turn' : 'Opponent turn';
  const isMyTurn = nextTurnMsg === 'Your turn';

  const { isPending, data } = useQuery({
    queryKey: ['player_storeIds', player.storeId, opponent.storeId],
    staleTime: 600000,
    queryFn: async () => {
      console.log(player)
      const playerBoard = await getBoard({
        store_id: game[playerType].storeId,
      });

      const opponentBoard = await getBoard({
        store_id: game[opponentType].storeId,
      });

      const result = { opponent: opponentBoard, player: playerBoard };
      console.log(result);
      setBoard(playerBoard);
      return result;
    },
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
            {data && (
              <OpponentBoard
                gameId={gameId}
                playerType={opponentType === 'player2' ? 0 : 1}
                allowAttack={isMyTurn}
                boards={data}
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
