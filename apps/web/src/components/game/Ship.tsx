import React from 'react';
import { useDrag } from 'react-dnd';

import { getShipColor } from '~/lib/helpers/game';

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
}

const Ship = ({ type }: Props) => {
  const { rotateShip } = useGameStore();

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
        <div
          // @ts-ignore
          ref={drag}
          className='w-6 h-6 rounded-full'
          style={{
            backgroundColor: getShipColor(type),
          }}
        ></div>
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
