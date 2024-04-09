// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test, console2} from "forge-std/Test.sol";

import {VmSafe} from "forge-std/Vm.sol";
import {BattleshipX} from "../src/BattleshipX.sol";

contract CounterTest is Test {
    BattleshipX public battleship;
    VmSafe.Wallet public owner;
    VmSafe.Wallet public user;

    function setUp() public {
        owner = vm.createWallet("owner");
        user = vm.createWallet("user");
        battleship = new BattleshipX("", 10000, owner.addr, 0);
        console2.log(address(battleship));
    }

    function test_registerUser() external {
        battleship.register(user.addr, "envoy1084");
        uint256 tokenId = battleship._ownedTokens(user.addr, 0);
        console2.log("Token ID: ", tokenId);

        // assertEq(battleship.balanceOf(user.addr), 1);
    }
}
