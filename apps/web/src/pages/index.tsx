import React from 'react';

import { getUserKeyFromSnap } from '~/lib/helpers/nillion';

import {
  retrieveSecrets,
  storeBoard,
  storeSecret,
  updateSecret,
} from '~/lib/api';

import { Button } from '~/components/ui/button';

const Home = () => {
  return (
    <div>
      <Button
        onClick={async () => {
          try {
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
            const res2 = await storeSecret({
              name: 'moves',
              value: [100],
              user_key: '',
            });
            console.log('Moves Stored: ', res2.store_id, ' Value', [100]);
            console.log('Playing Move 134');
            const res3 = await updateSecret({
              store_id: res2.store_id,
              name: 'moves',
              value: [100, 134],
              user_key: '',
            });
            const res4 = await retrieveSecrets({
              store_id: res2.store_id,
              user_key: '',
              secret_name: 'moves',
              type: 'SecretArray',
            });
            console.log('Moves Retrieved: ', res4.result);
          } catch (error) {
            console.log(error);
          }
        }}
      >
        Get User Key
      </Button>
    </div>
  );
};

export default Home;
