import React from 'react';
import { useDrop } from 'react-dnd';

import { useGameStore } from '~/lib/stores';

import { Battleship, Carrier, Cruiser, Destroyer, Submarine } from './ships';

import { ShipTypes } from '~/types/game';

interface Props {
  x: number;
  y: number;
}

const BoardSquare = ({ x, y }: Props) => {
  const { moveShip, isAtPosition } = useGameStore();
  const [{ isOver, canDrop }, drop] = useDrop<
    unknown,
    unknown,
    {
      isOver: boolean;
      canDrop: boolean;
    }
  >(
    () => ({
      accept: [
        ShipTypes.CARRIER,
        ShipTypes.BATTLESHIP,
        ShipTypes.CRUISER,
        ShipTypes.SUBMARINE,
        ShipTypes.DESTROYER,
      ],
      canDrop: () => true,
      drop: (item, monitor) => {
        const type = monitor.getItemType() as ShipTypes;
        moveShip(type, [x, y]);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
        canDrop: !!monitor.canDrop(),
      }),
    }),
    []
  );

  return (
    <div
      // @ts-ignore
      ref={drop}
      className='aspect-square w-16 rounded-md bg-blue-300 relative flex items-center justify-center'
    >
      {isAtPosition(ShipTypes.CARRIER, [x, y]) && <Carrier />}
      {isAtPosition(ShipTypes.BATTLESHIP, [x, y]) && <Battleship />}
      {isAtPosition(ShipTypes.CRUISER, [x, y]) && <Cruiser />}
      {isAtPosition(ShipTypes.DESTROYER, [x, y]) && <Destroyer />}
      {isAtPosition(ShipTypes.SUBMARINE, [x, y]) && <Submarine />}
    </div>
  );
};

export default BoardSquare;
