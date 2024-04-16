import React from 'react';

import { GameScreenProps } from '~/components/wrapper/GameStarted';

interface Props extends GameScreenProps {}

const GameStarted = ({ game }: Props) => {
  return <div>GameStarted</div>;
};

export default GameStarted;
