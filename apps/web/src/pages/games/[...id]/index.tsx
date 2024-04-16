import React from 'react';

import { useRouter } from 'next/router';

import { GameEnded, GameNotStarted, GameStarted } from '~/components/screens';
import { GameWrapper } from '~/components/wrapper';

const Game = () => {
  const router = useRouter();
  const { id } = router.query as { id: string[] };
  if (id)
    return (
      <GameWrapper
        gameId={parseInt(id.at(0) ?? '0')}
        started={(props) => <GameStarted {...props} />}
        notStarted={(props) => <GameNotStarted {...props} />}
        ended={(props) => <GameEnded {...props} />}
      />
    );
};

export default Game;
