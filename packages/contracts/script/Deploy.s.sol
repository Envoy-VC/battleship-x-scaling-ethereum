// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Script.sol";

import {BattleshipGame} from "../src/BattleshipGame.sol";
import {BattleshipX} from "../src/BattleshipX.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.parseUint("0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80");
        address deployerAddress = vm.addr(deployerPrivateKey);
        vm.startBroadcast(deployerPrivateKey);

        BattleshipGame game = new BattleshipGame(deployerAddress);
        console2.log("BattleshipGame deployed at", address(game));

        string memory path = "../../apps/web/src/lib/constants.json";
        vm.assertTrue(vm.exists(path));
        vm.writeJson(vm.toString(address(game)), path, ".BATTLESHIP_GAME_ADDRESS");

        vm.stopBroadcast();
    }
}
