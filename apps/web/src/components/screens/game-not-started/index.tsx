import React from 'react';

import { getBoard, storeSecret } from '~/lib/api';
import { useGameStore } from '~/lib/stores';
import { allShips } from '~/lib/stores/game-store';

import { useQuery } from '@tanstack/react-query';
import { useAccount } from 'wagmi';

import { Board } from '~/components/game';
import { Ship } from '~/components/game';
import { Button } from '~/components/ui/button';
import { GameScreenProps } from '~/components/wrapper/GameStarted';

import { ShipTypes } from '~/types/game';

interface Props extends GameScreenProps {}

const GameNotStarted = ({ game }: Props) => {
  const { address } = useAccount();
  const { setBoard, isAtPosition } = useGameStore();
  if (!game) {
    return <></>;
  }
  const player =
    game.player1?.playerAddress === address ? game.player1 : game.player2;

  const storeId = player.storeId;

  const result = useQuery({
    queryKey: ['user_board'],
    queryFn: async () => {
      if (storeId === '') {
        return null;
      }
      const board = await getBoard({
        store_id: storeId,
      });

      setBoard(board);

      return board;
    },
  });
  return (
    <div className='flex flex-row gap-4'>
      <Board />
      <div className='flex flex-col gap-2 py-2'>
        {allShips.map((ship, index) => {
          const type = ship.toUpperCase() as ShipTypes;
          return (
            <div
              key={index}
              className='flex flex-row items-center gap-1 font-battleship text-3xl'
            >
              {type}:{isAtPosition(type, [-1, -1]) && <Ship type={type} />}
            </div>
          );
        })}
      </div>
      <Button
        onClick={async () => {
          const res = await storeSecret({
            name: 'test',
            value: 'adad',
            user_key: '',
          });
          console.log(res);
        }}
      >
        Store Blob
      </Button>
    </div>
  );
};

export default GameNotStarted;
