import React from 'react';

import { Copy } from 'lucide-react';
import { useCopyToClipboard } from 'usehooks-ts';
import { useAccount, useEnsAvatar, useEnsName } from 'wagmi';

import { Dialog, DialogContent, DialogTrigger } from '~/components/ui/dialog';

import { Button } from '../ui/button';

const shorten = (str: string) => {
  return `${str.slice(0, 6)}...${str.slice(-4)}`;
};

const AccountModal = () => {
  const [copyVal, copy] = useCopyToClipboard();
  const { address } = useAccount();
  const { data } = useEnsName({
    address,
  });

  console.log(data);

  const { data: avatar } = useEnsAvatar({
    name: data ?? '',
  });

  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <Button
            variant='secondary'
            className='flex flex-row items-center gap-2'
          >
            <img
              src={
                avatar ??
                `https://api.dicebear.com/8.x/identicon/svg?seed=${avatar}
`
              }
              className='rounded-full h-7 w-7'
            />
            <div className='font-medium'>{data ?? shorten(address ?? '')}</div>
          </Button>
        </DialogTrigger>
        <DialogContent>
          <div className='p-6 flex flex-col gap-3 items-center justify-center'>
            <img
              src={
                avatar ??
                `https://api.dicebear.com/8.x/identicon/svg?seed=${avatar}
`
              }
              className='rounded-full h-28 w-28'
            />
            <div className='flex flex-row items-center gap-2 font-medium'>
              <div className=' text-lg '>{data ?? shorten(address ?? '')}</div>
              <Button
                size='icon'
                variant='ghost'
                className='w-5 h-5'
                onClick={() => copy(address ?? '')}
              >
                <Copy size={16} className='p-0' />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AccountModal;
