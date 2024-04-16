import React from 'react';

import Image from 'next/image';

import { BackgroundImage } from '~/assets';

import StartGame from '~/components/StartGame';
import Navbar from '~/components/navbar';

const Home = () => {
  return (
    <div className='relative h-screen'>
      <Image
        src={BackgroundImage.src}
        width={BackgroundImage.width}
        height={BackgroundImage.height}
        alt='background'
        className='w-full h-screen object-cover'
      />
      <div className='absolute top-0 flex w-full h-full flex-col'>
        <Navbar />
      </div>
    </div>
  );
};

export default Home;
