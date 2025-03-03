import React from 'react';

import BoardSquare from './BoardSquare';

interface Props {
  moves: number[];
  isOpponent: boolean;
  gameStarted: boolean;
}

const Board = ({ moves, isOpponent, gameStarted }: Props) => {
  const grid: boolean[][] = Array(10).fill(Array(10).fill(true));

  return (
    <div className='flex flex-col gap-[2px]'>
      {grid.map((row, rowIdx) => {
        return (
          <div className='flex flex-row items-center gap-[2px]' key={rowIdx}>
            {row.map((_, eleIdx) => {
              const isHit = (moves ?? []).includes(100 + eleIdx * 10 + rowIdx);
              return (
                <BoardSquare
                  key={eleIdx}
                  x={eleIdx}
                  y={rowIdx}
                  isHit={isHit}
                  isOpponent={isOpponent}
                  gameStarted={gameStarted}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default Board;
