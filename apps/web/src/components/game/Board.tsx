import React from 'react';

import BoardSquare from './BoardSquare';

const Board = () => {
  const grid: boolean[][] = Array(10).fill(Array(10).fill(true));

  return (
    <div className='flex flex-col gap-[2px]'>
      {grid.map((row, rowIdx) => {
        return (
          <div className='flex flex-row items-center gap-[2px]' key={rowIdx}>
            {row.map((_, eleIdx) => {
              return <BoardSquare key={eleIdx} x={eleIdx} y={rowIdx} />;
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Board;
