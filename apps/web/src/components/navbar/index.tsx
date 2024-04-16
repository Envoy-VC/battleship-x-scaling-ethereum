import React from 'react';

import { useIsMounted } from 'usehooks-ts';

import { ConnectButton } from '~/components/connect';

const Navbar = () => {
  const isMounted = useIsMounted();

  return (
    <div className='px-4 py-2 w-full flex flex-row items-center justify-between'>
      <div className='font-battleship font-bold text-4xl text-white tracking-wide'>
        Battleship-X
      </div>
      <ConnectButton />
    </div>
  );
};

export default Navbar;
