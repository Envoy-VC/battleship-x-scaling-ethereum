// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "./interfaces/IBattleshipGame.sol";

contract BattleshipGame is IBattleshipGame {
    uint256 public gameId;
    mapping(uint256 => Game) public games;

    constructor() {}

    function createGame(address _player1, address _player2) external {
        games[gameId] = Game(_player1, _player2, "", new uint8[](100), 1, false);
        gameId++;
    }

    function getGame(uint256 _gameId) external view returns (Game memory) {
        return games[_gameId];
    }

    function setStoreId(uint256 _gameId, string memory _storeId) external {
        games[_gameId].store_id = _storeId;
    }
}
