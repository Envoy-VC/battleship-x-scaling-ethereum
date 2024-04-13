import React from 'react';
import { useDrag } from 'react-dnd';

import { ShipTypes } from '~/types/game';

const Submarine = () => {
  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: ShipTypes.SUBMARINE,
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
      className='w-6 h-6 bg-blue-700 rounded-full'
    ></div>
  );
};

export default Submarine;
