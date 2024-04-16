import { checkConflict, getNewPosition, rotateShip } from '~/lib/helpers/game';

import { create } from 'zustand';

import { GetBoardResponse } from '~/types/api';
import { ShipTypes } from '~/types/game';

export type Position = {
  start: [number, number];
  end: [number, number];
  orientation: 'vertical' | 'horizontal';
};

const initialPos: Position = {
  start: [-1, -1],
  end: [-1, -1],
  orientation: 'horizontal',
};

export const allShips = [
  'carrier',
  'battleship',
  'cruiser',
  'submarine',
  'destroyer',
] as const;
type ships = (typeof allShips)[number];

export type GameState = {
  initial: Position;
  carrier: Position;
  battleship: Position;
  cruiser: Position;
  submarine: Position;
  destroyer: Position;
};

type GameActions = {
  isAtPosition: (ship: ShipTypes, position: [number, number]) => boolean;
  moveShip: (ship: ShipTypes, position: [number, number]) => void;
  rotateShip: (ship: ShipTypes) => void;
  getShip: (ship: ShipTypes) => Position;
  isExtreme: (
    ship: ShipTypes,
    position: [number, number]
  ) => 'start' | 'end' | null;
  setBoard: (res: GetBoardResponse) => void;
};

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  initial: initialPos,
  carrier: initialPos,
  battleship: initialPos,
  cruiser: initialPos,
  submarine: initialPos,
  destroyer: initialPos,
  moveShip: (ship, position) => {
    const currentPos = get()[ship.toLowerCase() as ships];
    const x = position[0];
    const y = position[1];

    const newPos = getNewPosition(ship, x, y, currentPos);
    const hasConflict = checkConflict(ship, newPos, get());
    if (!hasConflict) set({ [ship.toLowerCase()]: newPos });
  },
  rotateShip: (ship) => {
    const newPos = rotateShip(ship, get());
    const hasConflict = checkConflict(ship, newPos, get());
    if (!hasConflict) set({ [ship.toLowerCase()]: newPos });
  },
  isAtPosition: (ship, position) => {
    const pos = get()[ship.toLowerCase() as ships];
    const inX = position[0] >= pos.start[0] && position[0] <= pos.end[0];
    const inY = position[1] >= pos.start[1] && position[1] <= pos.end[1];

    if (inX && inY) return true;
    else return false;
  },
  isExtreme: (ship, position) => {
    const [x, y] = position;
    const pos = get()[ship.toLowerCase() as ships];
    const isStart = x === pos.start[0] && y === pos.start[1];
    const isEnd = x === pos.end[0] && y === pos.end[1];

    if (isStart) return 'start';
    if (isEnd) return 'end';
    return null;
  },
  getShip: (ship) => get()[ship.toLowerCase() as ships],
  setBoard: (res) => {
    const ships = Object.keys(res) as ships[];
    ships.forEach((ship) => {
      const coordinates = res[ship];
      const startX = Math.round((coordinates[0]! - 100) / 10);
      const startY = (coordinates[0]! - 100) % 10;
      const endX = Math.round((coordinates[-1]! - 100) / 10);
      const endY = (coordinates[-1]! - 100) % 10;
      const orientation = startX === endX ? 'horizontal' : 'vertical';
      const pos: Position = {
        start: [startX, startY],
        end: [endX, endY],
        orientation,
      };
      set({ [ship.toLowerCase()]: pos });
    });
  },
}));
