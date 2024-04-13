import React from 'react';
import { useDrag } from 'react-dnd';

import { ShipTypes } from '~/types/game';

const Cruiser = () => {
  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: ShipTypes.CRUISER,
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    }),
    []
  );
  return (
    <div
      // @ts-ignore
      ref={drag}
      className='w-6 h-6 bg-green-400 rounded-full'
    ></div>
  );
};

export default Cruiser;
