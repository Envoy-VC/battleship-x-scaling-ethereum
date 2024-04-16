import React from 'react';
import { useDrag } from 'react-dnd';

import { getShipColor, getShipLength } from '~/lib/helpers/game';

import { useGameStore } from '~/lib/stores';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '~/components/ui/context-menu';

import { ShipTypes } from '~/types/game';

interface Props {
  type: ShipTypes;
  x?: number;
  y?: number;
}

const Ship = ({ type, x = -1, y = -1 }: Props) => {
  const { rotateShip, isExtreme, getShip } = useGameStore();
  const { orientation } = getShip(type);
  const extreme = isExtreme(type, [x, y]);
  const length = getShipLength(type);

  const getClass = () => {
    if (orientation === 'horizontal') {
      const base = 'w-16 h-12';
      if (extreme === 'start') {
        return `${base} rounded-l-3xl`;
      } else if (extreme === 'end') {
        return `${base} rounded-r-3xl`;
      } else {
        return base;
      }
    } else {
      const base = 'w-12 h-16';
      if (extreme === 'start') {
        return `${base} rounded-t-3xl`;
      } else if (extreme === 'end') {
        return `${base} rounded-b-3xl`;
      } else {
        return base;
      }
    }
  };

  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: type,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    []
  );
  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className='flex w-full h-full'>
          <div
            // @ts-ignore
            ref={drag}
          >
            {x === -1 && y === -1 ? (
              <div
                className='rounded-3xl'
                style={{
                  backgroundColor: getShipColor(type),
                  width: `${length * 36}px`,
                  height: `24px`,
                }}
              ></div>
            ) : (
              <div
                className={getClass()}
                style={{
                  backgroundColor: getShipColor(type),
                }}
              ></div>
            )}
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => rotateShip(type)}>
          Rotate
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default Ship;
