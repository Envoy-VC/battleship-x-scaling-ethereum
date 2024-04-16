import React from 'react';

import { GameScreenProps } from '~/components/wrapper/GameStarted';

interface Props extends GameScreenProps {}

const GameNotStarted = ({ game }: Props) => {
  return <div>GameNotStarted</div>;
};

export default GameNotStarted;
