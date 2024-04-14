// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

struct Game {
    address player1;
    address player2;
    string store_id;
    uint8[] moves;
    uint8 next_turn;
    bool hasEnded;
}

interface IBattleshipGame {
    function createGame(address _player1, address _player2) external;
}
