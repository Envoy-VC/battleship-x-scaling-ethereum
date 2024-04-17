import React from 'react';

import { X } from 'lucide-react';

import { GetBoardResponse } from '~/types/api';

interface Props {
  moves: number[];
  board: GetBoardResponse;
  allowAttack: boolean;
}

const OpponentBoard = ({ moves, board, allowAttack }: Props) => {
  const grid: boolean[][] = Array(10).fill(Array(10).fill(true));
  const ships = [
    ...board.battleship,
    ...board.carrier,
    ...board.cruiser,
    ...board.destroyer,
    ...board.submarine,
  ];

  const attack = async (pos: number) => {
    console.log(pos);
  };

  return (
    <div className='flex flex-col gap-[2px]'>
      {grid.map((row, rowIdx) => {
        return (
          <div className='flex flex-row items-center gap-[2px]' key={rowIdx}>
            {row.map((_, eleIdx) => {
              const isHit = (moves ?? []).includes(
                parseInt(`1${rowIdx}${eleIdx}`)
              );
              const isShipHit = ships.includes(parseInt(`1${rowIdx}${eleIdx}`));
              return (
                <div
                  className='aspect-square w-16 rounded-md bg-[#2f90f1] relative flex items-center justify-center'
                  onClick={async () => {
                    await attack(parseInt(`1${rowIdx}${eleIdx}`));
                  }}
                >
                  {isHit && !isShipHit && (
                    <X
                      className='z-[1] absolute text-red-400'
                      strokeWidth={3}
                    />
                  )}
                  {isHit && isShipHit && (
                    <div className='text-4xl flex justify-center items-center h-full'>
                      💥
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default OpponentBoard;
