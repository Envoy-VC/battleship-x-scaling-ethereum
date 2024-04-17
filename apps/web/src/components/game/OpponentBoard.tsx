import React from 'react';

import { battleShipContract } from '~/lib/viem';

import { X } from 'lucide-react';
import { toast } from 'sonner';
import { useWriteContract } from 'wagmi';

import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';

import { GetBoardResponse } from '~/types/api';

interface Props {
  gameId: bigint;
  moves: number[];
  board: GetBoardResponse;
  allowAttack: boolean;
  playerType: number;
}

const OpponentBoard = ({
  moves,
  board,
  allowAttack,
  playerType,
  gameId,
}: Props) => {
  const [isAttacking, setIsAttacking] = React.useState<boolean>(false);
  const { writeContractAsync } = useWriteContract();
  const grid: boolean[][] = Array(10).fill(Array(10).fill(true));
  const ships = [
    ...board.battleship,
    ...board.carrier,
    ...board.cruiser,
    ...board.destroyer,
    ...board.submarine,
  ];

  const allShipsDestroyed = () => {
    return ships.reduce((acc, ship) => acc && moves.includes(ship), true);
  };

  const attack = async (pos: number) => {
    if (!allowAttack) {
      toast.error('Not allowed to attack');
    }
    if (allShipsDestroyed()) {
      toast('All ships are destroyed');
      return;
    }

    if (moves.includes(pos)) {
      toast.error('Invalid Move');
      return;
    }
    try {
      setIsAttacking(true);

      await writeContractAsync({
        ...battleShipContract,
        functionName: 'playMove',
        args: [playerType, gameId, pos],
      });
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setIsAttacking(false);
    }
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
                <Dialog>
                  <DialogTrigger>
                    <div className='aspect-square w-16 rounded-md bg-[#2f90f1] relative flex items-center justify-center'>
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
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>
                        Are you sure you want to Attack{' '}
                        {`${String.fromCharCode(65 + rowIdx)}${eleIdx + 1}`}?
                      </DialogTitle>
                      <Button
                        disabled={isAttacking}
                        onClick={async () => {
                          await attack(parseInt(`1${rowIdx}${eleIdx}`));
                        }}
                      >
                        Attack
                      </Button>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default OpponentBoard;
