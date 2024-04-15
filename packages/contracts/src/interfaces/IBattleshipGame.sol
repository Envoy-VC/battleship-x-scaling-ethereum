// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

enum PlayerType {
    Player1,
    Player2
}

struct Player {
    address playerAddress;
    string storeId;
    uint8[] moves;
}

struct Game {
    Player player1;
    Player player2;
    PlayerType next_turn;
    bool hasStarted;
    bool hasEnded;
    address winner;
}

error InvalidPlayer();
error NotAPlayer();
error InvalidTurn();
error GameEnded();
error DuplicateMove();
error GameAlreadyStarted();

interface IBattleshipGame {
    function createGame(address _player1, address _player2) external;
    function setStoreId(PlayerType player, uint256 _gameId, string memory _storeId) external;
    function playMove(PlayerType player, uint256 _gameId, uint8 move) external;
    function endGame(uint256 _gameId, address _winner) external;
}
