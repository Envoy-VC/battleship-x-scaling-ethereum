import React from 'react';
import { BarsScale } from 'react-svg-spinners';

import { useRouter } from 'next/router';

import { getUserKeyFromSnap } from '~/lib/helpers/nillion';

import { BATTLESHIP_GAME_ABI } from '~/lib/abi';
import { getBoard, storeBoard } from '~/lib/api';
import { BATTLESHIP_GAME_ADDRESS } from '~/lib/constants.json';
import { useGameStore } from '~/lib/stores';
import { allShips } from '~/lib/stores/game-store';

import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAccount, useWriteContract } from 'wagmi';

import { Board } from '~/components/game';
import { Ship } from '~/components/game';
import { Button } from '~/components/ui/button';
import { GameScreenProps } from '~/components/wrapper/GameStarted';

import { ShipTypes } from '~/types/game';

interface Props extends GameScreenProps {}

const GameNotStarted = ({ game }: Props) => {
  const router = useRouter();
  const { id } = router.query;
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const { setBoard, isAtPosition, getBoard: constructBoard } = useGameStore();
  if (!game) {
    return <></>;
  }
  const playerType =
    game.player1?.playerAddress === address ? 'player1' : 'player2';
  const opponentType = playerType === 'player1' ? 'player2' : 'player1';
  const player = game[playerType];

  const storeId = player.storeId;

  useQuery({
    queryKey: ['user_board'],
    queryFn: async () => {
      if (storeId === '') {
        return null;
      }
      const board = await getBoard({
        store_id: storeId,
      });
      console.log(board);

      setBoard(board);

      return board;
    },
  });

  const onPlaceShips = async () => {
    try {
      const board = constructBoard();
      const key = await getUserKeyFromSnap();
      const user_key = key.user_key;

      if (!user_key) {
        throw new Error('Connect to Nillion');
      }
      console.log(user_key);
      const { store_id } = await storeBoard({
        ...board,
        user_key,
      });
      console.log(store_id);
      const player = playerType === 'player1' ? 0 : 1;
      const gameId = BigInt(id?.at(0) as string);
      await writeContractAsync({
        address: BATTLESHIP_GAME_ADDRESS as `0x${string}`,
        abi: BATTLESHIP_GAME_ABI,
        functionName: 'setStoreId',
        args: [player, gameId, store_id],
      });
    } catch (error) {
      toast.error((error as Error).message);
    }
  };
  return (
    <div className='flex flex-col gap-4 max-w-screen-2xl mx-auto bg-white/80 p-6 rounded-xl my-12 justify-start'>
      <div className='flex flex-row items-center justify-between gap-3'>
        <div className='font-battleship text-neutral-900 text-3xl'>
          Place Battleships
        </div>
        {game[opponentType].storeId === '' && (
          <div className=' text-black flex flex-row items-center gap-2'>
            Waiting for opponent to place ships
            <BarsScale color='#000' />
          </div>
        )}
      </div>

      <div className='flex flex-row gap-4'>
        <Board />
        <div className='flex flex-col gap-2 py-2 justify-between'>
          <div className='flex flex-col gap-2 py-2'>
            {allShips.map((ship, index) => {
              const type = ship.toUpperCase() as ShipTypes;
              return (
                <div
                  key={index}
                  className='flex flex-col items-start gap-1 font-battleship text-3xl text-neutral-900'
                >
                  {type}:{isAtPosition(type, [-1, -1]) && <Ship type={type} />}
                </div>
              );
            })}
          </div>
          <Button onClick={onPlaceShips}>Place Ships</Button>
        </div>
      </div>
    </div>
  );
};

export default GameNotStarted;
