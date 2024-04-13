import React from 'react';
import { useDrop } from 'react-dnd';

import { useGameStore } from '~/lib/stores';

import Ship from './Ship';

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
        if (type === ShipTypes.CARRIER) {
          moveShip(type, {
            start: [x, x],
            end: [y, y],
          });
        }
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
      className='aspect-square w-10 rounded-sm bg-blue-300 relative flex items-center justify-center'
    >
      {isAtPosition(ShipTypes.CARRIER, {
        start: [x, x],
        end: [y, y],
      }) && <Ship />}
    </div>
  );
};

export default BoardSquare;
