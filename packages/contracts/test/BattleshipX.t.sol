// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test, console2} from "forge-std/Test.sol";

import {VmSafe} from "forge-std/Vm.sol";
import {BattleshipX} from "../src/BattleshipX.sol";

contract CounterTest is Test {
    BattleshipX public battleship;
    VmSafe.Wallet public owner;

    function setUp() public {
        owner = vm.createWallet("owner");
        battleship = new BattleshipX("", 10000, owner.addr, 0, 0);
        console2.log(address(battleship));
    }

    function testCreateGame() public {
        console2.log(address(battleship));
    }
}
