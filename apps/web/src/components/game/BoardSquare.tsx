import React from 'react';
import { useDrop } from 'react-dnd';

import { useGameStore } from '~/lib/stores';
import { allShips } from '~/lib/stores/game-store';

import { X } from 'lucide-react';

import Ship from './Ship';

import { ShipTypes } from '~/types/game';

interface Props {
  isHit: boolean;
  x: number;
  y: number;
}

const BoardSquare = ({ x, y, isHit }: Props) => {
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
      className='aspect-square w-16 rounded-md bg-[#2f90f1] relative flex items-center justify-center'
 
    >
      {isHit && <X className='z-[1] absolute text-red-400' strokeWidth={3} />}
      {allShips.map((ship) => {
        const type = ship.toUpperCase() as ShipTypes;
        if (isAtPosition(type, [x, y])) {
          return <Ship type={type} x={x} y={y} isHit={isHit} />;
        }
      })}
    </div>
  );
};

export default BoardSquare;
