# ⛴️ BattleshipX

BattleShipX is a secure and private battleship game that can be played with friends. It uses nillion for storing the game state and and blind computation for the game logic.

This project is submission for Scaling Ethereum 2024.

The contracts have been deployed to Arbitrum Sepolia Testnet.

```
BattleshipX: 0xe86b1899376c77e1a109ea2124e462ef58e56897
BattleshipURI Library: 0x8f966BC6Ad2D241a01C1f7634C47c7419Ce96830
```

https://sepolia.arbiscan.io/address/0xe86b1899376c77e1a109ea2124e462ef58e56897
https://sepolia.arbiscan.io/address/0x8f966BC6Ad2D241a01C1f7634C47c7419Ce96830

## How it works?

First user create a profile for the game, using a unique username. The profile is a custom implementation of [ERC-7401: Parent-Governed Non-Fungible Tokens Nesting](https://eips.ethereum.org/EIPS/eip-7401) which brings nestable NFTs to Ethereum.

The main NFT is a on-chain profile NFT which has abilities to track users' game history, stats and other metadata. The profile NFT can have multiple child NFTs which are the game NFTs. These Game NFTs the Battleship Ships the user has eg- Battleship, Cruiser, Destroyer, Submarine and Carrier.

The game logic is computed using blind computation. The game state is stored in nillion. The game state is encrypted and stored in nillion

The game is played in a turn based manner made using Next.js, React DND, wagmi as the major tech stack.
There are also custom solidity contracts for the profile and game management, and a minimal FastAPI server for interacting with nillion and the game.

## How Computations are done?

While storing the secret game state in nillion, it is stored as follows:

```json
{
	"carrier": [101, 102, 103, 104, 105],
	"battleship": [112, 113, 114, 115],
	"cruiser": [121, 122, 123],
	"submarine": [165, 175, 185],
	"destroyer": [191, 192]
}
```

where each number is `1XY` where `X` is the row number and `Y` is the column number. The game state is stored in nillion in encrypted form. `X` and `Y` are in range of 0-9.

**Why extra `1` at start?** The extra `1` is added to make the number 3 digit as zero at the X position will be ignored by the game logic.

When a user attacks a position, the user sends the position to the contract.

For Example: User attacks position `7, 5`. The contract will compute the attack with position `175`, the computation starts at `1` and multiplies it by `(value - position)`

This is done through `Array.reduce` method. The logic is if there is a ship at that position, somewhere in the computation `value == position` and the result becomes `0`. If the result is `0`, the user has hit the ship.

## How to run?

The following repository is a turborepo and divided into the following:

1. `apps/web` - The web application for the game.
2. `packages/nillion` - The nillion contract for computation.
3. `packages/contracts` - The Custom Game contract with ERC-7401 implementation.
4. `packages/api` - A minimal FastAPI server for interacting with nillion and the game.

To run the project, you need to have the following:

1. Node.js
2. nillion
3. foundry
4. Python 3.11

First start by going to the `packages/api` directory and running the following:

```bash
pnpm devnet
```

This will start a local nillion devnet and also write the environment variables to `.env` file in the `api` directory.

Then in another terminal, start the python server by running:

```bash
pnpm dev
```

This will start the FastAPI server.

If you want to run you application on a local anvil instance, in a new terminal run:

```bash
anvil
```

and then deploy the contracts by going to the `packages/contracts` directory and running:

```bash
pnpm deploy
```

At last run the web application by going to the `apps/web` directory and running:

```bash
pnpm dev
```

Make sure you have Foundry added to you metamask and you are connected to the local network.
