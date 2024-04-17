// SPDX-License-Identifier: MIT

pragma solidity ^0.8.21;

import "../interfaces/IBattleshipGame.sol";

event GameStarted(uint256 gameId);

library GameLibrary {
    function checkDuplicate(uint8[] memory moves, uint8 move) internal pure {
        for (uint256 i = 0; i < moves.length; i++) {
            if (moves[i] == move) {
                revert DuplicateMove();
            }
        }
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
}
