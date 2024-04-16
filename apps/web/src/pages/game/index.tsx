import React from 'react';

import { useGameStore } from '~/lib/stores';
import { allShips } from '~/lib/stores/game-store';

import { Ship } from '~/components/game';
import { Board } from '~/components/game';

import { ShipTypes } from '~/types/game';

const Game = () => {
  const { isAtPosition } = useGameStore();
  return (
    <div className='p-12'>
      <h1>Game</h1>
      <Board />
      <div className='flex flex-col gap-2 py-2'>
        {allShips.map((ship, index) => {
          const type = ship.toUpperCase() as ShipTypes;
          return (
            <div key={index} className='flex flex-row items-center gap-1'>
              {type}:{isAtPosition(type, [-1, -1]) && <Ship type={type} />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Game;
