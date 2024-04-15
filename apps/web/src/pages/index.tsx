import React from 'react';

import StartGame from '~/components/StartGame';
import Navbar from '~/components/navbar';

const Home = () => {
  return (
    <div className=''>
      <Navbar />
      <StartGame />
    </div>
  );
};

export default Home;
