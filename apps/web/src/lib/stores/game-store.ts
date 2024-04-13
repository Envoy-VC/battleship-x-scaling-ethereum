import { create } from 'zustand';

import { ShipTypes } from '~/types/game';

type Position = {
  start: [number, number];
  end: [number, number];
};

const initialPos: Position = {
  start: [-1, -1],
  end: [-1, -1],
};

type GameState = {
  initial: Position;
  carrier: Position;
  battleship: Position;
  cruiser: Position;
  submarine: Position;
  destroyer: Position;
};

type GameActions = {
  isAtPosition: (ship: ShipTypes, position: Position) => boolean;
  moveShip: (ship: ShipTypes, position: Position) => void;
};

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  initial: initialPos,
  carrier: initialPos,
  battleship: initialPos,
  cruiser: initialPos,
  submarine: initialPos,
  destroyer: initialPos,
  moveShip: (ship, position) => {
    set({ [ship.toLowerCase()]: position });
  },
  isAtPosition: (ship, position) => {
    const pos = get()[ship.toLowerCase() as keyof GameState];
    if (
      pos.start[0] === position.start[0] &&
      pos.start[1] === position.start[1] &&
      pos.end[0] === position.end[0] &&
      pos.end[1] === position.end[1]
    )
      return true;
    else return false;
  },
}));
