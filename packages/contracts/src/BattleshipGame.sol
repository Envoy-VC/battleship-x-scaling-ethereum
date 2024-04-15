// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./interfaces/IBattleshipGame.sol";

contract BattleshipGame is Ownable, IBattleshipGame {
    uint256 public gameId;
    mapping(uint256 => Game) public games;

    constructor(address _initialOwner) Ownable(_initialOwner) {}

    function createGame(address _player1, address _player2) external {
        games[gameId] = Game({
            player1: Player(_player1, ""),
            player2: Player(_player2, ""),
            moves: new uint8[](100),
            next_turn: PlayerType.Player1,
            hasEnded: false,
            winner: address(0)
        });

        gameId++;
    }

    function getGame(uint256 _gameId) external view returns (Game memory) {
        return games[_gameId];
    }

    function onlyPlayer(Game memory game, PlayerType player) internal view {
        if (player == PlayerType.Player1) {
            if (game.player1.playerAddress != msg.sender) {
                revert NotAPlayer();
            }
        } else if (player == PlayerType.Player2) {
            if (game.player2.playerAddress != msg.sender) {
                revert NotAPlayer();
            }
        } else {
            revert InvalidPlayer();
        }
    }

    function setStoreId(PlayerType player, uint256 _gameId, string memory _storeId) external {
        Game storage game = games[_gameId];
        if (player == PlayerType.Player1) {
            onlyPlayer(game, player);
            game.player1.storeId = _storeId;
        } else if (player == PlayerType.Player2) {
            onlyPlayer(game, player);
            game.player2.storeId = _storeId;
        } else {
            revert InvalidPlayer();
        }
    }

    function checkDuplicate(uint8[] memory moves, uint8 move) internal pure {
        for (uint256 i = 0; i < moves.length; i++) {
            if (moves[i] == move) {
                revert DuplicateMove();
            }
        }
    }

    function playMove(PlayerType player, uint256 _gameId, uint8 move) external {
        Game storage game = games[_gameId];
        if (game.hasEnded) {
            revert GameEnded();
        }

        if (player != game.next_turn) {
            revert InvalidTurn();
        }

        if (player == PlayerType.Player1) {
            onlyPlayer(game, player);
        } else if (player == PlayerType.Player2) {
            onlyPlayer(game, player);
        } else {
            revert InvalidPlayer();
        }

        checkDuplicate(game.moves, move);
        game.moves.push(move);

        if (player == PlayerType.Player1) {
            game.next_turn = PlayerType.Player2;
        } else {
            game.next_turn = PlayerType.Player1;
        }
    }

    function endGame(uint256 _gameId, address _winner) external onlyOwner {
        Game storage game = games[_gameId];
        game.hasEnded = true;
        game.winner = _winner;
    }
}
