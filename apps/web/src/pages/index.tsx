import React from 'react';

import { getUserKeyFromSnap } from '~/lib/helpers/nillion';

import { storeBoard } from '~/lib/api';

import { Button } from '~/components/ui/button';

const Home = () => {
  return (
    <div>
      <Button
        onClick={async () => {
          const res = await getUserKeyFromSnap();
          if (!res) return;
          const { user_key } = res;
          if (!user_key) return;
          console.log(user_key);
          const board = {
            carrier: [134, 135, 136, 137, 138],
            cruiser: [145, 155, 165],
            destroyer: [188, 189],
            battleship: [112, 122, 132, 142],
            submarine: [156, 157, 158],
          };
          const store_board_response = await storeBoard({
            user_key: user_key,
            ...board,
          });
          console.log('Board Stored: ', store_board_response);
        }}
      >
        Get User Key
      </Button>
    </div>
  );
};

export default Home;
