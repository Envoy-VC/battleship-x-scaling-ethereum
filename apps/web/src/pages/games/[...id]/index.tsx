import React from 'react';

import { useRouter } from 'next/router';

import { GameWrapper } from '~/components/wrapper';

const Game = () => {
  const router = useRouter();
  const { id } = router.query as { id: string[] };
  if (id)
    return (
      <GameWrapper
        gameId={parseInt(id.at(0) ?? '0')}
        started={<div>Game Started</div>}
        notStarted={<div>Game Not Started</div>}
        ended={<div>Game Ended</div>}
      />
    );
};

export default Game;
