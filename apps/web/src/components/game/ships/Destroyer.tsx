import React from 'react';
import { useDrag } from 'react-dnd';

import { ShipTypes } from '~/types/game';

const Destroyer = () => {
  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: ShipTypes.DESTROYER,
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
      className='w-6 h-6 bg-black rounded-full'
    ></div>
  );
};

export default Destroyer;
