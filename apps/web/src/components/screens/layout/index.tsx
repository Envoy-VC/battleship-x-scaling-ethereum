import React from 'react';

import Image from 'next/image';
import { useRouter } from 'next/router';

import { BackgroundImage } from '~/assets';

import Navbar from '~/components/navbar';

interface Props extends React.PropsWithChildren {}

const Layout = ({ children }: Props) => {
  const { pathname } = useRouter();
  const isHome = pathname === '/';
  return (
    <div className='relative h-screen text-white'>
      <Image
        src={BackgroundImage.src}
        width={BackgroundImage.width}
        height={BackgroundImage.height}
        alt='background'
        className='w-full h-screen object-cover'
        style={{
          filter: isHome ? 'brightness(1)' : 'brightness(0.65)',
        }}
      />
      <div className='absolute top-0 flex w-full h-full flex-col'>
        <Navbar />
        {children}
      </div>
    </div>
  );
};

export default Layout;
