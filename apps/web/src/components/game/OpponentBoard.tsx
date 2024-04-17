import React from 'react';

import { getUserKeyFromSnap } from '~/lib/helpers/nillion';

import { compute } from '~/lib/api';
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
  opponentBoard: GetBoardResponse;
  allowAttack: boolean;
  playerType: number;
}

const OpponentBoard = ({
  moves,
  board,
  allowAttack,
  opponentBoard,
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
      throw new Error('Not allowed to attack');
    }
    if (allShipsDestroyed()) {
      throw new Error('All ships are destroyed');
    }

    if (moves.includes(pos)) {
      throw new Error('Already Attacked');
    }
    try {
      setIsAttacking(true);

      const { user_key } = await getUserKeyFromSnap();
      if (!user_key) return;

      await writeContractAsync({
        ...battleShipContract,
        functionName: 'playMove',
        args: [playerType, gameId, pos],
      });

      const computePos = parseInt(`1${String(pos)[2]}${String(pos)[1]}`);

      const { result } = await compute({
        ...opponentBoard,
        user_key,
        position: computePos,
      });
      if (result === 0) {
        toast.success('Successfully Hit a Ship');
      } else {
        toast.error('Missed');
      }
    } catch (error) {
      toast.error((error as Error).message);
      console.log(error);
    } finally {
      setIsAttacking(false);
    }
  };

  return (
    <div className='flex flex-col gap-[2px]'>
      {grid.map((row, rowIdx) => {
        return (
          <div className='flex flex-row items-center gap-[2px]' key={rowIdx}>
            {row.map((_, eleIdx) => {
              const isHit = (moves ?? []).includes(
                parseInt(`1${eleIdx}${rowIdx}`)
              );
              const isShipHit = ships.includes(parseInt(`1${eleIdx}${rowIdx}`));
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
                          await attack(parseInt(`1${eleIdx}${rowIdx}`));
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
