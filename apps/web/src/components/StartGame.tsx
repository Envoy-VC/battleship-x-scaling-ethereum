import React from 'react';

import { BATTLESHIP_GAME_ABI } from '~/lib/abi';
import constants from '~/lib/constants.json';

import { toast } from 'sonner';
import { useAccount, useWriteContract } from 'wagmi';
import { useWaitForTransactionReceipt } from 'wagmi';

import { Button } from '~/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';

const StartGame = () => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const { writeContractAsync } = useWriteContract();
  const { address } = useAccount();
  const [opponentAddr, setOpponentAddr] = React.useState<`0x${string}`>();
  const [hash, setHash] = React.useState<`0x${string}`>();

  const { isSuccess, isError, isLoading } = useWaitForTransactionReceipt({
    hash,
  });

  React.useEffect(() => {
    if (isSuccess) {
      toast('Game created successfully');
      setIsOpen(false);
    }
    if (isError) {
      toast('Error creating game');
    }
  }, [isSuccess, isError, isLoading]);

  const onCreate = async () => {
    if (!address) {
      toast('Please connect your wallet');
      return;
    }
    if (!opponentAddr) {
      toast('Opponent address is required');
      return;
    }

    const h = await writeContractAsync({
      abi: BATTLESHIP_GAME_ABI,
      address: constants.BATTLESHIP_GAME_ADDRESS as `0x${string}`,
      functionName: 'createGame',
      args: [address, opponentAddr],
    });
    setHash(h);
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Start Game</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start a new Battleship Game</DialogTitle>
          <div className='flex flex-col gap-4 py-3'>
            <Input
              placeholder='Opponent Address'
              value={opponentAddr}
              onChange={(e) => setOpponentAddr(e.target.value as `0x${string}`)}
            />
            <Button onClick={onCreate} className='w-fit'>
              {isLoading ? 'Creating...' : 'Create Game'}
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default StartGame;
