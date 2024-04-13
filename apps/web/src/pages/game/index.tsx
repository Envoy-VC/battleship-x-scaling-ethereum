import React from 'react';

import { useGameStore } from '~/lib/stores';

import { Board } from '~/components/game';
import {
  Battleship,
  Carrier,
  Cruiser,
  Destroyer,
  Submarine,
} from '~/components/game/ships';

import { ShipTypes } from '~/types/game';

const Game = () => {
  const { isAtPosition, initial } = useGameStore();
  return (
    <div className='p-12'>
      <h1>Game</h1>
      <Board />
      <div className='flex flex-col gap-2 py-2'>
        <div className='flex flex-row items-center gap-1'>
          Carrier:
          {isAtPosition(ShipTypes.CARRIER, [-1, -1]) && <Carrier />}
        </div>
        <div className='flex flex-row items-center gap-2'>
          Battleship:
          {isAtPosition(ShipTypes.BATTLESHIP, [-1, -1]) && <Battleship />}
        </div>
        <div className='flex flex-row items-center gap-2'>
          Cruiser:
          {isAtPosition(ShipTypes.CRUISER, [-1, -1]) && <Cruiser />}
        </div>
        <div className='flex flex-row items-center gap-2'>
          Destroyer:
          {isAtPosition(ShipTypes.DESTROYER, [-1, -1]) && <Destroyer />}
        </div>
        <div className='flex flex-row items-center gap-2'>
          Submarine:
          {isAtPosition(ShipTypes.SUBMARINE, [-1, -1]) && <Submarine />}
        </div>
      </div>
    </div>
  );
};

export default Game;
