// SPDX-License-Identifier: MIT

pragma solidity ^0.8.21;

import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

library BattleshipURI {
    function constructUserURI(string memory username, uint256 id) public pure returns (string memory) {
        return string(
            abi.encodePacked(
                "{",
                "'name': '",
                "Battleship #",
                Strings.toString(id),
                "',",
                "'image': '",
                "ipfs://QmPvMXDRMbYVqjVG9Wv8ednnKZDMSDecH9ti3xJaY2gzzA/user.jpeg',",
                "'attributes': [",
                "{",
                "'trait_type': 'Username',",
                "'value': '",
                username,
                "'",
                "},]}"
            )
        );
    }

    function constructBattleshipURI() public pure returns (string memory) {
        return "ipfs://Qmf7BiGVDsKk4V9nG4joUdh7bJUuvxoiBviUEtC5vMTtYn/battleship.json";
    }

    function constructCarrierURI() public pure returns (string memory) {
        return "ipfs://Qmf7BiGVDsKk4V9nG4joUdh7bJUuvxoiBviUEtC5vMTtYn/carrier.json";
    }

    function constructDestroyerURI() public pure returns (string memory) {
        return "ipfs://Qmf7BiGVDsKk4V9nG4joUdh7bJUuvxoiBviUEtC5vMTtYn/destroyer.json";
    }

    function constructSubmarineURI() public pure returns (string memory) {
        return "ipfs://Qmf7BiGVDsKk4V9nG4joUdh7bJUuvxoiBviUEtC5vMTtYn/submarine.json";
    }

    function constructCruiserURI() public pure returns (string memory) {
        return "ipfs://Qmf7BiGVDsKk4V9nG4joUdh7bJUuvxoiBviUEtC5vMTtYn/cruiser.json";
    }
}
