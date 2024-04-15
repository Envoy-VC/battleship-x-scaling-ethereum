export const BATTLESHIP_GAME_ABI = [
  {
    type: 'constructor',
    inputs: [
      { name: '_initialOwner', type: 'address', internalType: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'createGame',
    inputs: [
      { name: '_player1', type: 'address', internalType: 'address' },
      { name: '_player2', type: 'address', internalType: 'address' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'endGame',
    inputs: [
      { name: '_gameId', type: 'uint256', internalType: 'uint256' },
      { name: '_winner', type: 'address', internalType: 'address' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'gameId',
    inputs: [],
    outputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'games',
    inputs: [{ name: '', type: 'uint256', internalType: 'uint256' }],
    outputs: [
      {
        name: 'player1',
        type: 'tuple',
        internalType: 'struct Player',
        components: [
          { name: 'playerAddress', type: 'address', internalType: 'address' },
          { name: 'storeId', type: 'string', internalType: 'string' },
          { name: 'moves', type: 'uint8[]', internalType: 'uint8[]' },
        ],
      },
      {
        name: 'player2',
        type: 'tuple',
        internalType: 'struct Player',
        components: [
          { name: 'playerAddress', type: 'address', internalType: 'address' },
          { name: 'storeId', type: 'string', internalType: 'string' },
          { name: 'moves', type: 'uint8[]', internalType: 'uint8[]' },
        ],
      },
      { name: 'next_turn', type: 'uint8', internalType: 'enum PlayerType' },
      { name: 'hasStarted', type: 'bool', internalType: 'bool' },
      { name: 'hasEnded', type: 'bool', internalType: 'bool' },
      { name: 'winner', type: 'address', internalType: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getGame',
    inputs: [{ name: '_gameId', type: 'uint256', internalType: 'uint256' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        internalType: 'struct Game',
        components: [
          {
            name: 'player1',
            type: 'tuple',
            internalType: 'struct Player',
            components: [
              {
                name: 'playerAddress',
                type: 'address',
                internalType: 'address',
              },
              { name: 'storeId', type: 'string', internalType: 'string' },
              { name: 'moves', type: 'uint8[]', internalType: 'uint8[]' },
            ],
          },
          {
            name: 'player2',
            type: 'tuple',
            internalType: 'struct Player',
            components: [
              {
                name: 'playerAddress',
                type: 'address',
                internalType: 'address',
              },
              { name: 'storeId', type: 'string', internalType: 'string' },
              { name: 'moves', type: 'uint8[]', internalType: 'uint8[]' },
            ],
          },
          {
            name: 'next_turn',
            type: 'uint8',
            internalType: 'enum PlayerType',
          },
          { name: 'hasStarted', type: 'bool', internalType: 'bool' },
          { name: 'hasEnded', type: 'bool', internalType: 'bool' },
          { name: 'winner', type: 'address', internalType: 'address' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'owner',
    inputs: [],
    outputs: [{ name: '', type: 'address', internalType: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'playMove',
    inputs: [
      { name: 'player', type: 'uint8', internalType: 'enum PlayerType' },
      { name: '_gameId', type: 'uint256', internalType: 'uint256' },
      { name: 'move', type: 'uint8', internalType: 'uint8' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'renounceOwnership',
    inputs: [],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setStoreId',
    inputs: [
      { name: 'player', type: 'uint8', internalType: 'enum PlayerType' },
      { name: '_gameId', type: 'uint256', internalType: 'uint256' },
      { name: '_storeId', type: 'string', internalType: 'string' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'transferOwnership',
    inputs: [{ name: 'newOwner', type: 'address', internalType: 'address' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    name: 'GameStarted',
    inputs: [
      {
        name: 'gameId',
        type: 'uint256',
        indexed: false,
        internalType: 'uint256',
      },
    ],
    anonymous: false,
  },
  {
    type: 'event',
    name: 'OwnershipTransferred',
    inputs: [
      {
        name: 'previousOwner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
      {
        name: 'newOwner',
        type: 'address',
        indexed: true,
        internalType: 'address',
      },
    ],
    anonymous: false,
  },
  { type: 'error', name: 'DuplicateMove', inputs: [] },
  { type: 'error', name: 'GameAlreadyStarted', inputs: [] },
  { type: 'error', name: 'GameEnded', inputs: [] },
  { type: 'error', name: 'InvalidPlayer', inputs: [] },
  { type: 'error', name: 'InvalidTurn', inputs: [] },
  { type: 'error', name: 'NotAPlayer', inputs: [] },
  {
    type: 'error',
    name: 'OwnableInvalidOwner',
    inputs: [{ name: 'owner', type: 'address', internalType: 'address' }],
  },
  {
    type: 'error',
    name: 'OwnableUnauthorizedAccount',
    inputs: [{ name: 'account', type: 'address', internalType: 'address' }],
  },
] as const;
