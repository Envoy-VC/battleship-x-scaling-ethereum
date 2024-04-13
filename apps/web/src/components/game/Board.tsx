import React from 'react';

import BoardSquare from './BoardSquare';

const Board = () => {
  const grid: boolean[][] = Array(10).fill(Array(10).fill(true));

  return (
    <div className='flex flex-col gap-1'>
      {grid.map((row, rowIdx) => {
        return (
          <div className='flex flex-row items-center gap-1' key={rowIdx}>
            {row.map((ele, eleIdx) => {
              return <BoardSquare key={eleIdx} x={rowIdx} y={eleIdx} />;
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Board;
