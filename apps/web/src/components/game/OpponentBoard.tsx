import React from 'react';

import { getUserKeyFromSnap } from '~/lib/helpers/nillion';

import { compute } from '~/lib/api';
import { battleShipContract } from '~/lib/viem';

import { OffChainSignType, SignProtocolClient, SpMode } from '@ethsign/sp-sdk';
import { X } from 'lucide-react';
import { toast } from 'sonner';
import { useWriteContract } from 'wagmi';

import { Button } from '~/components/ui/button';
import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog';

import { GetBoardResponse } from '~/types/api';

const SCHEMA_ID = 'SPS_So1kJ9cJQsKhjr0NqiVnq';

interface Props {
  gameId: bigint;
  moves: number[];
  boards: {
    player: GetBoardResponse;
    opponent: GetBoardResponse;
  };
  allowAttack: boolean;
  playerType: number;
}

const OpponentBoard = ({
  moves,
  boards,
  allowAttack,
  playerType,
  gameId,
}: Props) => {
  const [isAttacking, setIsAttacking] = React.useState<boolean>(false);

  const { writeContractAsync } = useWriteContract();
  const grid: boolean[][] = Array(10).fill(Array(10).fill(true));
  const ships = [
    ...boards.opponent.battleship,
    ...boards.opponent.carrier,
    ...boards.opponent.cruiser,
    ...boards.opponent.destroyer,
    ...boards.opponent.submarine,
  ];

  const allShipsDestroyed = () => {
    return ships.reduce((acc, ship) => acc && moves.includes(ship), true);
  };

  const attack = async (pos: number) => {
    try {
      if (!allowAttack) {
        throw new Error('Not allowed to attack');
      }
      if (allShipsDestroyed()) {
        throw new Error('All ships are destroyed');
      }

      if (moves.includes(pos)) {
        throw new Error('Already Attacked');
      }
      setIsAttacking(true);

      const { user_key } = await getUserKeyFromSnap();
      if (!user_key) return;

      // const client = new SignProtocolClient(SpMode.OffChain, {
      //   signType: OffChainSignType.EvmEip712,
      // });

      // const res = await client.createAttestation({
      //   schemaId: SCHEMA_ID,
      //   data: {
      //     gameId,
      //     playerType,
      //     position: pos,
      //   },
      //   indexingValue: `${gameId.toString()}-${playerType.toString()}-${pos.toString()}`,
      // });

      await writeContractAsync({
        ...battleShipContract,
        functionName: 'playMove',
        args: [playerType, gameId, pos],
      });

      const { result } = await compute({
        ...boards.opponent,
        user_key,
        position: pos,
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
                    <div className='flex flex-col gap-3'>
                      <div className='text-lg font-semibold'>
                        Are you sure you want to Attack{' '}
                        {`${String.fromCharCode(65 + rowIdx)}${eleIdx + 1}`}?
                      </div>
                      <Button
                        disabled={isAttacking}
                        onClick={async () => {
                          await attack(parseInt(`1${eleIdx}${rowIdx}`));
                        }}
                      >
                        {isAttacking ? 'Attacking...' : 'Attack'}
                      </Button>
                    </div>
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
