// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Test, console2} from "forge-std/Test.sol";

import {VmSafe} from "forge-std/Vm.sol";
import {BattleshipX} from "../src/BattleshipX.sol";
import {MockRMRKRegistry} from "../src/mocks/MOCKRMRKRegistry.sol";
import {IERC7401} from "@rmrk-team/evm-contracts/contracts/RMRK/nestable/IERC7401.sol";

contract CounterTest is Test {
    BattleshipX public battleship;
    MockRMRKRegistry public rmrkRegistry;
    VmSafe.Wallet public owner;
    VmSafe.Wallet public user;

    function setUp() public {
        owner = vm.createWallet("owner");
        user = vm.createWallet("user");
        battleship = new BattleshipX("", 10000, owner.addr, 3);
        rmrkRegistry = new MockRMRKRegistry();
        rmrkRegistry.addExternalCollection(address(battleship), "");
        battleship.setAutoAcceptCollection(address(battleship), true);
        console2.log(address(battleship));
    }

    function test_registerUser() external {
        uint256 parentId = battleship.register(user.addr, "envoy1084");
        uint256 balance = battleship.balanceOf(user.addr);
        assertEq(balance, 1);

        IERC7401.Child[] memory children = battleship.childrenOf(parentId);
        for (uint256 i = 0; i < children.length; i++) {
            console2.log("Token Id: ", children[i].tokenId);
        }
        assertEq(children.length, 5);
    }
}
