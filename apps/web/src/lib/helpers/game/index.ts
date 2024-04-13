import { GameState, Position, allShips } from '~/lib/stores/game-store';

import { ShipTypes } from '~/types/game';

const getShipLength = (ship: ShipTypes): number => {
  switch (ship) {
    case ShipTypes.CARRIER:
      return 5;
    case ShipTypes.BATTLESHIP:
      return 4;
    case ShipTypes.CRUISER:
      return 3;
    case ShipTypes.SUBMARINE:
      return 3;
    case ShipTypes.DESTROYER:
      return 2;
    default:
      return 0;
  }
};

export const getNewPosition = (
  ship: ShipTypes,
  x: number,
  y: number,
  currentPos: Position
): Position => {
  const shipLength = getShipLength(ship);
  const evenLengthMakeup = shipLength % 2 === 0 ? 1 : 0;
  const half = Math.floor(shipLength / 2);
  const orientation = currentPos.orientation;

  if (orientation === 'horizontal') {
    const isInBounds = x - half >= 0 && x + half - evenLengthMakeup <= 9;
    if (isInBounds) {
      return {
        start: [x - half, y],
        end: [x + half - evenLengthMakeup, y],
        orientation,
      } as Position;
    } else {
      return currentPos;
    }
  } else {
    const isInBounds = y - half >= 0 && y + half - evenLengthMakeup <= 9;
    if (isInBounds) {
      return {
        start: [x, y - half],
        end: [x, y + half - evenLengthMakeup],
        orientation,
      } as Position;
    } else {
      return currentPos;
    }
  }
};

export const checkConflict = (
  ship: ShipTypes,
  newPos: Position,
  state: GameState
) => {
  const shipsToCheck = allShips.filter((s) => s !== ship.toLowerCase());

  console.log(shipsToCheck);

  const conflicts: boolean[] = [];

  for (const s of shipsToCheck) {
    const pos = state[s as keyof GameState];
    const inX = newPos.start[0] <= pos.end[0] && newPos.end[0] >= pos.start[0];
    const inY = newPos.start[1] <= pos.end[1] && newPos.end[1] >= pos.start[1];

    if (inX && inY) {
      conflicts.push(true);
    } else {
      conflicts.push(false);
    }
  }

  return conflicts.includes(true);
};
