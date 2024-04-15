import React from 'react';

import { getUserKeyFromSnap } from '../helpers/nillion';
import { UserKeyFromSnapResponse } from '../helpers/nillion/getUserKey';

const useNillion = () => {
  const [nillion, setNillion] = React.useState<UserKeyFromSnapResponse>({
    user_key: null,
    connectedToSnap: false,
    message: null,
  });

  return { getUserKey: getUserKeyFromSnap, nillion, setNillion };
};

export default useNillion;
