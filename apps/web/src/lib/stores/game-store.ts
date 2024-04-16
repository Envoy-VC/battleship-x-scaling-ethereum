import {
  checkConflict,
  getNewPosition,
  getShipLength,
  rotateShip,
} from '~/lib/helpers/game';

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
  getBoard: () => GetBoardResponse;
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
      const l = coordinates.length;
      const startX = parseInt(String(coordinates[0])[1]!);
      const startY = parseInt(String(coordinates[0])[2]!);
      const endX = parseInt(String(coordinates[l - 1])[1]!);
      const endY = parseInt(String(coordinates[l - 1])[2]!);
      console.log({
        startX,
        startY,
        endX,
        endY,
      });
      const orientation = startX === endX ? 'vertical' : 'horizontal';
      const pos: Position = {
        start: [startX, startY],
        end: [endX, endY],
        orientation,
      };
      set({ [ship.toLowerCase()]: pos });
    });
  },
  getBoard: () => {
    const state = get();
    const board: GetBoardResponse = {
      carrier: [],
      battleship: [],
      cruiser: [],
      submarine: [],
      destroyer: [],
    };
    allShips.forEach((ship) => {
      const pos = state[ship.toLowerCase() as ships];
      // add all co-ordinates to array in format 1XY
      if (pos.start[0] === -1) {
        throw new Error(`Ship not placed: ${ship}`);
      }
      const start = parseInt(`1${pos.start[0]}${pos.start[1]}`);
      const end = parseInt(`1${pos.end[0]}${pos.end[1]}`);
      const orientation = Math.abs(end - start) > 6 ? 'vertical' : 'horizontal';
      const init = start > end ? end : start;
      const length = getShipLength(ship.toUpperCase() as ShipTypes);
      for (let i = 0; i < length; i++) {
        const adder = orientation === 'vertical' ? 10 : 1;
        board[ship].push(init + adder * i);
      }
    });
    return board;
  },
}));
