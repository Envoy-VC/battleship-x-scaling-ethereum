// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";

import {BattleshipX} from "../src/BattleshipX.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.parseUint("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80");
        address deployerAddress = vm.addr(deployerPrivateKey);
        vm.startBroadcast(deployerPrivateKey);

        BattleshipX battleship = new BattleshipX("", 10000, deployerAddress, 3);
        battleship.setAutoAcceptCollection(address(battleship), true);
        console2.log("BattleshipX deployed at", address(battleship));

        string memory path = "../../apps/web/src/lib/constants.json";
        vm.assertTrue(vm.exists(path));
        vm.writeJson(vm.toString(address(battleship)), path, ".BATTLESHIP_GAME_ADDRESS");

        vm.stopBroadcast();
    }
}
