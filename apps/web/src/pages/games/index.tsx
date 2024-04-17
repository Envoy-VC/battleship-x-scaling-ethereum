import React from 'react';

import Link from 'next/link';

import { battleShipContract } from '~/lib/viem';

import { useReadContract } from 'wagmi';

import StartGame from '~/components/StartGame';
import { Button } from '~/components/ui/button';

const shorten = (str: string) => {
  return `${str.slice(0, 6)}...${str.slice(-4)}`;
};

const Games = () => {
  const { data } = useReadContract({
    ...battleShipContract,
    functionName: 'gameId',
    query: {
      gcTime: 1000,
    },
  });

  return (
    <div className='mx-auto my-12 w-full px-12  h-screen'>
      <div className='bg-white/70 flex flex-col w-full px-12 py-6 rounded-sm h-full'>
        <div className='flex flex-row items-center justify-between w-full'>
          <div className='text-4xl font-battleship text-neutral-800'>
            Active Games
          </div>
          <StartGame />
        </div>
        <div className='flex flex-row flex-wrap gap-2 py-5'>
          {Array(Number((data ?? BigInt(0)).toString()))
            .fill(true)
            .map((_, index) => {
              return <GameCard key={index} gameId={BigInt(index)} />;
            })}
        </div>
      </div>
    </div>
  );
};

const GameCard = ({ gameId }: { gameId: bigint }) => {
  const { data: game } = useReadContract({
    ...battleShipContract,
    functionName: 'getGame',
    args: [gameId],
  });

  return (
    <div className='p-3 text-neutral-800 border-black/60 border-[3px] rounded-md aspect-video max-w-sm w-full flex flex-col justify-between gap-2'>
      <div className='flex flex-col gap-2'>
        <span className='text-xl'>
          <span className='font-semibold'>Game Id: </span>
          {gameId.toString()}
        </span>
        <span className='text-xl'>
          <span className='font-semibold'>Player 1: </span>
          {shorten(game?.player1.playerAddress ?? '')}
        </span>
        <span className='text-xl'>
          <span className='font-semibold'>Player 2: </span>
          {shorten(game?.player2.playerAddress ?? '')}
        </span>
        <span className='text-xl'>
          <span className='font-semibold'>Game Started: </span>
          {game?.hasStarted ? 'Yes' : 'No'}
        </span>
      </div>
      <Button className='w-full' asChild>
        <Link href={`/games/${gameId}`}>Go to Game</Link>
      </Button>
    </div>
  );
};
export default Games;
