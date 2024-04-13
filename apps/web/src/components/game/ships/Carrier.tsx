import React from 'react';
import { useDrag } from 'react-dnd';

import { useGameStore } from '~/lib/stores';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '~/components/ui/context-menu';

import { ShipTypes } from '~/types/game';

const Carrier = () => {
  const { rotateShip } = useGameStore();
  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: ShipTypes.CARRIER,
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
          className='w-6 h-6 bg-purple-400 rounded-full'
        ></div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={() => rotateShip(ShipTypes.CARRIER)}>
          Rotate
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
};

export default Carrier;
