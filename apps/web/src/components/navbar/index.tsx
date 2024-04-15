import React from 'react';

import { ConnectButton } from '~/components/connect';

const Navbar = () => {
  return (
    <div className='px-4 py-2 w-full flex flex-row items-center justify-between'>
      <div>Battleship-X</div>
      <ConnectButton />
    </div>
  );
};

export default Navbar;
