import React from 'react';
import { useDrag } from 'react-dnd';

import { ShipTypes } from '~/types/game';

const Carrier = () => {
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
    <div
      // @ts-ignore
      ref={drag}
      className='w-6 h-6 bg-purple-400 rounded-full'
    ></div>
  );
};

export default Carrier;
