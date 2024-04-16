import React from 'react';

import { GameScreenProps } from '~/components/wrapper/GameStarted';

interface Props extends GameScreenProps {}

const GameEnded = ({ game }: Props) => {
  return <div>GameEnded</div>;
};

export default GameEnded;
