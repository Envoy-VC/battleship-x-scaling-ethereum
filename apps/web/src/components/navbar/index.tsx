import React from 'react';

import Link from 'next/link';

import { ConnectButton } from '~/components/connect';

import { Button } from '../ui/button';

const Navbar = () => {
  return (
    <div className='px-4 py-2 w-full flex flex-row items-center justify-between'>
      <Link
        href='/'
        className='font-battleship font-bold text-4xl text-white tracking-wide'
      >
        Battleship-X
      </Link>
      <div className='flex flex-row items-center gap-2'>
        <Button asChild>
          <Link href='/games'>Games</Link>
        </Button>
        <ConnectButton />
      </div>
    </div>
  );
};

export default Navbar;
