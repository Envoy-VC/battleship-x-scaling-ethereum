// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Script.sol";

import {BattleshipX} from "../src/BattleshipX.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployerAddress = vm.addr(deployerPrivateKey);
        vm.startBroadcast(deployerPrivateKey);

        console.log("Deploying BattleshipX with deployer address", deployerAddress);

        BattleshipX battleship = new BattleshipX("", 10000, deployerAddress, 0);
        battleship.setAutoAcceptCollection(address(battleship), true);
        console2.log("BattleshipX deployed at", address(battleship));

        string memory path = "../../apps/web/src/lib/constants.json";
        vm.assertTrue(vm.exists(path));
        vm.writeJson(vm.toString(address(battleship)), path, ".BATTLESHIP_GAME_ADDRESS");

        vm.stopBroadcast();
    }
}
