import React from 'react';

import { useGameStore } from '~/lib/stores';

import { Board, Ship } from '~/components/game';

import { ShipTypes } from '~/types/game';

const Game = () => {
  const { isAtPosition, initial } = useGameStore();
  return (
    <div className='p-12'>
      <h1>Game</h1>
      <Board />
      {isAtPosition(ShipTypes.CARRIER, initial) && <Ship />}
    </div>
  );
};

export default Game;
